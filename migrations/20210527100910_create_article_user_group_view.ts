import * as Knex from 'knex';
export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    CREATE OR REPLACE VIEW article_user_group_view AS
    SELECT 
    A.article_id, 
    A.created_user_id, 
    A.article_nme, 
    A.article_content, 
    A.group_id, 
    A.only_me, 
    A.created_tms,
    U.user_nme, 
    U.display_nme, 
    U.icon_url,
    G.group_nme,
    G.group_intro
    FROM "article" AS A 
    LEFT JOIN "user" AS U ON A.created_user_id = U.user_id
    LEFT JOIN "group" AS G ON A.group_id = G.group_id
    `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    DROP VIEW article_user_group_view;
    `);
}
