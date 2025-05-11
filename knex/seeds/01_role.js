/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('role').del();
  await knex('role').insert([
    { id: 1, roleName: 'admin' },
    { id: 2, roleName: 'user' }
  ]);
};
