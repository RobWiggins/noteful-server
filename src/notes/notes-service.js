'use strict';

const NotesService = {
  getAllNotes(knex) {
    return knex.select('*').from('notes');
  },
  addNote(db, note) {

  },
  getNoteById(db, noteId) {

  },
  deleteNote(db, noteId) {

  },
  updateNote(db, noteId, newNote) {

  }

};

module.exports = NotesService;