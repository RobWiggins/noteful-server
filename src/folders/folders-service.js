'use strict';

const FoldersService = {
  getAllFolders(knex) {
    return knex.select('*').from('folders');
  },
  addFolder(db, folder) {

  },
  getFolderById(db, folderId) {

  },
  deleteFolder(db, folderId) {

  },
  updateFolder(db, folderId, newFolder) {

  }

};

module.exports = FoldersService;