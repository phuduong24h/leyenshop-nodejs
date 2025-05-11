/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('promotion').then(async () => {
    const ids = Array.from({ length: 10 }, (_, index) => index + 1);

    const existingRecords = await knex('promotion').whereIn('id', ids);
    const existingIds = existingRecords.map(record => record.id);

    const arr = ids.map(id => ({
      id,
      name: `Giảm giá ${id}`,
      type: 'product',
      status: 'active',
      from: new Date(),
      to: new Date(),
      minAmount: id * 1000,
      discount: 0.5,
      createdAt: new Date(new Date().getTime() + id * 60000),
      updatedAt: new Date(new Date().getTime() + id * 60000)
    }));

    const toUpdate = arr.filter(item => existingIds.includes(item.id));
    const toInsert = arr.filter(item => !existingIds.includes(item.id));

    for (const item of toUpdate) {
      await knex('promotion').where('id', item.id).update(item);
    }

    if (toInsert.length > 0) {
      await knex('promotion').insert(toInsert);
    }

    await knex.raw("SELECT setval(pg_get_serial_sequence('promotion', 'id'), COALESCE(MAX(id), 1)) FROM promotion");
  });
};
