/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('file').then(async () => {
    const ids = Array.from({ length: 100 }, (_, index) => index + 1);

    const existingRecords = await knex('file').whereIn('id', ids);
    const existingIds = existingRecords.map(record => record.id);

    const arr = ids.map(id => ({
      id,
      url: 'https://www.btaskee.com/wp-content/uploads/2024/01/mam-banh-keo-ngay-tet-cac-loai-mut.jpg',
      name: `Hình ảnh ${id}`,
      fileType: 'image',
      createdAt: new Date(new Date().getTime() + id * 60000),
      updatedAt: new Date(new Date().getTime() + id * 60000)
    }));

    const toUpdate = arr.filter(item => existingIds.includes(item.id));
    const toInsert = arr.filter(item => !existingIds.includes(item.id));

    for (const item of toUpdate) {
      await knex('file').where('id', item.id).update(item);
    }

    if (toInsert.length > 0) {
      await knex('file').insert(toInsert);
    }

    await knex.raw("SELECT setval(pg_get_serial_sequence('file', 'id'), COALESCE(MAX(id), 1)) FROM file");
  });
};
