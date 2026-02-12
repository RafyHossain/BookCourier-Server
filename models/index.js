const UserModel = require("./User");
const BookModel = require("./Book");
const OrderModel = require("./Order");
const LibrarianRequestModel = require("./librarianRequest");

function initializeModels(collections) {
  return {
    User: new UserModel(collections.users),
    Book: new BookModel(collections.books),
    LibrarianRequest: new LibrarianRequestModel(collections.librarianRequests),
    Order: new OrderModel(collections.orders),

    
  };
}

module.exports = { initializeModels };
