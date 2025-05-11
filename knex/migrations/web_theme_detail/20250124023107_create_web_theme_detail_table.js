/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('web_theme_detail', function (table) {
    table.increments();
    table.integer('webThemeId').references('web_theme.id').onDelete('CASCADE');
    table.string('name');
    table.string('code');
    table.string('color');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('web_theme_detail');
};
