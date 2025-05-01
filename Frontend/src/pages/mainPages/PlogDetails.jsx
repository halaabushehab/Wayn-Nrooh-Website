import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaEye, 
  FaHeart, 
  FaComment, 
  FaTags,
  FaShareAlt,
  FaPaperPlane,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaBookmark
} from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";

const PlogDetails = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('recent');
  const [sidebarArticles, setSidebarArticles] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // تحميل بيانات المستخدم من الكوكيز
  useEffect(() => {
    const loadUserFromCookies = () => {
      const userCookie = Cookies.get("user");
      if (userCookie) {
        try {
          const parsedUser = JSON.parse(userCookie);
          if (parsedUser.token) {
            setUser({
              username: parsedUser.username,
              userId: parsedUser.userId,
              isAdmin: parsedUser.isAdmin || false,
              email: parsedUser.email,
              photo: parsedUser.photo || 'http://localhost:9527/uploads/placeholder.jpg',
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

  // جلب بيانات المقال والتعليقات
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articleRes, sidebarRes] = await Promise.all([
          axios.get(`http://localhost:9527/articles/${id}`),
          axios.get('http://localhost:9527/articles?limit=4')
        ]);
        setArticle(articleRes.data);
        setSidebarArticles(sidebarRes.data);
        fetchComments();
        
        // التحقق من وضع المقال في المفضلة
        if (user?.userId) {
          const bookmarkRes = await axios.get(`http://localhost:9527/api/bookmarks/check?userId=${user.userId}&articleId=${id}`);
          setIsBookmarked(bookmarkRes.data.isBookmarked);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user?.userId]);

  // جلب التعليقات
  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:9527/api/comments/${id}`);
      const updatedComments = response.data.comments.map(comment => ({
        ...comment,
        user: {
          username: comment.userId?.username || 'مجهول',
          photo: comment.userId?.profilePicture || 'http://localhost:9527/uploads/placeholder.jpg',
        },
        createdAt: new Date(comment.createdAt),
      }));
      setComments(updatedComments);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  // إضافة تعليق جديد
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("يجب عليك تسجيل الدخول لتتمكن من إضافة تعليق");
      return;
    }

    try {
      const response = await axios.post('http://localhost:9527/api/comments', {
        userId: user.userId,
        articleId: id,
        content
      });
      
      const newComment = {
        ...response.data,
        user: {
          username: user.username,
          photo: user.photo,
        },
        createdAt: new Date(),
      };
      
      setComments(prev => [newComment, ...prev]);
      setContent("");
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("حدث خطأ أثناء إرسال التعليق");
    }
  };

  // إضافة/إزالة المقال من المفضلة
  const toggleBookmark = async () => {
    if (!user) {
      alert("يجب تسجيل الدخول لإضافة المقال إلى المفضلة");
      return;
    }

    try {
      if (isBookmarked) {
        await axios.delete(`http://localhost:9527/api/bookmarks?userId=${user.userId}&articleId=${id}`);
      } else {
        await axios.post('http://localhost:9527/api/bookmarks', {
          userId: user.userId,
          articleId: id
        });
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#115173]"></div>
    </div>
  );

  if (!article) return (
    <div className="text-center py-20">
      <h2 className="text-3xl font-bold text-[#022C43] mb-4">تعذر تحميل المقال</h2>
      <Link to="/blog" className="text-[#115173] hover:text-[#FFD700] flex items-center justify-center">
        <FiArrowLeft className="ml-2" /> العودة إلى المدونة
      </Link>
    </div>
  );

  return (

    <> 
     {/* Hero Section with Creative Design */}
    <div
     className="relative h-120  w-full flex items-center justify-center bg-cover bg-center  overflow-hidden  "
     style={{ backgroundImage: "url('https://i.pinimg.com/736x/1a/f0/88/1af08855656916032def657d64930760.jpg')" }}
   >
     <div className="absolute inset-0 bg-gradient-to-r "></div>
     <div className="relative z-10 text-center text-white p-5 max-w-5xl">
  <div className="mb-4 transform -rotate-2">
    {/* يمكنك إضافة عنوان هنا إذا لزم */}
  </div>
  
  {/* الخلفية السوداء الشفافة مع Blur وراء النص فقط */}
  <div className="relative inline-block px-4 py-5 rounded-lg bg-black/40 backdrop-blur-10">
    <p className="text-lg text-white leading-relaxed drop-shadow">
      اكتشف معنا تفاصيل المقال واستمتع بمحتوى غني بالمعلومات والتجارب المُلهمة.
      نأخذك في رحلة فريدة عبر الكلمات والصور لتعيش كل لحظة وكأنك فيها.
    </p>
  </div>
</div>

     
     <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/100 to-transparent"></div>
   </div>
   
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans" dir="rtl">
     
  
      {/* Breadcrumbs */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-[#FFD700]">
              الرئيسية
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <Link to="/article" className="mr-1 text-sm font-medium text-gray-700 hover:text-[#FFD700]">
                المدونة
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <span className="mr-1 text-sm font-medium text-gray-500">{article.title}</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Article Content */}
        <div className="w-full lg:w-2/3">
          {/* Article Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#022C43] mb-2">{article.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                  <span className="flex items-center">
                    <FaCalendarAlt className="ml-2 text-[#FFD700]" />
                    {new Date(article.date).toLocaleDateString('ar-EG', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                  <span className="flex items-center">
                    <FaEye className="ml-2 text-[#FFD700]" />
                    {article.views} مشاهدة
                  </span>
                  <span className="flex items-center">
                    <FaHeart className="ml-2 text-[#FFD700]" />
                    {article.likeCount} إعجاب
                  </span>
                </div>
              </div>
              <button 
                onClick={toggleBookmark}
                className={`p-2 rounded-full ${isBookmarked ? 'text-[#FFD700]' : 'text-gray-400 hover:text-[#115173]'}`}
                aria-label={isBookmarked ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
              >
                <FaBookmark className="text-xl" />
              </button>
            </div>

            {/* Article Categories */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {article.tags.map((tag, index) => (
                  <Link 
                    key={index} 
                    to={`/tag/${tag}`}
                    className="px-3 py-1 text-sm rounded-full bg-[#115173]/10 text-[#115173] hover:bg-[#115173] hover:text-white transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Featured Image */}
          <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
            <img 
              className="w-full h-auto max-h-[500px] object-cover" 
              src={article.imageSrc} 
              alt={article.title} 
              loading="lazy"
            />
          </div>

          {/* Article Body */}
          <article className="prose prose-lg max-w-none text-gray-700 mb-12">
            <p className="text-xl leading-relaxed mb-6">{article.content}</p>
            
            {/* Quote */}
            {article.content_1 && (
              <blockquote className="border-r-4 border-[#FFD700] bg-[#115173]/5 p-6 my-8 rounded-lg">
                <p className="text-2xl italic font-medium text-[#022C43]">"{article.content_1}"</p>
              </blockquote>
            )}

            <div className="space-y-6">
              <p className="text-xl leading-relaxed">{article.content}</p>
              
              {/* Additional content sections can be added here */}
              <div className="grid md:grid-cols-2 gap-6 my-8">
                <div className="bg-[#115173]/5 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-[#022C43] mb-3">نقاط رئيسية</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>اكتشف الأماكن المخفية في المدينة</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>تعرف على الثقافة المحلية</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <span>نصائح للسفر بميزانية محدودة</span>
                    </li>
                  </ul>
                </div>
             <div className="bg-[#FFD700]/10 p-6 rounded-xl">
  <h3 className="text-xl font-bold text-[#022C43] mb-3">هل تعلم؟</h3>
  <p>قراءة المقالات بشكل منتظم توسع مداركك وتمنحك منظورًا أعمق حول المواضيع التي تهمك.</p>
</div>

              </div>
            </div>
          </article>

          {/* Share Options */}
          <div className="bg-[#115173]/5 p-6 rounded-xl mb-12">
  <h3 className="text-xl font-bold text-[#022C43] mb-4">شارك المقال</h3>
  <div className="flex flex-wrap gap-4">
    <a
      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-4 py-2 bg-[#3b5998] text-white rounded-lg hover:opacity-90 transition-opacity"
    >
      <FaShareAlt /> فيسبوك
    </a>
    <a
      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-4 py-2 bg-[#1da1f2] text-white rounded-lg hover:opacity-90 transition-opacity"
    >
      <FaTwitter /> تويتر
    </a>
    <a
      href={`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(window.location.href)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-4 py-2 bg-[#0077b5] text-white rounded-lg hover:opacity-90 transition-opacity"
    >
      <FaLinkedin /> لينكدإن
    </a>
    <a
      href={`https://www.instagram.com/`} // إنستغرام ما بدعم مشاركة رابط مباشرة، ممكن توجه المستخدم لحسابك
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white rounded-lg hover:opacity-90 transition-opacity"
    >
      <FaInstagram /> إنستغرام
    </a>
  </div>
</div>


          {/* Comments Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-[#022C43] mb-6 pb-4 border-b border-gray-200">
              التعليقات ({comments.length})
            </h3>
            
            {comments.length > 0 ? (
              <div className="space-y-6">
                {comments.map((comment, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm">
                   <img
            className="w-12 h-12 rounded-full"
            src={comment.profilePicture || 'http://localhost:9527/uploads/placeholder.jpg'}
            alt={comment.user?.username}
          />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-[#022C43]">{comment.user.username}</h4>
                        <span className="text-sm text-gray-500">
                          {comment.createdAt.toLocaleDateString('ar-EG', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{comment.content}</p>
                      <button className="text-sm text-[#115173] hover:text-[#FFD700] transition-colors">
                        رد
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">لا توجد تعليقات بعد. كن أول من يعلق!</p>
            )}

            {/* Comment Form */}
            <div className="mt-10">
              <h4 className="text-xl font-bold text-[#022C43] mb-4">أضف تعليقاً</h4>
              <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent text-gray-700"
                  placeholder="شاركنا رأيك..."
                  rows="5"
                  required
                ></textarea>
                <button 
                  type="submit" 
                  className="bg-gradient-to-r from-[#115173] to-[#022C43] text-white px-6 py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
                  disabled={!user}
                >
                  <FaPaperPlane />
                  {user ? 'إرسال التعليق' : 'يجب تسجيل الدخول للتعليق'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/3 space-y-8">
          {/* About Author */}
          {article.author && (
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="text-xl font-bold text-[#022C43] mb-4">عن الكاتب</h4>
              <div className="flex items-center gap-4">
                <img
                  className="w-16 h-16 rounded-full object-cover"
                  src={article.author.photo || 'http://localhost:9527/uploads/placeholder.jpg'}
                  alt={article.author.name}
                />
                <div>
                  <h5 className="font-bold text-[#022C43]">{article.author.name}</h5>
                  <p className="text-gray-600 text-sm">{article.author.bio || 'كاتب ومدون متخصص في السفر والثقافة'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Recent Articles */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-bold text-[#022C43]">مقالات قد تعجبك</h4>
              <div className="flex gap-2">
              </div>
            </div>
            <div className="space-y-4">
            {sidebarArticles.slice(0, 4).map((post) => (
    <Link 
      key={post._id} 
      to={`/article/${post._id}`}
      className="flex gap-4 group"
    >
      <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden">
        <img
          className="w-full h-full object-cover transition-transform group-hover:scale-110"
          src={post.imageSrc}
          alt={post.title}
          loading="lazy"
        />
      </div>
      <div>
        <h5 className="font-medium text-[#022C43] group-hover:text-[#FFD700] transition-colors line-clamp-2">
          {post.title}
        </h5>
        <p className="text-sm text-gray-500 mt-1">
          {new Date(post.date).toLocaleDateString('ar-EG', { 
            day: 'numeric', 
            month: 'short' 
          })}
        </p>
      </div>
    </Link>
  ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
  <h4 className="text-xl font-bold text-[#022C43] mb-4">مقالنا القادم</h4>
  <p className="text-sm text-gray-500 mb-4">هل ترغب في معرفة المزيد عن أحدث الاتجاهات في السفر؟ ترقب مقالنا القادم حول الوجهات السياحية الأكثر شعبية هذا العام!</p>
  {/* <button className="px-4 py-2 bg-[#115173] text-white rounded-lg hover:bg-[#022C43] transition-colors">
    تابعنا لقراءة المقال القادم
  </button> */}
</div>


          {/* Instagram Feed */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h4 className="text-xl font-bold text-[#022C43] mb-4">صور على إنستغرام</h4>
            <div className="grid grid-cols-3 gap-2">
              {[
                "https://i.pinimg.com/736x/13/0e/ce/130eceb043f953af63f10c266ea64f95.jpg",
                "https://i.pinimg.com/736x/09/6f/8b/096f8b050095e82cc66af6fd813b5795.jpg",
                "https://i.pinimg.com/736x/d8/b9/79/d8b9792a40fab3340f3fc3a911330f4b.jpg",
                "https://i.pinimg.com/736x/79/ce/63/79ce6389032fd3971e3b7c852e6b3884.jpg",
                "https://i.pinimg.com/736x/f9/01/a0/f901a043b3799805e978d6da9f63d9b4.jpg",
                "https://i.pinimg.com/736x/1d/f8/16/1df8161901846a6e8674ad70c56324f6.jpg",
              ].map((src, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="aspect-square overflow-hidden rounded-lg hover:opacity-90 transition-opacity"
                >
                  <img 
                    className="w-full h-full object-cover" 
                    src={src} 
                    alt="Instagram post" 
                    loading="lazy"
                  />
                </a>
              ))}
            </div>
            {/* <a 
              href="#" 
              className="inline-flex items-center justify-center mt-4 px-4 py-2 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <FaInstagram className="ml-2" /> تابعنا
            </a> */}
          </div>

          {/* Newsletter */}
          <div className="bg-gradient-to-br  p-6 rounded-xl text-black">
            <h4 className="text-xl font-bold mb-2">النشرة البريدية</h4>
            <p className="mb-4 opacity-90">اشترك ليصلك كل جديد من مقالات وعروض حصرية</p>
            <form className="space-y-3">
              <input 
                type="email" 
                className="w-full px-4 py-3  bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] placeholder-white/70" 
                placeholder="بريدك الإلكتروني" 
                required 
              />
                       <button 
  type="submit" 
  className="w-full py-2 px-4 my-4 bg-gradient-to-r from-[#022C43] to-[#115173] text-[#FFD700] rounded-lg hover:opacity-90 transition duration-300 font-medium"
>
  اشترك الآن
</button>
            </form>
          </div>
          
        </div>
      </div>
    </div>
    </>
  );
};

export default PlogDetails;