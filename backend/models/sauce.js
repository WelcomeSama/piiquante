const mongoose = require("mongoose");

const saucesSchema = mongoose.Schema({
  userId: String,
  name: String,
  manufacturer: String,
  description: String,
  mainPepper: String,
  imageUrl: String,
  heat: Number,
  //likes: Number,
  //dislikes: Number,
 // usersLiked: ["String <userId>"],
 // usersDisliked: ["String <userId>"],
});

module.exports = mongoose.model('Sauce', saucesSchema);