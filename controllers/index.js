const UserController = require("./userController");

function initializeControllers(models) {
  return {
    user: new UserController(models),
  };
}

module.exports = { initializeControllers };
