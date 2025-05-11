/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('order').then(async () => {
    const ids = Array.from({ length: 10 }, (_, index) => index + 1);

    const existingRecords = await knex('order').whereIn('id', ids);
    const existingIds = existingRecords.map(record => record.id);

    const arr = ids.map(id => ({
      id,
      userId: null,
      orderCode: `PY-202501301000${id < 10 ? '0' : ''}${id}`,
      customerName: 'Nguyễn Văn A',
      customerPhone: '09.123.456.78',
      customerAddress: '123 Nguyễn Văn A, Quận 1, TP.HCM',
      totalPrice: id * 1000000,
      shippingFee: id * 10000,
      paymentPaid: 0,
      paymentMethod: 'cash',
      paymentStatus: 'paid',
      createdAt: new Date(new Date().getTime() + id * 60000),
      updatedAt: new Date(new Date().getTime() + id * 60000)
    }));

    const toUpdate = arr.filter(item => existingIds.includes(item.id));
    const toInsert = arr.filter(item => !existingIds.includes(item.id));

    for (const item of toUpdate) {
      await knex('order').where('id', item.id).update(item);
    }

    if (toInsert.length > 0) {
      await knex('order').insert(toInsert);
    }

    await knex.raw(`SELECT setval(pg_get_serial_sequence('"order"', 'id'), COALESCE(MAX(id), 1)) FROM "order"`);
  });
};
