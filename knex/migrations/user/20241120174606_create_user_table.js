/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('user', function (table) {
    table.increments();
    table.integer('fileId').references('file.id').onDelete('CASCADE');
    table.integer('roleId').notNullable().references('role.id').onDelete('CASCADE');
    table.string('phone').notNullable();
    table.string('email');
    table.string('password');
    table.string('fullName');
    table.string('address');
    table.enu('status', ['active', 'inactive']).defaultTo('active');
    table.datetime('lastLoginAt');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('user');
};
