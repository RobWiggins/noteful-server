'use strict';

const express = require('express');
const knex = require('knex');
const path = require('path'); // need? join posix?
const FoldersService = require('./folders-service');
const xss = require('xss');

const foldersRouter = express.Router();
const jsonBodyParser = express.json();

const serializeNote = folder => ({
  title: xss(folder.title),
});

foldersRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    FoldersService.getAllFolders(knexInstance)
      .then(response => res.json(response))
      .catch(next);
  })
  .post((req, res, next) => {
    
  })
  .patch((req, res, next) => {
    
  })
  .delete((req, res, next) => {
    
  });

module.exports = foldersRouter;
