'use strict';

/* TODO INCOMPLETE TESTING NOTES */

const app = require('../src/app');

before();

describe('Testing NotesService and notesRouter', () => {
  it('GET /notes responds with 200 containing all notes', () => {
    return supertest(app)
      .get('/notes')
      .expect(200, 'Hello, server and boilerplate!');
  });

  it()
});