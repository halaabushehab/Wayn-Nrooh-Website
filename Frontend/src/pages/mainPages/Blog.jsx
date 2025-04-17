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
<div className="container my-5" style={{ direction: 'rtl' }}>
  {/* Hero Section */}
  <div
  className="relative h-[400px] flex items-center justify-center bg-cover bg-center rounded-lg shadow-lg"
  style={{ backgroundImage: "url('https://i.pinimg.com/736x/7a/39/c9/7a39c98897363a0625c40c57d8522bc7.jpg')" }}
>
  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg"></div>
  <div className="relative z-10 text-center text-white px-6 max-w-2xl">
  <h3 className="text-4xl font-extrabold mb-4 drop-shadow-lg">مدونتنا</h3>
  <p className="text-lg text-gray-200 leading-relaxed">
    اكتشف مقالات شيقة وملهمة حول أفضل الوجهات، التجارب الفريدة، والنصائح المفيدة لكل محب للسفر والاستكشاف.
    نقدم لكم محتوى ثري يجمع بين المعرفة والتجربة، لتكونوا على اطلاع دائم بأجمل الأماكن وأحدث الاتجاهات.
  </p>
</div>

</div>

  <div className="row">
    {/* الشريط الجانبي (Sidebar) */}
    <div className="col-lg-4">
      <div className="bg-white shadow-sm rounded p-4 mb-4">
        <h5 className="font-bold mb-3" style={{ color: '#000', textAlign: 'right' }}>المقالات الأخيرة</h5>
        <ul>
  {articles.map((article, index) => (
    <li className="d-flex align-items-center mb-3" key={index}>
      <img
        className="img-fluid"
        src={article.imageSrc}
        alt="مقال حديث"
        style={{ width: "30%" }}
      />
      <div className="ms-3">
      <Link to={`/articles/${article.id}`} style={{ color: '#000', textDecoration: 'none' }}>
      {article.name}
        </Link>
        <small className="d-block text-muted">{article.date}</small>
      </div>
    </li>
  ))}
