/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('web_theme_detail').then(async () => {
    const ids = Array.from({ length: 10 }, (_, index) => index + 1);

    const existingRecords = await knex('web_theme_detail').whereIn('id', ids);
    const existingIds = existingRecords.map(record => record.id);

    const arr = ids.map(id => ({
      id,
      webThemeId: id < 5 ? 1 : 2,
      name: `Chi tiết theme ${id}`,
      code: '--primary',
      color: '#000000',
      createdAt: new Date(new Date().getTime() + id * 60000),
      updatedAt: new Date(new Date().getTime() + id * 60000)
    }));

    const toUpdate = arr.filter(item => existingIds.includes(item.id));
    const toInsert = arr.filter(item => !existingIds.includes(item.id));

    for (const item of toUpdate) {
      await knex('web_theme_detail').where('id', item.id).update(item);
    }

    if (toInsert.length > 0) {
      await knex('web_theme_detail').insert(toInsert);
    }

    await knex.raw(
      "SELECT setval(pg_get_serial_sequence('web_theme_detail', 'id'), COALESCE(MAX(id), 1)) FROM web_theme_detail"
    );
  });
};
