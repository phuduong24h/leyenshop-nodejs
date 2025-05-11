/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('promotion', function (table) {
    table.increments();
    table.string('name').notNullable();
    table.enu('type', ['invoice', 'product']).notNullable();
    table.enu('status', ['active', 'inactive']).defaultTo('active'); //active or inactive
    table.dateTime('from');
    table.dateTime('to');
    table.integer('minAmount');
    table.float('discount').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('promotion');
};
