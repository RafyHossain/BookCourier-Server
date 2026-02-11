const UserModel = require("./User");

function initializeModels(collections) {
  return {
    User: new UserModel(collections.users),
  };
}

module.exports = { initializeModels };
