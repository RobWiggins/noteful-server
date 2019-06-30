'use strict';

const express = require('express');
const knex = require('knex');
const path = require('path'); // need? join posix?
const NotesService = require('./notes-service');
const xss = require('xss');

const notesRouter = express.Router();
const jsonBodyParser = express.json();

const serializeNote = note => ({
  title: xss(note.note_name),
  folderId: note.folderId,
  content: xss(note.content),
});

notesRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    NotesService.getAllNotes(knexInstance)
      .then(response => res.status(200).json(response))
      .catch(next);
  })
  .post((req, res, next) => {
     
  })
  .patch((req, res, next) => {
    
  })
  .delete((req, res, next) => {
    
  });

module.exports = notesRouter;
