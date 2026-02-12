const { ObjectId } = require("mongodb");

class UserModel {
  constructor(collection) {
    this.collection = collection;
  }

  //  Find user by email
  async findByEmail(email) {
    return await this.collection.findOne({ email });
  }

  //  Find user by ID
  async findById(id) {
    return await this.collection.findOne({
      _id: new ObjectId(id),
    });
  }

  //  Create new user
  async create(userData) {
    userData.role = userData.role || "user"; // default role
    userData.createdAt = new Date();

    return await this.collection.insertOne(userData);
  }

  //  Update role by email
  async updateRole(email, role) {
    return await this.collection.updateOne(
      { email },
      { $set: { role } }
    );
  }

  //  Update role by ID (optional but useful)
  async updateRoleById(id, role) {
    return await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { role } }
    );
  }

  //  Get all users
  async findAll() {
    return await this.collection
      .find()
      .sort({ createdAt: -1 })
      .toArray();
  }

  //  Check if user exists
  async exists(email) {
    const user = await this.collection.findOne({ email });
    return !!user;
  }
}

module.exports = UserModel;
