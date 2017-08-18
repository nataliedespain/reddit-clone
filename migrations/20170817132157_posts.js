
exports.up = function(knex, Promise) {
  return knex.schema.createTable('posts', function(table){
    table.increments();
    table.string('title'); 
    table.string('body');
    table.integer('topic_id');
    table.integer('user_id');
    table.timestamps(true, true);
  })
};
exports.down = function(knex, Promise) {
  return knex.schema.dropTable('posts');
};