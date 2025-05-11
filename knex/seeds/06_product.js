/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('product').then(async () => {
    const ids = Array.from({ length: 105 }, (_, index) => index + 1);

    const existingRecords = await knex('product').whereIn('id', ids);
    const existingIds = existingRecords.map(record => record.id);

    const arr = ids.map(id => ({
      id,
      name: `Sản phẩm ${id}`,
      price: id * 100000,
      detail:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies lacinia, nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl. Sed euismod, nisl nec ultricies lacinia, nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl.',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies lacinia, nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl. Sed euismod, nisl nec ultricies lacinia, nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl.',
      inventoryCount: 100,
      categoryId: id <= 10 || id > 100 ? 1 : id,
      promotionId: 2,
      createdAt: new Date(new Date().getTime() + id * 60000),
      updatedAt: new Date(new Date().getTime() + id * 60000)
    }));

    const toUpdate = arr.filter(item => existingIds.includes(item.id));
    const toInsert = arr.filter(item => !existingIds.includes(item.id));

    for (const item of toUpdate) {
      await knex('product').where('id', item.id).update(item);
    }

    if (toInsert.length > 0) {
      await knex('product').insert(toInsert);
    }

    await knex.raw("SELECT setval(pg_get_serial_sequence('product', 'id'), COALESCE(MAX(id), 1)) FROM product");
  });
};
