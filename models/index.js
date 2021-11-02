const mongoose = require('mongoose');

const mongooseConecction = async () => {
  mongoose.set('debug', { shell: true });
  await mongoose.connect('mongodb://localhost:27017/backend-crud-project');
}

module.exports = mongooseConecction;
