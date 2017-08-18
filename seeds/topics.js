
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('topics').del()
    .then(function () {
      // Inserts seed entries
      return knex('topics').insert([
        {topic: 'News'},
        {topic: 'Pics'},
        {topic: 'Funny'},
        {topic: 'World News'},
        {topic: 'Videos'},
        {topic: 'Aww'},
        {topic: 'Today I Learned'},
        {topic: 'Gaming'},
        {topic: 'Gifs'},
        {topic: 'Movies'}
      ]);
    });
};
