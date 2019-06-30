'use strict';

const express = require('express');
const knex = require('knex');
const path = require('path'); // need? join posix?
const NotesService = require('./notes-service');
const xss = require('xss');

const notesRouter = express.Router();
const jsonBodyParser = express.json();

const serializeNote = note => ({
  id: note.id,
  title: xss(note.title),
  modified: note.modified,
  folderId: note.folderId,
  content: xss(note.content),
});

notesRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    NotesService.getAllNotes(knexInstance)
      .then(notes => res.json(notes.map(serializeNote)))
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { title, content, folderid } = req.body;
    const newNote = { title, content };
    for (const [key, value] of Object.entries(newNote)) {
      if (key === 'content' && !value) {
        newNote.content = '';
      }
      if (key === 'title' && title === null) {
        return res.status(400).json({
          error: { message: `Missing ${key} in required body` },
        });
      }
    }
    newNote['folderid'] = Number(folderid);
    NotesService.insertNote(req.app.get('db'), newNote)
      .then(note => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${note.id}`))
          .json(serializeNote(note));
      })
      .catch(next);
  })
  .patch((req, res, next) => {})
  .delete((req, res, next) => {});

module.exports = notesRouter;
