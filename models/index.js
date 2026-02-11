const UserModel = require("./User");
const BookModel = require("./Book");

function initializeModels(collections) {
  return {
    User: new UserModel(collections.users),
    Book: new BookModel(collections.books),
  };
}

module.exports = { initializeModels };
