const Article = require('../models/Article'); // تأكد من صحة اسم الملف والموديل

// دالة لإنشاء مقال جديد
const createArticle = async (req, res) => {
  try {
    const { title, content, content_1, imageSrc, tags, date, views, createdAt, updatedAt, likeCount } = req.body;

    // إنشاء مقال جديد
    const newArticle = await Article.create({
      title,
      content,
      content_1,
      imageSrc,
      tags,
      date,
      views,
      createdAt,
      updatedAt,
      likeCount,
    });

    res.status(201).json({ message: "تم إنشاء المقال بنجاح", article: newArticle });
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ message: "حدث خطأ أثناء إضافة المقال", error });
  }
};

// دالة لإحضار مقال معين حسب الـ ID
const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id); // استخدم Mongoose للبحث

    if (!article) {
      return res.status(404).json({ message: "المقال غير موجود" });
    }

    res.status(200).json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب المقال", error });
  }
};



// دالة لإحضار جميع المقالات
const getAllArticles = async (req, res) => {
  try {
    // جلب فقط المقالات التي لم تُحذف (isDeleted: false)
    const articles = await Article.find({ isDeleted: false });

    if (articles.length === 0) {
      return res.status(404).json({ message: "لا توجد مقالات" });
    }

    res.status(200).json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب المقالات", error });
  }
};


module.exports = { createArticle, getArticleById, getAllArticles };