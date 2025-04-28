import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
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
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState(""); // To store the new comment text
  const [user, setUser] = useState(null);  // Initialize user state
  const [content, setContent] = useState('');


  useEffect(() => {
    const loadUserFromCookies = () => {
      const userCookie = Cookies.get("user");
      if (userCookie) {
        try {
          const parsedUser = JSON.parse(userCookie);
          console.log("🧖 Loading user from cookies:", parsedUser);
  
          if (parsedUser.token) {
            setUser({
              username: parsedUser.username,
              userId: parsedUser.userId,
              isAdmin: parsedUser.isAdmin || false,
              email: parsedUser.email, // Ensure the email is also saved in the user state
              photo: parsedUser.photo || 'http://localhost:9527/uploads/placeholder.jpg', // تأكد من أن الـ photo موجودة
            });
  
            axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
          }
        } catch (error) {
          console.error("Error parsing user cookie:", error);
          Cookies.remove("user");
        }
      }
    };
  
    loadUserFromCookies();
  }, []);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articleRes, commentsRes] = await Promise.all([
          axios.get(`http://localhost:9527/articles/${id}`),
        ]);
        setArticle(articleRes.data);
           fetchComments();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);
  
 // في ملف PlogDetails.jsx
 const fetchComments = async () => {
  try {
    const response = await axios.get(`http://localhost:9527/api/comments/${id}`);
    console.log("التعليقات:", response.data.comments);

    // تعديل البيانات بإضافة الصورة للمستخدم
    const updatedComments = response.data.comments.map(comment => {
      // التحقق من وجود userId و username
      const user = comment.userId ? {
        username: comment.userId.username || 'مجهول',
        photo: comment.userId.profilePicture || 'http://localhost:9527/uploads/placeholder.jpg',
      } : { username: 'مجهول', photo: 'http://localhost:9527/uploads/placeholder.jpg' };

      return {
        ...comment,
        user,
        createdAt: new Date(comment.createdAt),
      };
    });

    setComments(updatedComments);
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    alert("حدث خطأ أثناء جلب التعليقات");
  }
};

//comment
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!user || !user.userId) {
    alert("يجب عليك تسجيل الدخول لتتمكن من إضافة تعليق");
    return;
  }

  try {
    const response = await axios.post('http://localhost:9527/api/comments', {
      userId: user.userId,
      articleId: id,
      content
    });

    console.log("التعليق المضاف:", response.data);  // عرض بيانات التعليق المضاف
    const newComment = {
      _id: response.data._id, // أو id حسب شو بيرجع السيرفر
      content: response.data.content,
      user: {
        username: user.username,
        photo: user.photo || 'http://localhost:9527/uploads/placeholder.jpg',
      },
      createdAt: new Date(response.data.createdAt),
    };
    
    setComments(prev => [newComment, ...prev]);
    
    setContent("");
  } catch (error) {
    console.error("Error submitting comment:", error.response?.data || error.message);
    alert("حدث خطأ أثناء إرسال التعليق");
  }
};



if (loading) return <p>جاري تحميل المقال...</p>;
if (!article) return <p>تعذر تحميل المقال.</p>;

return (
  <div className="container mx-auto p-5 font-sans" dir="rtl">
    {/* Hero Section */}
    <div className="relative h-64 mb-8 flex items-center justify-center bg-cover bg-center rounded-lg shadow-lg">
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
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="w-full lg:w-2/3 order-2 lg:order-1">
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          {/* Article Image */}
          <img className="w-full rounded-lg mb-4 h-64 object-cover" src={article.imageSrc} alt={article.title} />

          {/* Article Title */}
          <h2 className="text-3xl font-bold text-blue-900 mb-3">{article.title}</h2>

          {/* Article Metadata */}
          <div className="flex flex-wrap gap-4 text-gray-600 mb-3">
            {article.tags && article.tags.length > 0 && (
              <span className="flex items-center">
                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                {article.tags.join("، ")}
              </span>
            )}
            <span className="flex items-center">
              <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              {article.views} مشاهدة
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              {article.likeCount} إعجاب
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
              </svg>
              3 تعليقات
            </span>
          </div>

          {/* Article Date */}
          <p className="text-gray-500 text-sm mb-4">
            {new Date(article.date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          {/* Main Content */}
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">{article.content}</p>

          {/* Quote Box */}
          <div className="bg-gray-100 border-r-4 border-blue-900 p-4 my-6">
            <blockquote className="text-gray-700 italic pr-4">
              "{article.content_1}"
            </blockquote>
          </div>

          {/* Additional Content */}
          <p className="text-gray-700 leading-relaxed">{article.content}</p>
        </div>

        {/* Comments Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
      <h4 className="text-xl font-bold mb-6">التعليقات ({comments.length})</h4>
      
      {comments.map((comment, index) => (
        <div key={index} className="flex mb-6 border-b pb-6">
          <img
            className="w-12 h-12 rounded-full"
            src={comment.profilePicture || 'http://localhost:9527/uploads/placeholder.jpg'}
            alt={comment.user?.username}
          />
          <div className="mr-4 flex-1">
            <div className="flex justify-between items-center mb-1">
              <h5 className="font-bold">{comment.user?.username}</h5>
              <p className="text-sm text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </p>
            </div>
            <p className="text-gray-700 mb-2">{comment.content}</p>
            <button className="text-blue-600 hover:text-blue-800 flex items-center text-sm">
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              رد
            </button>
          </div>
        </div>
      ))}

      <h4 className="text-xl font-bold mb-4">اترك تعليقاً</h4>
      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 mb-4"
          placeholder="اكتب تعليقك هنا..."
          rows="4"
          required
        ></textarea>
        <button 
          type="submit" 
          className="bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition-colors"
          disabled={!user}
        >
          {user ? 'إرسال التعليق' : 'يجب تسجيل الدخول'}
        </button>
      </form>
    </div>
      </div>

    {/* Sidebar */}
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

 
      
    </div>
  </div>
);
};

export default PlogDetails;
