/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('web_info', function (table) {
    table.increments();
    table.string('name');
    table.string('logo');
    table.string('phone');
    table.text('address');
    table.string('zalo');
    table.string('zaloLink');
    table.string('facebook');
    table.string('facebookLink');
    table.text('contact');
    table.text('aboutUs');
    table.text('shippingPolicy');
    table.text('returnPolicy');
    table.text('termOfService');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('web_info');
};
