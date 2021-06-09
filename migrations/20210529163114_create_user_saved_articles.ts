import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_saved_articles', function (table) {
    table.uuid('user_id').notNullable();
    table.foreign('user_id').references('user_id').inTable('user');

    table.uuid('article_id').notNullable();
    table.foreign('article_id').references('article_id').inTable('article');
    table.primary(['user_id', 'article_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('user_saved_articles');
}
