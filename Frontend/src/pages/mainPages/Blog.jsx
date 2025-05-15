// 





import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaComments, FaHeart, FaShareAlt } from "react-icons/fa";

const Blog = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 4;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:9527/articles/");
        if (!response.ok) {
          throw new Error("فشل في جلب البيانات");
        }
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setArticles(data);
        } else {
          throw new Error("تنسيق البيانات غير صحيح");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Pagination logic
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(articles.length / articlesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl text-red-600">حدث خطأ: {error}</h3>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[400px] flex items-center justify-center bg-cover bg-center rounded-lg "
        style={{
          backgroundImage: "url('https://i.pinimg.com/736x/4b/90/1d/4b901dac104e0545c54504f98c7c3f57.jpg')",
          // backgroundImage: "url('https://i.pinimg.com/736x/91/46/f5/9146f53b7a5bd095a1530dd3ff3670ac.jpg')",

        }}
      >
        <div className="absolute inset-0   rounded-lg"></div>
        <div className="relative z-10 text-center text-white px-6 max-w-2xl">
          <motion.h3 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-extrabold mb-4 drop-shadow-lg"
          >
            مدونتنا
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-200 leading-relaxed"
          >
            اكتشف مقالات شيقة وملهمة حول أفضل الوجهات، التجارب الفريدة،
            والنصائح المفيدة لكل محب للسفر والاستكشاف.
          </motion.p>
        </div>
      </motion.div>
    
      <div className="container my-20" style={{ direction: "rtl" }}>
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Recent Articles Widget */}
            <motion.div 
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="bg-white shadow-sm rounded-lg p-6 mb-6"
            >
              <h5 className="font-bold text-xl mb-4 text-right text-dark-blue border-b pb-2">
                المقالات الأخيرة
              </h5>
              <ul className="space-y-4">
                {currentArticles.slice(0, 3).map((article) => (
                  <li className="flex items-start gap-3" key={article.id}>
                    <div className="flex-shrink-0">
                      <img
                        className="rounded-lg object-cover w-20 h-20 text"
                        src={article.imageSrc}
                        alt={article.title}
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1">
                    <Link to={`/articles/${article.id}`} className="no-underline">
  <h6 className="text-sm line-clamp-2 text-black hover:text-[#FFD700] transition duration-300 font-medium">
    {article.title}
  </h6>
</Link>




                      <small className="text-gray-500 text-xs">
                        {new Date(article.date).toLocaleDateString('ar-JO', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </small>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Tags Cloud
            <motion.div 
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="bg-white shadow-sm rounded-lg p-6 mb-6"
            >
              <h5 className="font-bold text-xl mb-4 text-right text-dark-blue border-b pb-2">
                سحابة الكلمات الدلالية
              </h5>
              <div className="flex flex-wrap gap-2">
                {["مشاريع", "تكنولوجيا", "سفر", "مطاعم", "أسلوب الحياة", "تصميم", "رسم"].map(
                  (tag, index) => (
                    <motion.span 
                      whileHover={{ scale: 1.05 }}
                      key={index} 
                      className="px-3 py-1 text-sm rounded-full"
                      style={{ 
                        backgroundColor: `hsl(${index * 50}, 70%, 90%)`,
                        color: `hsl(${index * 50}, 70%, 30%)`
                      }}
                    >
                      #{tag}
                    </motion.span>
                  )
                )}
              </div>
            </motion.div> */}

            {/* Instagram Gallery */}
            <motion.div 
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
              className="bg-white shadow-sm rounded-lg p-6 mb-6"
            >
              <h5 className="font-bold text-xl mb-4 text-right text-dark-blue border-b pb-2">
                صور من إنستغرام
              </h5>
              <div className="grid grid-cols-3 gap-2">
                {[
                  "https://i.pinimg.com/736x/13/0e/ce/130eceb043f953af63f10c266ea64f95.jpg",
                  "https://i.pinimg.com/736x/09/6f/8b/096f8b050095e82cc66af6fd813b5795.jpg",
                  "https://i.pinimg.com/736x/d8/b9/79/d8b9792a40fab3340f3fc3a911330f4b.jpg",
                  "https://i.pinimg.com/736x/79/ce/63/79ce6389032fd3971e3b7c852e6b3884.jpg",
                  "https://i.pinimg.com/736x/f9/01/a0/f901a043b3799805e978d6da9f63d9b4.jpg",
                  "https://i.pinimg.com/736x/1d/f8/16/1df8161901846a6e8674ad70c56324f6.jpg",
                ].map((src, index) => (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    key={index}
                    className="aspect-square overflow-hidden rounded-lg"
                  >
                    <img 
                      src={src} 
                      alt="صورة من إنستغرام" 
                      className="w-full h-full object-cover hover:opacity-90 transition duration-300"
                      loading="lazy"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Newsletter */}
            <motion.div 
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
              className="bg-white shadow-sm rounded-lg p-6"
            >
              <h5 className="font-bold text-xl mb-3 text-right text-dark-blue">
                اشترك في نشرتنا الإخبارية
              </h5>
              <p className="text-gray-600 text-sm mb-4 text-right">
                احصل على أحدث المقالات والعروض مباشرة إلى بريدك الإلكتروني
              </p>
              <form action="https://formspree.io" method="POST" className="space-y-3">
  <div>
    <input 
      type="email" 
      name="email"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
      placeholder="أدخل بريدك الإلكتروني" 
      required 
    />
  </div>
  <button 
    type="submit" 
    className="w-full py-2 px-4 bg-gradient-to-r from-[#022C43] to-[#115173] text-[#FFD700] rounded-lg hover:opacity-90 transition duration-300 font-medium"
  >
    اشترك الآن
  </button>
</form>

            </motion.div>
          </div>

          {/* Main Content */}
          <div className="col-lg-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-50 rounded-lg p-6"
            >
              <h2 className="text-3xl font-bold mb-6 text-right text-dark-blue border-b pb-3">
                أحدث المقالات
              </h2>

              {currentArticles.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-600">لا توجد مقالات متاحة حالياً</p>
                </div>
              ) : (
                <>
                  <div className="space-y-8">
                    {currentArticles.map((article) => (
                      <motion.div
                        key={article._id}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl shadow-md overflow-hidden group relative transition duration-300 hover:shadow-lg"
                      >
                        <Link to={`/article/${article._id}`} className="block">
                          {/* Article Badge */}
                          <div className="absolute top-4 left-4 z-10 bg-gold text-white text-xs font-bold px-3 py-1 rounded border">
                            {/* {article.category || "سفر"} */}
                            {new Date(article.date).toLocaleDateString('ar-JO', { 
                          month: 'long', 
                        })}
                          </div>
                          
                          {/* Article Image */}
                          <div className="relative h-64 overflow-hidden">
                            <img
                              alt={article.imageAlt || article.title}
                              src={article.imageSrc}
                              className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          </div>
                          
                          {/* Article Content */}
                          <div className="p-6">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-500">
                                {new Date(article.date).toLocaleDateString("ar-EG", { 
                                  day: "numeric", 
                                  month: "long", 
                                  year: "numeric" 
                                })}
                              </span>
                              {/* <div className="flex items-center space-x-2 space-x-reverse">
                                <span className="flex items-center text-sm text-gray-500">
                                  <FaHeart className="ml-1 text-red-400" />
                                  {article.likes || 0}
                                </span>
                                <span className="flex items-center text-sm text-gray-500">
                                  <FaComments className="ml-1 text-blue-400" />
                                  {article.comments || 0}
                                </span>
                              </div> */}
                            </div>
                         <h3 className="text-xl font-bold mb-3 text-black transition duration-300">
  {article.title || "عنوان غير متاح"}
</h3>

                            
                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {article.content_1 || "محتوى غير متاح"}
                            </p>
                            
                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {Array.isArray(article.tags) ? (
                                article.tags.slice(0, 3).map((tag, i) => (
                                  <span
                                    key={`${article.id}-${tag}-${i}`}
                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                  >
                                    #{tag}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-gray-500">تصنيفات غير متاحة</span>
                              )}
                            </div>
                            
                            {/* Read More & Share */}
                            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                              <button className="text-gold font-medium hover:underline">
                                اقرأ المزيد
                              </button>
                              <div className="flex space-x-2 space-x-reverse">
                                <button className="p-2 text-gray-500 hover:text-blue-500 transition">
                                  <FaShareAlt />
                                </button>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <motion.nav 
                    className="mt-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <ul className="flex justify-center items-center space-x-2 space-x-reverse">
                      <li>
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-3 py-1 rounded-lg ${currentPage === 1 ? 
                            "text-gray-400 cursor-not-allowed" : 
                            "text-dark-blue hover:bg-gray-100"}`}
                        >
                          &laquo; السابق
                        </button>
                      </li>

                      {Array.from({ length: totalPages }, (_, index) => (
                        <li key={index}>
                          <button
                            onClick={() => handlePageChange(index + 1)}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg ${currentPage === index + 1 ? 
                              "bg-dark-blue text-white" : 
                              "text-dark-blue hover:bg-gray-100"}`}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}

                      <li>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-1 rounded-lg ${currentPage === totalPages ? 
                            "text-gray-400 cursor-not-allowed" : 
                            "text-dark-blue hover:bg-gray-100"}`}
                        >
                          التالي &raquo;
                        </button>
                      </li>
                    </ul>
                  </motion.nav>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;