/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('product_featured').then(async () => {
    const ids = Array.from({ length: 10 }, (_, index) => index + 1);

    const existingRecords = await knex('product_featured').whereIn('id', ids);
    const existingIds = existingRecords.map(record => record.id);

    const arr = ids.map(id => ({
      id,
      categoryFeaturedId: id <= 5 ? 1 : 2,
      productId: id,
      createdAt: new Date(new Date().getTime() + id * 60000),
      updatedAt: new Date(new Date().getTime() + id * 60000)
    }));

    const toUpdate = arr.filter(item => existingIds.includes(item.id));
    const toInsert = arr.filter(item => !existingIds.includes(item.id));

    for (const item of toUpdate) {
      await knex('product_featured').where('id', item.id).update(item);
    }

    if (toInsert.length > 0) {
      await knex('product_featured').insert(toInsert);
    }

    await knex.raw(
      "SELECT setval(pg_get_serial_sequence('product_featured', 'id'), COALESCE(MAX(id), 1)) FROM product_featured"
    );
  });
};
