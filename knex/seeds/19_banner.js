/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('banner').then(async () => {
    const ids = Array.from({ length: 10 }, (_, index) => index + 1);

    const existingRecords = await knex('banner').whereIn('id', ids);
    const existingIds = existingRecords.map(record => record.id);

    const arr = ids.map(id => ({
      id,
      fileId: 1,
      isPin: id > 7,
      createdAt: new Date(new Date().getTime() + id * 60000),
      updatedAt: new Date(new Date().getTime() + id * 60000)
    }));

    const toUpdate = arr.filter(item => existingIds.includes(item.id));
    const toInsert = arr.filter(item => !existingIds.includes(item.id));

    for (const item of toUpdate) {
      await knex('banner').where('id', item.id).update(item);
    }

    if (toInsert.length > 0) {
      await knex('banner').insert(toInsert);
    }

    await knex.raw("SELECT setval(pg_get_serial_sequence('banner', 'id'), COALESCE(MAX(id), 1)) FROM banner");
  });
};
