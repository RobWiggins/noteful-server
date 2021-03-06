'use strict';

const express = require('express');
const knex = require('knex');
const path = require('path');
const NotesService = require('./notes-service');
const xss = require('xss');

const notesRouter = express.Router();
const jsonBodyParser = express.json();

const serializeNote = note => ({
  id: note.id,
  title: xss(note.title),
  modified: note.modified,
  folderId: note.folderid,
  content: xss(note.content),
});

notesRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    NotesService.getAllNotes(knexInstance)
      .then(notes => {
        return res.json(notes.map(serializeNote));
      })
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { title, content, folderId } = req.body;
    const newNote = { title, content };
    if (!content) {
      newNote.content = '';
    }
    if (!title) {
      return res.status(400).json({
        error: { message: 'Missing title in required body' },
      });
    }
    newNote['folderid'] = parseInt(folderId);
    NotesService.insertNote(req.app.get('db'), newNote)
      .then(note => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${note.id}`))
          .json(serializeNote(note));
      })
      .catch(next);
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const { title, content, noteId, folderId } = req.body;
    const noteToUpdate = { title, content };

    const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: 'Request body must contain either "title" or "content"',
        },
      });

    const today = new Date();
    noteToUpdate.modified = today;

    NotesService.updateNote(req.app.get('db'), parseInt(noteId), noteToUpdate)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  })
  .delete(jsonBodyParser, (req, res, next) => {
    let noteId = req.body.id;
    NotesService.deleteNote(req.app.get('db'), parseInt(noteId))
      .then(() => res.status(204).end())
      .catch(next);
  });

module.exports = notesRouter;
