const UserController = require("./userController");
const BookController = require("./bookController");

function initializeControllers(models) {
  return {
    user: new UserController(models),
    book: new BookController(models),
  };
}

module.exports = { initializeControllers };
