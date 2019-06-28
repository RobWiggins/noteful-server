'use strict';
const knex = require('knex');

const NotesService = {
  getAllNotes(db) {
    return db('notes')
      .select('*');
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