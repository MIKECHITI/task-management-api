const mongoose = require("mongoose");

beforeAll(async () => {
  const url = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/task_management_test";
  await mongoose.connect(url);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});
