import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('chapter', function (table) {
    table
      .uuid('chapter_id')
      .notNullable()
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('article_id').notNullable();
    table.foreign('article_id').references('article_id').inTable('article');
    table.text('chapter_title').notNullable();
    table.jsonb('chapter_content').nullable().defaultTo(null);
    table.timestamp('created_tms').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_tms').notNullable().defaultTo(knex.fn.now());
    table.uuid('parent_chapter_id').nullable();
    table
      .foreign('parent_chapter_id')
      .references('chapter_id')
      .inTable('chapter');

    table.bigInteger('order').notNullable().defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('chapter');
}
