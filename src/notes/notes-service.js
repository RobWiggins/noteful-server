'use strict';

const NotesService = {
  getAllNotes(knex) {
    return knex.select('*').from('notes');
  },
  addNote(knex, note) {
    return knex
      .insert(note)
      .into('notes')
      .returning('*')
      .then(rows => rows[0]);
  },
  getNoteById(knex, noteId) {
    return knex
      .select('*')
      .from('notes')
      .where('id', noteId)
      .first();
  },
  deleteNote(knex, noteId) {
    return knex('notes')
      .where('id', noteId)
      .delete();
  },
  updateNote(knex, noteId, newNote) {
    return knex('notes')
      .where('id', noteId)
      .update(newNote);
  },
};

module.exports = NotesService;
