const Article = require('../models/Article');

exports.likeArticle = async (req, res) => {
  try {
    const articleId = req.params.id;
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    article.likeCount += 1;
    await article.save();
    res.json({ message: 'Article liked', likeCount: article.likeCount });
  } catch (error) {
    res.status(500).json({ message: 'Error liking article' });
  }
};
