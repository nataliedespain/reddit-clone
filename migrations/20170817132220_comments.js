
exports.up = function(knex, Promise) {
  return knex.schema.createTable('comments', function(table){
    table.increments(); 
    table.string('body');
    table.integer('post_id');
    table.integer('user_id');
    table.timestamps(true, true);
  })
};
exports.down = function(knex, Promise) {
  return knex.schema.dropTable('comments');
};