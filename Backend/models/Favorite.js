const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  places: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      required: true
    }
  ]
});

const Favorite = mongoose.model("Favorite", favoriteSchema);
module.exports = Favorite;
