'use strict';

const noteHelpers = {
  makeNotes: function makeNotes() {
    return ([
      {
        title: 'note1',
        folderid: 1,
        content: 'content1',
      },
      {
        title: 'note2',
        folderid: 1,
        content: 'content2',
      },
      {
        title: 'note3',
        folderid: 2,
        content: 'content3',
      },
      {
        title: 'note4',
        folderid: 3,
        content: 'content4',
      },
    ]);
  },
  getAllNotes: function getAllNotes(knex) {
    return knex.raw(`SELECT * FROM TABLE notes`);
  },
  seedNote: function seedNote(knex, note) {
    return knex
      .insert(note)
      .into('notes')
      .returning('*')
      .then(rows => rows[0]);
  }
};

module.exports = noteHelpers;
