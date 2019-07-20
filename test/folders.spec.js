/* global supertest*/
'use strict';

const app = require('../src/app');
const { expect } = require('chai');
const knex = require('knex');
const folderHelpers = require('./folder-helpers');
const makeNotes = require('./note-helpers');
const only = require('mocha').only;

describe('Testing folders endpoints', () => {
  const testFolders = folderHelpers.makeFolders();

  let db;

  before('make knex instance for db', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean the table', () =>
    db.raw('TRUNCATE notes, folders RESTART IDENTITY CASCADE')
  );

  describe('GET /folders', () => {
    beforeEach('insert folders into db', () => {
      return testFolders.forEach(folder =>
        folderHelpers.seedFolder(db, folder)
      );
    });

    afterEach('clean tables', () => {
      return db.raw(`TRUNCATE notes, folders RESTART IDENTITY CASCADE`);
    });

    it('returns all folders from db', () => {
      supertest(app)
        .get('/folders')
        .expect(200)
        .expect(res => {
          expect(res.body.length).to.eql(3);
          expect(res.body[2].folder_name).to.eql('folder3');
        });
    });
  });

  describe('POST /folders', () => {
    beforeEach('insert folders into db', () => {
      return testFolders.forEach(folder =>
        folderHelpers.seedFolder(db, folder)
      );
    });

    afterEach('clean tables', () => {
      return db.raw(`TRUNCATE notes, folders RESTART IDENTITY CASCADE`);
    });

    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: {
        name: 'folder4',
      },
    };

    it('adds a new folder to existing list', () => {
      supertest(app)
        .post('/folders', options)
        .expect(201)
        .expect(res => {
          expect(folderHelpers.getAllFolders(db).length).to.eql(4);
          expect(folderHelpers.getAllFolders(db)[3].folder_name).to.equal(
            'folder4'
          );
        });
    });
  });

  describe('DELETE /folders', () => {
    beforeEach('insert folders into db', () => {
      return testFolders.forEach(folder =>
        folderHelpers.seedFolder(db, folder)
      );
    });
    afterEach('clean tables', () => {
      return db.raw(`TRUNCATE notes, folders RESTART IDENTITY CASCADE`);
    });
    const body = JSON.stringify({
      folderId: 3,
    });
    const options = {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      body,
    };
    it('deletes a folder', () => {
      supertest(app)
        .delete('/folders', options)
        .expect(204)
        .expect(res => {
          expect(folderHelpers.getAllFolders(db).length).to.equal(2)
          expect(folderHelpers.getAllFolders(db)[1].folder_name.to.eql('folder2'));
        });
    });
  });

  describe('PATCH /folders', () => {
    beforeEach('insert folders into db', () => {
      return testFolders.forEach(folder =>
        folderHelpers.seedFolder(db, folder)
      );
    });
    afterEach('clean tables', () => {
      return db.raw(`TRUNCATE notes, folders RESTART IDENTITY CASCADE`);
    });
    const body = JSON.stringify({
      folderId: 3,
      name: 'new folder3'
    });
    const options = {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body,
    };
    it('updates/changes a folder name', () => {
      supertest(app)
        .patch('/folders', options)
        .expect(204)
        .expect(res => {
          expect(folderHelpers.getAllFolders(db)[2].folder_name).to.eql('new folder3');
        });
    });

  });
});
