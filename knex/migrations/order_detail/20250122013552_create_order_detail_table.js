/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('order_detail', function (table) {
    table.increments();
    table.integer('orderId').references('order.id').onDelete('CASCADE');
    table.integer('productId').references('product.id').onDelete('CASCADE');
    table.integer('sizeId').references('size.id').onDelete('CASCADE');
    table.integer('colorId').references('color.id').onDelete('CASCADE');
    table.integer('quantity');
    table.integer('unitPrice');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('order_detail');
};
