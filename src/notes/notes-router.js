'use strict';

const express = require('express');
const knex = require('knex');
const path = require('path'); // need? join posix?
const NotesService = require('./notes-service');
const xss = require('xss');

const notesRouter = express.Router();
const jsonBodyParser = express.json();

const serializeNote = note => ({
  id: note.id, // need to mess with ID?? Automatic??
  title: xss(note.note_name),
  modified: note.modified,
  folderId: note.folderId,
  content: xss(note.content),
});

notesRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    NotesService.getAllNotes(knexInstance)
      .then(response => res.json(response))
      .catch(next);
  })
  .post((req, res, next) => {
    
  })
  .patch((req, res, next) => {
    
  })
  .delete((req, res, next) => {
    
  });

module.exports = notesRouter;
