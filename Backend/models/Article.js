const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    content_1: {
      type: String,
    },
    imageSrc: {
      type: String,
    },
    tags: {
      type: [String], // مصفوفة من النصوص
    },
    date: {
      type: Date,
      default: Date.now,
    },
    views: {
      type: Number,
      default: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    isDeleted: { type: Boolean, default: false },

  },
  { timestamps: true }
);

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
