import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';



const callouts = [
  {
    name: "مقال 1",
    date: "1 يناير 2023",
    imageSrc: "https://i.pinimg.com/736x/4b/a8/61/4ba861312c84b4087009e5aae8b6ceed.jpg",
    discription:"اكتشاف وجهة جديدة: الحديقة اليابانية في عمّان",
  },
  {
    name: "مقال 2",
    date: "2 يناير 2023",
    imageSrc: "https://www.family.abbott/content/dam/an/familyabbott/jo-ar/abbott-family/FAM_Jordan%20homepage%20banner.jpg",
    discription:"استكشاف قلعة عجلون: تاريخ وحكايات من العصور الوسطى",
  },
  {
    name: "مقال 3",
    date: "4 يناير 2023",
    imageSrc: "https://assets.nn.najah.edu/CACHE/images/uploads/weblog/2017/03/31/faae1cb1ec/0331491da6b91d195b61fb927589d05c.jpg",
    discription:"أهمية الترويح عن النفس: قضاء وقت ممتع مع أطفالك",
  },
  {
    name: "مقال 4",
    date: "5 يناير 2023",
    imageSrc: "https://assets.nn.najah.edu/CACHE/images/uploads/weblog/2017/03/31/faae1cb1ec/0331491da6b91d195b61fb927589d05c.jpg",
    discription:"متحف ألف مخترع ومخترع: أفضل وجهة تعليمية للأطفال في الأردن",
  },
  
]; 
const PlogDetails = () => {
  const { id } = useParams(); // جلب معرف المقال من الرابط
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:9527/articles/${id}`)
      .then((response) => {
        setArticle(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching article:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>جاري تحميل المقال...</p>;
  if (!article) return <p>تعذر تحميل المقال.</p>;


//commit
const handleSubmit = async (e) => {
  e.preventDefault();

  // تحقق من تسجيل الدخول
  if (!user) {
    alert("يجب عليك تسجيل الدخول لتتمكن من إضافة تعليق");
    return;
  }

  const comment = {
    articleId: articleId, // معرف المقال
    username: user.username, // اسم المستخدم المسجل
    content: content, // محتوى التعليق
    email: user.email, // بريد المستخدم
  };

  try {
    await axios.post('/api/comments', comment); // مسار API لإضافة تعليق
    setContent(''); // إعادة تعيين حقل التعليق بعد الإرسال
  } catch (error) {
    console.error("خطأ في إرسال التعليق", error);
  }
};





  return (
    <div className="container mx-auto p-5" style={{ direction: 'rtl' }}>
      {/* Bradcam Area */}
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
      {/* Blog Area */}
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
         {/* الشريط الجانبي (Sidebar) */}
                <div className="col-lg-4">
                  <div className="bg-white shadow-sm rounded p-4 mb-4">
                    <h5 className="font-bold mb-3" style={{ color: '#000', textAlign: 'right' }}>المقالات الأخيرة</h5>
                    <ul className="list-unstyled">
                      {callouts.map((post, index) => (
                        <li className="d-flex align-items-center mb-3" key={index}>
                          <img
                            className="img-fluid"
                            src={post.imageSrc}
                            alt="مقال حديث"
                            style={{ width: "30%" }}
                          />
                          <div className="ms-3">
                            <Link to={post.href} style={{ color: '#000', textDecoration: 'none' }}>
                              {post.discription}
                            </Link>
                            <small className="d-block text-muted">{post.date}</small>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
        
                  <div className="bg-white shadow-sm rounded p-4 mb-4">
            <h5 className="font-bold mb-4" style={{ color: '#000', textAlign: 'right' }}>سحابة الكلمات الدلالية</h5>
            <div className="d-flex flex-wrap">
              <span className="badge m-2" style={{ backgroundColor: '#115173', color: '#fff' }}>#مشاريع</span>
              <span className="badge m-2" style={{ backgroundColor: '#115173', color: '#fff' }}>#تكنولوجيا</span>
              <span className="badge m-2" style={{ backgroundColor: '#115173', color: '#fff' }}>#سفر</span>
              <span className="badge m-2" style={{ backgroundColor: '#115173', color: '#fff' }}>#مطاعم</span>
              <span className="badge m-2" style={{ backgroundColor: '#115173', color: '#fff' }}>#أسلوب الحياة</span>
              <span className="badge m-2" style={{ backgroundColor: '#115173', color: '#fff' }}>#تصميم</span>
              <span className="badge m-2" style={{ backgroundColor: '#115173', color: '#fff' }}>#رسم</span>
            </div>
          </div>
        
          <div className="bg-white shadow-sm rounded p-4 mb-4">
            <h5 className="font-bold mb-3" style={{ color: '#000', textAlign: 'right' }}>صور من إنستغرام</h5>
            <div className="d-flex flex-wrap">
              <img className="img-fluid m-1" src="https://i.pinimg.com/736x/25/81/2b/25812ba4f53180e9443e76361c9bbef9.jpg" alt="صورة من إنستغرام" style={{ width: "30%" }} />
              <img className="img-fluid m-1" src="https://i.pinimg.com/736x/ab/ac/78/abac785eebadf5e4cd7f07c86907d97c.jpg" alt="صورة من إنستغرام" style={{ width: "30%" }} />
              <img className="img-fluid m-1" src="https://i.pinimg.com/736x/c6/7a/44/c67a44f9c5cd7f070cfab43648215d49.jpg" alt="صورة من إنستغرام" style={{ width: "30%" }} />
              <img className="img-fluid m-1" src="https://i.pinimg.com/736x/1e/77/7d/1e777d63c1a5a2d9c5f943ddb07aef92.jpg" alt="صورة من إنستغرام" style={{ width: "30%" }} />
              <img className="img-fluid m-1" src="https://i.pinimg.com/736x/5f/16/82/5f1682acb6c4d19dcaa142e61e49ca54.jpg" alt="صورة من إنستغرام" style={{ width: "30%" }} />
              <img className="img-fluid m-1" src="https://i.pinimg.com/736x/c4/7e/18/c47e18518150b4cd1b9401bf11d6ab65.jpg" alt="صورة من إنستغرام" style={{ width: "30%" }} />
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

        {/* Main Content */}
        <div className="lg:w-3/4 p-4">
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
      {/* صورة المقال */}
      {article.imageSrc && (
        <img className="w-full rounded-lg mb-4" src={article.imageSrc} alt={article.title} />
      )}

      {/* عنوان المقال */}
      <h2 className="text-3xl font-bold text-blue-900">{article.title}</h2>

      {/* بيانات المقال */}
      <ul className="flex space-x-4 text-gray-600 mt-2">
        {article.tags && article.tags.length > 0 && (
          <li>
            <i className="fa fa-tags"></i> {article.tags.join("، ")}
          </li>
        )}
        <li><i className="fa fa-eye"></i> {article.views} مشاهدة</li>
        <li><i className="fa fa-thumbs-up"></i> {article.likeCount} إعجاب</li>
        <li><i className="fa fa-comments"></i> 03 تعليقات</li>
      </ul>

      {/* تاريخ المقال */}
      <small className="text-gray-500 block my-2">
        {new Date(article.date).toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })}
      </small>

      {/* المحتوى الرئيسي */}
      <p className="text-lg text-gray-700 mb-4">{article.content}</p>

      {/* اقتباس داخل صندوق مميز */}
      {article.content_1 && (
        <div className="bg-gray-100 border-l-4 border-blue-900 p-4 my-6">
          <blockquote className="text-gray-700 italic">
            "{article.content_1}"
          </blockquote>
        </div>
      )}

      {/* فقرة إضافية */}
      {article.content_1 && <p className="text-gray-700 leading-relaxed">{article.content_1}</p>}
    </div>
          {/* Comments Section */}
          <div className="mt-8">
            <h4 className="text-xl font-semibold">05 تعليقات</h4>
            <div className="flex items-start mt-4">
              <img className="w-12 h-12 rounded-full" src="https://i.pinimg.com/736x/f6/ee/13/f6ee1311d121ea0cef159ff502d21720.jpg" alt="صورة المعلق" />
              <div className="ml-4">
                <h5 className="font-bold">إيميلي بلانت</h5>
                <p className="text-sm text-gray-500">4 ديسمبر 2017</p>
                <p className="text-gray-700">مقال رائع!</p>
                <a href="#" className="text-blue-600 hover:underline text-sm">رد</a>
              </div>
            </div>
          </div>

          {/* Comment Form */}
          <div className="mt-8">
            <h4 className="text-xl font-semibold">اترك تعليقًا</h4>
            <form className="mt-4">
              <textarea className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900" placeholder="اكتب تعليقك"></textarea>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <input className="p-3 border rounded-md" type="text" placeholder="الاسم" />
                <input className="p-3 border rounded-md" type="email" placeholder="البريد الإلكتروني" />
              </div>
              <button className="mt-4 bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-700">إرسال</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlogDetails;