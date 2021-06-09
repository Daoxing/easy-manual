import * as Knex from 'knex';
export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    CREATE OR REPLACE VIEW group_user_view AS
    SELECT 
    UIG.*,
    G.created_user_id,
    G.group_nme,
    G.group_intro,
    G.created_tms,
    G.deleted,
    U.user_nme, 
    U.display_nme, 
    U.icon_url
    FROM "user_in_group" AS UIG  
    LEFT JOIN "group" AS G ON G.group_id = UIG.group_id 
    LEFT JOIN "user" AS U ON U.user_id = G.created_user_id
    `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
  DROP VIEW group_user_view;
  `);
}
