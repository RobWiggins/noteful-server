/* global supertest*/
'use strict';

const app = require('../src/app');
const { expect } = require('chai');
const knex = require('knex');
const folderHelpers = require('./folder-helpers');
const noteHelpers = require('./note-helpers');
const only = require('mocha').only;

describe('Testing notes endpoints', () => {
  let db;

  before('make knex instance for db', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  const testFolders = folderHelpers.makeFolders();
  const testNotes = noteHelpers.makeNotes();

  after('disconnect from db', () => db.destroy());

  before('clean the table', () =>
    db.raw('TRUNCATE notes, folders RESTART IDENTITY CASCADE')
  );

  describe('GET /notes', () => {
    beforeEach('insert folders and notes into db', () => {
      return db
        .into('folders')
        .insert(testFolders)
        .then(() => {
          return db.into('notes').insert(testNotes);
        });
    });
    afterEach('clean tables', () => {
      return db.raw(`TRUNCATE notes, folders RESTART IDENTITY CASCADE`);
    });
    it('returns all notes from db', () => {
      return supertest(app)
        .get('/notes')
        .expect(200)
        .expect(res => {
          expect(res.body.length).to.eql(4);
          expect(res.body[2].title).to.eql('note3');
        });
    });
  });

  describe('POST /notes', () => {
    beforeEach('insert folders and notes into db', () => {
      return db
        .into('folders')
        .insert(testFolders)
        .then(() => {
          return db.into('notes').insert(testNotes);
        });
    });
    afterEach('clean tables', () => {
      return db.raw(`TRUNCATE notes, folders RESTART IDENTITY CASCADE`);
    });
    const dateOBJ = new Date();
    const body = JSON.stringify({
      title: 'note5',
      content: 'content5',
      folderId: '1'
    });

    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: body,
    };
    it('adds a new note to existing list', () => {
      supertest(app)
        .post('/notes', options)
        .expect(201)
        .expect(() => {
          expect(noteHelpers.getAllNotes(db).length).to.eql(5);
          expect(noteHelpers.getAllNotes(db)[4].title).to.eql('note5');
        });
    });
  });

  describe('DELETE /notes', () => {
    beforeEach('insert folders and notes into db', () => {
      return db
        .into('folders')
        .insert(testFolders)
        .then(() => {
          return db.into('notes').insert(testNotes);
        });
    });
    afterEach('clean tables', () => {
      return db.raw(`TRUNCATE notes, folders RESTART IDENTITY CASCADE`);
    });
    const body = JSON.stringify({
      id: '2',
    });
    const options = {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      body,
    };
    it('deletes a note', () => {
      supertest(app)
        .delete('/notes', options)
        .expect(204)
        .expect(res => {
          expect(noteHelpers.getAllNotes(db).length).to.equal(3);
          expect(noteHelpers.getAllNotes(db)[1].id.to.equal(3));
        });
    });
  });

  describe('PATCH /notes', () => {
    beforeEach('insert folders and notes into db', () => {
      return db
        .into('folders')
        .insert(testFolders)
        .then(() => {
          return db.into('notes').insert(testNotes);
        });
    });
    afterEach('clean tables', () => {
      return db.raw(`TRUNCATE notes, folders RESTART IDENTITY CASCADE`);
    });
    const body = JSON.stringify({
      id: 3,
      title: 'new changed note3'
    });
    const options = {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body,
    };
    it('updates/changes a note name', () => {
      supertest(app)
        .patch('/notes', options)
        .expect(204)
        .expect(res => {
          expect(noteHelpers.getAllNotes(db)[2].title).to.eql('new changed note3');
        });
    });
  });
});
