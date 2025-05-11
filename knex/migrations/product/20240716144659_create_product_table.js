/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('product', function (table) {
    table.increments();
    table.string('name').notNullable();
    table.float('price').notNullable;
    table.text('detail');
    table.text('description');
    table.integer('inventoryCount').defaultTo(0);
    table.integer('categoryId').notNullable().references('category.id').onDelete('CASCADE');
    table.integer('promotionId').references('promotion.id').onDelete('CASCADE');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('product');
};
