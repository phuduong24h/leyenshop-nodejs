/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('order', function (table) {
    table.increments();
    table.integer('userId').references('user.id').onDelete('CASCADE');
    table.string('orderCode').unique().notNullable();
    table.string('customerName');
    table.string('customerPhone');
    table.string('customerAddress');
    table.integer('totalPrice');
    table.integer('shippingFee');
    table.integer('paymentPaid');
    table.enum('paymentMethod', ['cash', 'credit']).defaultTo('cash');
    table.enum('paymentStatus', ['unpaid', 'pending', 'paid']).defaultTo('unpaid');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('order');
};
