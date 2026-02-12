const { ObjectId } = require("mongodb");

class UserModel {
  constructor(collection) {
    this.collection = collection;
  }

  async findByEmail(email) {
    return await this.collection.findOne({ email });
  }

  async findById(id) {
    return await this.collection.findOne({
      _id: new ObjectId(id),
    });
  }

  async create(userData) {
    const newUser = {
      ...userData,
      role: userData.role || "user",
      createdAt: new Date(),
    };

    return await this.collection.insertOne(newUser);
  }

  async updateRole(email, role) {
    return await this.collection.updateOne(
      { email },
      { $set: { role } }
    );
  }

  async updateRoleById(id, role) {
    return await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { role } }
    );
  }

  async findAll() {
    return await this.collection
      .find()
      .sort({ createdAt: -1 })
      .toArray();
  }

  async exists(email) {
    const user = await this.findByEmail(email);
    return !!user;
  }
}

module.exports = UserModel;
