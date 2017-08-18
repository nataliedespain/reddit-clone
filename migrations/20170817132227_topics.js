
exports.up = function(knex, Promise) {
  return knex.schema.createTable('topics', function(table){
    table.increments();
    table.string('topic'); 
  })
};
exports.down = function(knex, Promise) {
  return knex.schema.dropTable('topics');
};