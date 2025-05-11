/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('size_file').then(async () => {
    const ids = Array.from({ length: 10 }, (_, index) => index + 1);

    const existingRecords = await knex('size_file').whereIn('id', ids);
    const existingIds = existingRecords.map(record => record.id);

    const arr = ids.map(id => ({
      id,
      sizeId: id,
      fileId: id,
      createdAt: new Date(new Date().getTime() + id * 60000),
      updatedAt: new Date(new Date().getTime() + id * 60000)
    }));

    const toUpdate = arr.filter(item => existingIds.includes(item.id));
    const toInsert = arr.filter(item => !existingIds.includes(item.id));

    for (const item of toUpdate) {
      await knex('size_file').where('id', item.id).update(item);
    }

    if (toInsert.length > 0) {
      await knex('size_file').insert(toInsert);
    }

    await knex.raw("SELECT setval(pg_get_serial_sequence('size_file', 'id'), COALESCE(MAX(id), 1)) FROM size_file");
  });
};
