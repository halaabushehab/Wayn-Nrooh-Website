import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Blog = () => {
  const [articles, setArticles] = useState([]); // تخزين المقالات
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 4;

  useEffect(() => {
    fetch("http://localhost:9527/articles/") // جلب البيانات
      .then((response) => response.json())
      .then((data) => {
        console.log("البيانات المستلمة:", data); // ✅ تأكد من شكل البيانات
        if (Array.isArray(data)) {
          setArticles(data);
        } else {
          console.error("البيانات المستلمة ليست مصفوفة!", data);
          setArticles([]);
        }
      })
      .catch((error) => console.error("خطأ في جلب البيانات:", error));
  }, []);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(articles.length / articlesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container my-5" style={{ direction: "rtl" }}>
      {/* Hero Section */}
      <div
        className="relative h-[400px] flex items-center justify-center bg-cover bg-center rounded-lg shadow-lg"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/736x/7a/39/c9/7a39c98897363a0625c40c57d8522bc7.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg"></div>
        <div className="relative z-10 text-center text-white px-6 max-w-2xl">
          <h3 className="text-4xl font-extrabold mb-4 drop-shadow-lg">مدونتنا</h3>
          <p className="text-lg text-gray-200 leading-relaxed">
            اكتشف مقالات شيقة وملهمة حول أفضل الوجهات، التجارب الفريدة،
            والنصائح المفيدة لكل محب للسفر والاستكشاف. نقدم لكم محتوى ثري
            يجمع بين المعرفة والتجربة، لتكونوا على اطلاع دائم بأجمل الأماكن
            وأحدث الاتجاهات.
          </p>
        </div>
      </div>

      <div className="row">
        {/* الشريط الجانبي (Sidebar) */}
        <div className="col-lg-4">
          <div className="bg-white shadow-sm rounded p-4 mb-4">
            <h5 className="font-bold mb-3" style={{ color: "#000", textAlign: "right" }}>
              المقالات الأخيرة
            </h5>
            <ul>
              {currentArticles.map((article, index) => (
                <li className="d-flex align-items-center mb-3" key={index}>
                  <img
                    className="img-fluid"
                    src={article.imageSrc}
                    alt="مقال حديث"
                    style={{ width: "30%" }}
                  />
                  <div className="ms-3">
                    <Link to={`/articles/${article.id}`} style={{ color: "#000", textDecoration: "none" }}>
                      <h6>{article.title}</h6>
                    </Link>
                    <small className="d-block text-muted">{article.date}</small>
                    <p>{article.description}</p> {/* وصف المقال */}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* قسم الكلمات الدلالية */}
          <div className="bg-white shadow-sm rounded p-4 mb-4">
            <h5 className="font-bold mb-4" style={{ color: "#000", textAlign: "right" }}>
              سحابة الكلمات الدلالية
            </h5>
            <div className="d-flex flex-wrap">
              {["#مشاريع", "#تكنولوجيا", "#سفر", "#مطاعم", "#أسلوب الحياة", "#تصميم", "#رسم"].map(
                (tag, index) => (
                  <span key={index} className="badge m-2" style={{ backgroundColor: "#115173", color: "#fff" }}>
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>

          {/* قسم الصور من إنستغرام */}
          <div className="bg-white shadow-sm rounded p-4 mb-4">
            <h5 className="font-bold mb-3" style={{ color: "#000", textAlign: "right" }}>
              صور من إنستغرام
            </h5>
            <div className="d-flex flex-wrap">
              {[
                "https://i.pinimg.com/736x/13/0e/ce/130eceb043f953af63f10c266ea64f95.jpg",
                "https://i.pinimg.com/736x/09/6f/8b/096f8b050095e82cc66af6fd813b5795.jpg",
                "https://i.pinimg.com/736x/d8/b9/79/d8b9792a40fab3340f3fc3a911330f4b.jpg",
                "https://i.pinimg.com/736x/79/ce/63/79ce6389032fd3971e3b7c852e6b3884.jpg",
                "https://i.pinimg.com/736x/f9/01/a0/f901a043b3799805e978d6da9f63d9b4.jpg",
                "https://i.pinimg.com/736x/1d/f8/16/1df8161901846a6e8674ad70c56324f6.jpg",
              ].map((src, index) => (
                <img key={index} className="img-fluid m-1" src={src} alt="صورة من إنستغرام" style={{ width: "30%" }} />
              ))}
            </div>
          </div>

          {/* قسم الاشتراك في النشرة الإخبارية */}
          <div className="bg-white shadow-sm rounded p-4 mb-4">
            <h5 className="font-bold" style={{ textAlign: "right", color: "#000" }}>
              اشترك في نشرتنا الإخبارية
            </h5>
            <form>
              <div className="mb-3">
                <input type="email" className="form-control" placeholder="أدخل بريدك الإلكتروني" required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ backgroundColor: "#FFD700" }}>
                اشترك
              </button>
            </form>
          </div>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="col-lg-8">
          <div className="bg-gray-100 no-underline">
            <h2 className="text-2xl font-bold" style={{ color: "#000", textAlign: "right" }}>
              المقالات
            </h2>

            <div>
              <div className="mt-6 space-y-12">
                {currentArticles.map((article) => {
                  return (
                    <div key={article._id} className="bg-white rounded-lg shadow-md overflow-hidden group relative">
                      <Link to={`/article/${article._id}`}>
                        <div
                          className="absolute top-4 left-4"
                          style={{
                            backgroundColor: "#FFD700",
                            color: "#fff",
                            fontSize: "12px",
                            fontWeight: "bold",
                            padding: "4px 8px",
                            borderRadius: "4px",
                          }}
                        >
                          {article.date ? new Date(article.date).toLocaleDateString("ar-EG", { month: "long", year: "numeric" }) : "تاريخ غير متاح"}
                        </div>
                        <img
                          alt={article.imageAlt}
                          src={article.imageSrc}
                          className="w-full h-64 object-cover group-hover:opacity-75"
                        />
                        <div className="p-6">
                          <h3 className="text-lg font-semibold" style={{ color: "#000" }}>
                            {article.title || "عنوان غير متاح"}
                          </h3>
                          <p className="mt-2" style={{ color: "#666" }}>
                            {article.content_1 || "محتوى غير متاح"}
                          </p>
                        </div>
                        <div className="p-6 pt-0 flex justify-between items-center text-sm text-gray-600 flex-wrap gap-4">
  <div className="flex flex-wrap gap-2">
    {Array.isArray(article.tags) ? (
      article.tags.map((tag, i) => (
        <span
          key={`${article.id}-${tag}-${i}`}
          className="px-2 py-0.5 border border-gray-300 rounded text-gray-700 text-xs"
          style={{
            backgroundColor: "#f9f9f9", // خلفية ناعمة
            fontWeight: "500",
          }}
        >
          #{tag}
        </span>
      ))
    ) : (
      <span>تصنيفات غير متاحة</span>
    )}
  </div>

  <div className="flex items-center text-sm text-gray-500">
    <i className="fas fa-comments mr-1 text-[#0E7490]"></i> 01 تعليقات
  </div>
</div>

                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <nav className="mt-10">
                <ul className="pagination justify-center space-x-2">
                  <li className={`page-item ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      style={{ color: "#000" }}
                    >
                      &laquo;
                    </button>
                  </li>

                  {Array.from({ length: totalPages }, (_, index) => (
                    <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(index + 1)}
                        style={{
                          backgroundColor: currentPage === index + 1 ? "#115173" : "transparent",
                          borderColor: currentPage === index + 1 ? "#115173" : "#ccc",
                          color: currentPage === index + 1 ? "#fff" : "#000",
                          padding: "8px 12px",
                          borderRadius: "4px",
                        }}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}

                  <li className={`page-item ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      style={{ color: "#000" }}
                    >
                      &raquo;
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
