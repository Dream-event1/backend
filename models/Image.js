const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  category: { type: String, required: true },
  imageUrls: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Image', imageSchema);