/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('order_detail').then(async () => {
    const ids = Array.from({ length: 10 }, (_, index) => index + 1);

    const existingRecords = await knex('order_detail').whereIn('id', ids);
    const existingIds = existingRecords.map(record => record.id);

    const arr = ids.map(id => ({
      id,
      orderId: id,
      productId: 1,
      sizeId: 1,
      colorId: 1,
      quantity: 10,
      unitPrice: 1000,
      createdAt: new Date(new Date().getTime() + id * 60000),
      updatedAt: new Date(new Date().getTime() + id * 60000)
    }));

    const toUpdate = arr.filter(item => existingIds.includes(item.id));
    const toInsert = arr.filter(item => !existingIds.includes(item.id));

    for (const item of toUpdate) {
      await knex('order_detail').where('id', item.id).update(item);
    }

    if (toInsert.length > 0) {
      await knex('order_detail').insert(toInsert);
    }

    await knex.raw(
      "SELECT setval(pg_get_serial_sequence('order_detail', 'id'), COALESCE(MAX(id), 1)) FROM order_detail"
    );
  });
};