</ul>

      </div>

      <div className="bg-white shadow-sm rounded p-4 mb-4">
        <h5 className="font-bold mb-4" style={{ color: '#000', textAlign: 'right' }}>سحابة الكلمات الدلالية</h5>
        <div className="d-flex flex-wrap">
          {["#مشاريع", "#تكنولوجيا", "#سفر", "#مطاعم", "#أسلوب الحياة", "#تصميم", "#رسم"].map((tag, index) => (
            <span key={index} className="badge m-2" style={{ backgroundColor: '#115173', color: '#fff' }}>{tag}</span>
          ))}
        </div>
      </div>

      <div className="bg-white shadow-sm rounded p-4 mb-4">
        <h5 className="font-bold mb-3" style={{ color: '#000', textAlign: 'right' }}>صور من إنستغرام</h5>
        <div className="d-flex flex-wrap">
          {[
            "https://i.pinimg.com/736x/25/81/2b/25812ba4f53180e9443e76361c9bbef9.jpg",
            "https://i.pinimg.com/736x/ab/ac/78/abac785eebadf5e4cd7f07c86907d97c.jpg",
            "https://i.pinimg.com/736x/c6/7a/44/c67a44f9c5cd7f070cfab43648215d49.jpg",
            "https://i.pinimg.com/736x/1e/77/7d/1e777d63c1a5a2d9c5f943ddb07aef92.jpg",
            "https://i.pinimg.com/736x/5f/16/82/5f1682acb6c4d19dcaa142e61e49ca54.jpg",
            "https://i.pinimg.com/736x/c4/7e/18/c47e18518150b4cd1b9401bf11d6ab65.jpg"
          ].map((src, index) => (
            <img key={index} className="img-fluid m-1" src={src} alt="صورة من إنستغرام" style={{ width: "30%" }} />
          ))}
        </div>
      </div>

      <div className="bg-white shadow-sm rounded p-4 mb-4">
        <h5 className="font-bold" style={{ textAlign: 'right', color: '#000' }}>اشترك في نشرتنا الإخبارية</h5>
        <form>
          <div className="mb-3">
            <input type="email" className="form-control" placeholder="أدخل بريدك الإلكتروني" required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#FFD700' }}>
            اشترك
          </button>
        </form>
      </div>
    </div>

    {/* المحتوى الرئيسي */}
    <div className="col-lg-8">
      <div className="bg-gray-100 no-underline">
        <h2 className="text-2xl font-bold" style={{ color: '#000', textAlign: 'right' }}>المجموعات</h2>

        <div>
          <div className="mt-6 space-y-12">
          {currentArticles.map((article, index) => {
  console.log(`🔎 المقالة رقم ${index + 1}:`, article);

  return (
    <div key={article._id} className="bg-white rounded-lg shadow-md overflow-hidden group relative">
      <Link to={`/article/${article._id}`}>
        <div className="absolute top-4 left-4" style={{
          backgroundColor: '#FFD700',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 'bold',
          padding: '4px 8px',
          borderRadius: '4px',
        }}>
          {article.date ? new Date(article.date).toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' }) : 'تاريخ غير متاح'}
        </div>
        <img alt={article.imageAlt} src={article.imageSrc} className="w-full h-64 object-cover group-hover:opacity-75" />
        <div className="p-6">
          <h3 className="text-lg font-semibold" style={{ color: '#000' }}>
            {article.title || "عنوان غير متاح"}
          </h3>
          <p className="mt-2" style={{ color: '#666' }}>
            {article.content_1 || "محتوى غير متاح"}
          </p>
        </div>
        <div className="p-6 pt-0 flex justify-between text-sm" style={{ color: '#666' }}>
          {Array.isArray(article.tags) ? (
            article.tags.map((tag, i) => (
              <span key={`${article.id}-${tag}-${i}`} className="rounded-full px-2 py-1" style={{ backgroundColor: '#115173', color: '#fff' }}>
                {tag}
              </span>
            ))
          ) : (
            <span>تصنيفات غير متاحة</span>
          )}
          <span className="flex items-center">
            <i className="fas fa-comments mr-1"></i> 01 تعليقات
          </span>
        </div>
      </Link>
    </div>
  );
})}
          </div>

          {/* Pagination */}
          <nav className="mt-10">
            <ul className="pagination justify-center space-x-2">
              <li className={`page-item ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} style={{ color: '#000' }}>
                  &laquo;
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(index + 1)} style={{
                    backgroundColor: currentPage === index + 1 ? '#115173' : 'transparent',
                    borderColor: currentPage === index + 1 ? '#115173' : '#ccc',
                    color: currentPage === index + 1 ? '#fff' : '#000',
                    padding: '8px 12px',
                    borderRadius: '4px',
                  }}>
                    {index + 1}
                  </button>
                </li>
              ))}

              <li className={`page-item ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} style={{ color: '#000' }}>
                  &raquo;
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>

  {/* CSS for responsiveness */}
  <style jsx>{`
    @media (max-width: 768px) {
      .bg-white h5, .bg-white p, .bg-gray-100 h2 {
        font-size: 1rem; /* Smaller font size for headings and paragraphs */
      }

      .bg-gray-100 {
        padding: 1rem; /* Adjust padding */
      }

      .bg-white {
        padding: 1rem; /* Adjust padding */
      }
    }

    @media (max-width: 576px) {
      .bg-white h5, .bg-white p, .bg-gray-100 h2 {
        font-size: 0.9rem; /* Further reduce font size */
      }

      .bg-gray-100 {
        padding: 0.5rem; /* Further adjust padding */
      }

      .bg-white {
        padding: 0.5rem; /* Further adjust padding */
      }
    }
  `}</style>
</div>
  );
};

export default Blog;