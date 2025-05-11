/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('file', function (table) {
    table.increments();
    table.string('url').notNullable();
    table.string('name').notNullable();
    table.enu('fileType', ['image', 'video', 'audio', 'convert', 'unknown']);
    table.string('mimeType');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('file');
};
