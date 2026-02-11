class UserModel {
  constructor(collection) {
    this.collection = collection;
  }

  async findByEmail(email) {
    return await this.collection.findOne({ email });
  }

  async create(userData) {
    userData.role = "user";
    userData.createdAt = new Date();
    return await this.collection.insertOne(userData);
  }

  
}

module.exports = UserModel;
