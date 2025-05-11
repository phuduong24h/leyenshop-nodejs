/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('product_file').then(async () => {
    const ids = Array.from({ length: 100 }, (_, index) => index + 1);

    const existingRecords = await knex('product_file').whereIn('id', ids);
    const existingIds = existingRecords.map(record => record.id);

    const arr = ids.map(id => ({
      id,
      productId: id,
      fileId: id,
      createdAt: new Date(new Date().getTime() + id * 60000),
      updatedAt: new Date(new Date().getTime() + id * 60000)
    }));

    const toUpdate = arr.filter(item => existingIds.includes(item.id));
    const toInsert = arr.filter(item => !existingIds.includes(item.id));

    for (const item of toUpdate) {
      await knex('product_file').where('id', item.id).update(item);
    }

    if (toInsert.length > 0) {
      await knex('product_file').insert(toInsert);
    }

    await knex.raw(
      "SELECT setval(pg_get_serial_sequence('product_file', 'id'), COALESCE(MAX(id), 1)) FROM product_file"
    );
  });
};
