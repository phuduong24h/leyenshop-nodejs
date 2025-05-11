/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  const bcrypt = require('bcrypt');

  // Deletes ALL existing entries
  await knex('user').del();
  await knex('user').insert([
    {
      id: 1,
      roleId: 1,
      phone: '09123123123',
      email: 'admin@gmail.com',
      password: '123123',
      fullName: 'Admin',
      address: 'HCM City',
      status: 'active',
      lastLoginAt: new Date()
    },
    {
      id: 2,
      roleId: 2,
      phone: '0912345678',
      email: 'wind@gmail.com',
      password: bcrypt.hashSync('123123', bcrypt.genSaltSync(10)),
      fullName: 'Wind',
      address: 'HCM City',
      status: 'active',
      lastLoginAt: new Date()
    }
  ]);
  await knex.raw(`SELECT setval(pg_get_serial_sequence('"user"', 'id'), COALESCE(MAX(id), 1)) FROM "user"`);
};
