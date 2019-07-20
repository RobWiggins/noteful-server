/* eslint-disable strict */
const folderHelpers = {
  makeFolders: function makeFolders() {
    return [
      {
        folder_name: 'folder1',
      },
      {
        folder_name: 'folder2',
      },
      {
        folder_name: 'folder3',
      },
    ];
  },
  getAllFolders: function getAllFolders(knex) {
    return knex.raw(`SELECT * FROM TABLE folders`);
  },
  seedFolder: function seedFolder(knex, folder) {
    return knex
      .insert(folder)
      .into('folders')
      .returning('*')
      .then(rows => rows[0]);
  },
};
module.exports = folderHelpers;
