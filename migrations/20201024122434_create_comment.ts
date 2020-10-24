import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('comment', function (table) {
    table
      .uuid('comment_id')
      .notNullable()
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('article_id').notNullable();
    table.foreign('article_id').references('article_id').inTable('article');
    table.text('comment_txt').notNullable();
    table.timestamp('created_tms').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_tms').notNullable().defaultTo(knex.fn.now());
    table.uuid('created_user_id').notNullable();
    table.foreign('created_user_id').references('user_id').inTable('user');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('comment');
}
