/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('size').then(async () => {
    const ids = Array.from({ length: 10 }, (_, index) => index + 1);

    const existingRecords = await knex('size').whereIn('id', ids);
    const existingIds = existingRecords.map(record => record.id);

    const arr = ids.map(id => ({
      id,
      name: `Kích thước ${id}`,
      sizePrice: id * 10000,
      productId: id <= 5 ? 1 : 2,
      createdAt: new Date(new Date().getTime() + id * 60000),
      updatedAt: new Date(new Date().getTime() + id * 60000)
    }));

    const toUpdate = arr.filter(item => existingIds.includes(item.id));
    const toInsert = arr.filter(item => !existingIds.includes(item.id));

    for (const item of toUpdate) {
      await knex('size').where('id', item.id).update(item);
    }

    if (toInsert.length > 0) {
      await knex('size').insert(toInsert);
    }

    await knex.raw("SELECT setval(pg_get_serial_sequence('size', 'id'), COALESCE(MAX(id), 1)) FROM size");
  });
};
