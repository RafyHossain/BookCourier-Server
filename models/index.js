const UserModel = require("./User");
const BookModel = require("./Book");
const OrderModel = require("./Order");
const LibrarianRequestModel = require("./librarianRequest");
const WishlistModel = require("./wishlist");
const ReviewModel = require("./review");


function initializeModels(collections) {
  return {
    User: new UserModel(collections.users),
    Book: new BookModel(collections.books),
    LibrarianRequest: new LibrarianRequestModel(collections.librarianRequests),
    Order: new OrderModel(collections.orders),
    Wishlist: new WishlistModel(collections.wishlist),
    Review: new ReviewModel(collections.reviews),


    
  };
}

module.exports = { initializeModels };
