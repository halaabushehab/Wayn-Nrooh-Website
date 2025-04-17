import React, { useState } from 'react';
import { 
  ChevronDownIcon, MapIcon, CompassIcon, HeartIcon, StarIcon, MapPinIcon,
  PlayCircleIcon, CameraIcon, SparklesIcon, CoffeeIcon, UtensilsIcon,
  TentIcon, MusicIcon, PaletteIcon
} from 'lucide-react';

const About = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  // Destinations data
  const destinations = [
    {
      title: 'وادي رم',
      image: 'https://images.unsplash.com/photo-1486848538113-ce1a4923fbc5?w=800&h=600&fit=crop',
      description: 'صحراء ساحرة بتشكيلات صخرية فريدة ورمال ذهبية',
      location: 'جنوب الأردن',
    },
    {
      title: 'جرش',
      image: 'https://images.unsplash.com/photo-1518130160890-3c9a1debf981?w=800&h=600&fit=crop',
      description: 'مدينة رومانية قديمة بآثار مذهلة',
      location: 'شمال الأردن',
    },
    {
      title: 'البحر الميت',
      image: 'https://images.unsplash.com/photo-1544735716-ea9ef790f501?w=800&h=600&fit=crop',
      description: 'أخفض نقطة على سطح الأرض بمياه علاجية',
      location: 'غرب الأردن',
    },
  ];

  // Experiences data
  const experiences = [
    {
      title: 'جولات ثقافية',
      description: 'استكشف التراث الأردني الغني مع السكان المحليين',
      icon: <CompassIcon className="h-8 w-8" />,
      color: 'from-amber-500 to-orange-600',
      image: 'https://images.unsplash.com/photo-1552250575-e508473b090f?w=800&auto=format&fit=crop&q=60',
    },
    {
      title: 'تذوق القهوة العربية',
      description: 'اختبر طقوس القهوة العربية التقليدية',
      icon: <CoffeeIcon className="h-8 w-8" />,
      color: 'from-brown-500 to-amber-700',
      image: 'https://images.unsplash.com/photo-1568465212448-162d3efd4560?w=800&auto=format&fit=crop&q=60',
    },
    {
      title: 'المطبخ الأردني',
      description: 'تعلم طهي الأطباق الأردنية الشهيرة',
      icon: <UtensilsIcon className="h-8 w-8" />,
      color: 'from-red-500 to-red-700',
      image: 'https://images.unsplash.com/photo-1573225342350-16731dd9bf3d?w=800&auto=format&fit=crop&q=60',
    },
    {
      title: 'مخيم صحراوي',
      description: 'أمضِ ليلة تحت النجوم في وادي رم',
      icon: <TentIcon className="h-8 w-8" />,
      color: 'from-purple-500 to-purple-800',
      image: 'https://images.unsplash.com/photo-1537905569824-f89f14cceb68?w=800&auto=format&fit=crop&q=60',
    },
    {
      title: 'الموسيقى التقليدية',
      description: 'استمع إلى الموسيقى الأردنية الأصيلة',
      icon: <MusicIcon className="h-8 w-8" />,
      color: 'from-blue-500 to-blue-700',
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop&q=60',
    },
    {
      title: 'الحرف اليدوية',
      description: 'تعلم الحرف اليدوية التقليدية',
      icon: <PaletteIcon className="h-8 w-8" />,
      color: 'from-green-500 to-green-700',
      image: 'https://images.unsplash.com/photo-1528732807373-ba48ba455b1f?w=800&auto=format&fit=crop&q=60',
    },
  ];

  // Reviews data
  const reviews = [
    {
      name: 'أحمد محمد',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      rating: 5,
      text: 'اكتشفت أماكن مذهلة لم أكن أعرف عنها من قبل. تجربة لا تُنسى!',
      location: 'البتراء، الأردن',
      position: 'right',
    },
    {
      name: 'سارة أحمد',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
      rating: 5,
      text: 'الدليل السياحي كان رائعاً وساعدني في اكتشاف الثقافة المحلية.',
      location: 'جرش، الأردن',
      position: 'left',
    },
    {
      name: 'محمد علي',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
      rating: 5,
      text: 'رحلة مميزة في وادي رم، المناظر الطبيعية كانت خلابة!',
      location: 'وادي رم، الأردن',
      position: 'right',
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-[#022C43] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1570214476695-19bd467e6f7a?q=80&w=2070&auto=format&fit=crop')",
            transform: 'translateZ(0)',
          }}
        >
          <div className="absolute inset-0 bg-[#022C43]/70"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 h-screen flex flex-col justify-center items-center text-center text-white">
          <div className="animate-fadeIn">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[#FFD700]">
              اكتشف جمال الأردن
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              رحلة استثنائية عبر الكنوز المخفية والوجهات الساحرة في المملكة الأردنية الهاشمية
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12">
              <div className="flex flex-col items-center space-y-3 p-6 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all">
                <MapIcon className="h-8 w-8 text-[#FFD700]" />
                <h3 className="text-xl font-semibold">أماكن فريدة</h3>
                <p className="text-sm opacity-90">
                  اكتشف وجهات سياحية خارج المسار التقليدي
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 p-6 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all">
                <CompassIcon className="h-8 w-8 text-[#FFD700]" />
                <h3 className="text-xl font-semibold">تجارب محلية</h3>
                <p className="text-sm opacity-90">
                  عش التجربة الأردنية الحقيقية مع السكان المحليين
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 p-6 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all">
                <HeartIcon className="h-8 w-8 text-[#FFD700]" />
                <h3 className="text-xl font-semibold">ذكريات خالدة</h3>
                <p className="text-sm opacity-90">
                  اصنع ذكريات لا تُنسى في رحلتك
                </p>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDownIcon className="h-8 w-8 text-[#FFD700]" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#022C43] mb-4">
              عن موقعنا
            </h2>
            <div className="w-24 h-1 bg-[#FFD700] mx-auto"></div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1675182571984-06de60fd8306?q=80&w=1000&auto=format&fit=crop"
                  alt="منظر طبيعي للأردن"
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </div>
            
            <div className="md:w-1/2 text-right">
              <h3 className="text-2xl font-bold text-[#115173] mb-4">
                اكتشف جمال الأردن الخفي
              </h3>
              <p className="text-[#444444] mb-4 leading-relaxed text-lg">
                مرحباً بكم في موقعنا المخصص لاكتشاف الأماكن الأقل شهرة في الأردن.
                نحن نسعى لتسليط الضوء على الكنوز المخفية والوجهات الساحرة التي لا
                تظهر عادةً في مسارات السياحة التقليدية.
              </p>
              <p className="text-[#444444] mb-6 leading-relaxed text-lg">
                من خلال هذا الموقع، نهدف إلى مشاركة المعلومات القيّمة والتجارب
                الفريدة التي تتيح للزوار استكشاف جوانب أصيلة من الثقافة الأردنية
                والمناظر الطبيعية الخلابة والمواقع التاريخية النادرة.
              </p>
              <p className="text-[#444444] leading-relaxed text-lg">
                انضموا إلينا في رحلة اكتشاف جمال الأردن بعيداً عن الطرق المطروقة،
                واستمتعوا بتجارب سفر أصيلة ستبقى في ذاكرتكم إلى الأبد.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-[#FFD700] hover:transform hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-xl font-bold text-[#022C43] mb-4 text-center">
                اكتشاف الأماكن
              </h3>
              <p className="text-[#444444] text-center">
                نقدم معلومات مفصلة عن الأماكن الأقل شهرة في الأردن، مع نصائح
                للزيارة وأفضل الأوقات للاستمتاع بها.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-[#FFD700] hover:transform hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-xl font-bold text-[#022C43] mb-4 text-center">
                الثقافة المحلية
              </h3>
              <p className="text-[#444444] text-center">
                نستكشف العادات والتقاليد الأردنية الأصيلة، والمأكولات المحلية،
                والحرف اليدوية التي تعكس تراث المملكة الغني.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-[#FFD700] hover:transform hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-xl font-bold text-[#022C43] mb-4 text-center">
                تجارب فريدة
              </h3>
              <p className="text-[#444444] text-center">
                نشارك قصص وتجارب حقيقية من مسافرين اكتشفوا سحر الأردن الخفي، ونقدم
                اقتراحات لمغامرات لا تُنسى.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#022C43] mb-4">
              وجهات مميزة
            </h2>
            <div className="w-24 h-1 bg-[#FFD700] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {destinations.map((destination, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
              >
                <div className="relative h-64">
                  <img
                    src={destination.image}
                    alt={destination.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
                </div>
                
                <div className="absolute bottom-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">{destination.title}</h3>
                  <p className="text-sm mb-2">{destination.description}</p>
                  <div className="flex items-center text-[#FFD700]">
                    <MapPinIcon className="h-4 w-4 ml-1" />
                    <span className="text-sm">{destination.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experiences Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#022C43] mb-4">
              تجارب فريدة في الأردن
            </h2>
            <div className="w-24 h-1 bg-[#FFD700] mx-auto mb-6"></div>
            <p className="text-xl text-[#444444] max-w-2xl mx-auto">
              اكتشف الثقافة الأردنية من خلال تجارب حية وفريدة
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map((experience, index) => (
              <div
                key={index}
                className="group relative transform transition-all duration-500 hover:scale-105"
              >
                <div className="relative h-96 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br bg-opacity-90 backdrop-blur-sm p-6 flex flex-col justify-between">
                    <div className={`absolute inset-0 bg-gradient-to-br ${experience.color} opacity-90`}></div>
                    
                    <div className="relative z-10">
                      <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                        {React.cloneElement(experience.icon, {
                          className: 'h-8 w-8 text-white',
                        })}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">
                        {experience.title}
                      </h3>
                      <p className="text-white/90 text-lg">
                        {experience.description}
                      </p>
                    </div>
                    
                    <div className="relative z-10">
                      <button className="bg-white/20 hover:bg-white/30 text-white py-2 px-6 rounded-lg transition-colors">
                        اكتشف المزيد
                      </button>
                    </div>
                  </div>
                  
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                    style={{
                      backgroundImage: `url(${experience.image})`,
                    }}
                  ></div>
                </div>
                
                <div className="absolute -bottom-4 left-4 right-4 h-12 bg-gradient-to-t from-black/10 to-transparent rounded-xl blur-xl transform transition-all duration-500 group-hover:scale-110 group-hover:translate-y-1"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#022C43] mb-4">
              رحلات ملهمة
            </h2>
            <div className="w-24 h-1 bg-[#FFD700] mx-auto"></div>
          </div>
          
          <div className="relative">
            <div className="absolute top-0 left-1/2 w-1 h-full bg-[#FFD700]/20 transform -translate-x-1/2 rounded-full" />
            
            <div className="space-y-24">
              {reviews.map((review, index) => (
                <div key={index} className="relative">
                  <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#FFD700] rounded-full z-10">
                    <div className="absolute w-8 h-8 bg-[#FFD700]/20 rounded-full -left-2 -top-2 animate-ping" />
                  </div>
                  
                  <div className={`flex items-center ${review.position === 'left' ? 'flex-row-reverse' : 'flex-row'} gap-8`}>
                    <div className={`w-1/2 ${review.position === 'left' ? 'text-left' : 'text-right'}`}>
                      <div className="bg-white rounded-lg shadow-xl p-6 transform transition-transform hover:-translate-y-2">
                        <div className={`flex items-center ${review.position === 'left' ? 'flex-row' : 'flex-row-reverse'} mb-4`}>
                          <img
                            src={review.image}
                            alt={review.name}
                            className="w-16 h-16 rounded-full object-cover border-4 border-[#FFD700]/20"
                          />
                          <div className={review.position === 'left' ? 'ml-4' : 'mr-4'}>
                            <h3 className="font-bold text-[#022C43] text-lg">
                              {review.name}
                            </h3>
                            <div className="flex items-center text-[#FFD700]">
                              <MapPinIcon className="h-4 w-4 inline mx-1" />
                              <span className="text-sm">{review.location}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex mb-3">
                          {[...Array(review.rating)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className="h-5 w-5 text-[#FFD700] fill-current"
                            />
                          ))}
                        </div>
                        
                        <p className="text-[#444444] leading-relaxed">
                          {review.text}
                        </p>
                      </div>
                    </div>
                    <div className="w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="w-full bg-gradient-to-r from-[#022C43] to-[#115173] py-16">
        <div className="container mx-auto px-4 mb-12">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <SparklesIcon className="h-8 w-8 text-[#FFD700] animate-pulse mr-2" />
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                شاهد روعة الأردن
              </h2>
              <SparklesIcon className="h-8 w-8 text-[#FFD700] animate-pulse ml-2" />
            </div>
            
            <div className="w-24 h-1 bg-[#FFD700] mx-auto mb-6"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <div className="flex items-center justify-center space-x-2 text-white/90">
                <CameraIcon className="h-5 w-5 text-[#FFD700] ml-2" />
                <span>مناظر خلابة</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-white/90">
                <HeartIcon className="h-5 w-5 text-[#FFD700] ml-2" />
                <span>لحظات لا تنسى</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-white/90">
                <SparklesIcon className="h-5 w-5 text-[#FFD700] ml-2" />
                <span>تجارب مميزة</span>
              </div>
            </div>
            
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              استعد لرحلة بصرية مذهلة عبر أجمل المعالم السياحية في الأردن. شاهد
              الآن واترك نفسك تنبهر بجمال وسحر المملكة!
            </p>
          </div>
        </div>
        
        <div className="relative w-full max-w-[1920px] mx-auto overflow-hidden">
          {!isPlaying && (
            <div
              className="absolute inset-0 bg-[#022C43]/40 backdrop-blur-sm z-10 flex flex-col items-center justify-center cursor-pointer group"
              onClick={handlePlayClick}
            >
              <div className="transform transition-all duration-500 group-hover:scale-110">
                <div className="relative">
                  <div className="absolute -inset-4 bg-[#FFD700]/20 rounded-full blur-xl group-hover:bg-[#FFD700]/30 transition-all duration-500"></div>
                  <PlayCircleIcon className="w-24 h-24 text-white relative z-10 group-hover:text-[#FFD700] transition-colors duration-500" />
                </div>
              </div>
              <p className="mt-6 text-xl text-white font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                انقر للمشاهدة
              </p>
            </div>
          )}
          
          <div className="aspect-video w-full">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/3zTR4ayDG38${isPlaying ? '?autoplay=1' : ''}`}
              title="استكشاف الأردن"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
    
      </section>
    </div>
  );
};

export default About;



// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import VideoBackground from './VideoBackground';
// import CityCard from './CityCard';
// import { ArrowDown, Play } from 'lucide-react';
// import { Button } from './ui/button';

// interface City {
//   id: number;
//   name: string;
//   image: string;
//   description: string;
// }

// const cities: City[] = [
//   {
//     id: 1,
//     name: 'عمّان',
//     image: 'https://images.unsplash.com/photo-1534540378968-e7d168710dbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
//     description: 'عاصمة الأردن ومدينة التلال السبعة، تجمع بين العراقة والحداثة'
//   },
//   {
//     id: 2,
//     name: 'إربد',
//     image: 'https://images.unsplash.com/photo-1499036593103-e6e4e481f0b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
//     description: 'ثاني أكبر مدن الأردن، مركز ثقافي وتعليمي مهم'
//   },
//   {
//     id: 3,
//     name: 'الرزقة',
//     image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
//     description: 'واحة من الجمال الطبيعي والتراث الأصيل في المملكة الأردنية'
//   }
// ];

// const About: React.FC = () => {
//   const [activeCity, setActiveCity] = useState<number | null>(null);
//   const [showVideo, setShowVideo] = useState(false);
  
//   const handleCityClick = (id: number) => {
//     setActiveCity(id === activeCity ? null : id);
//   };
  
//   return (
//     <div className="relative w-full h-screen overflow-hidden">
//       {/* Background Video */}
//       <VideoBackground 
//         videoSrc="/jordan-landscapes.mp4" 
//         fallbackImage="https://images.unsplash.com/photo-1612453942776-981fae54dcca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
//       />
      
//       {/* Hero Content */}
//       <div className="relative z-10 w-full h-full flex flex-col items-center justify-between pt-20 pb-10 px-4 md:px-8">
//         {/* Header */}
//         <motion.div 
//           className="text-center"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7 }}
//         >
//           <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
//             <span className="text-jordanian-gold gold-glow">دُرر</span> المُدُن الأردنية
//           </h1>
//           <p className="text-white text-xl max-w-2xl mx-auto">
//             اكتشف جمال وأصالة مدن المملكة الأردنية الهاشمية
//           </p>
          
//           <motion.div 
//             className="mt-8"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.5, duration: 0.5 }}
//           >
//             <Button 
//               className="btn-jordanian flex items-center gap-2"
//               onClick={() => setShowVideo(true)}
//             >
//               <Play size={16} />
//               <span>شاهد الفيديو</span>
//             </Button>
//           </motion.div>
//         </motion.div>
        
//         {/* City Cards */}
//         <motion.div 
//           className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.3, duration: 0.7 }}
//         >
//           {cities.map((city) => (
//             <CityCard 
//               key={city.id}
//               name={city.name}
//               image={city.image}
//               description={city.description}
//               onClick={() => handleCityClick(city.id)}
//               isActive={activeCity === city.id}
//             />
//           ))}
//         </motion.div>
        
//         {/* Scroll Down Indicator */}
//         <motion.div 
//           className="flex flex-col items-center mt-8"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.8, duration: 0.5 }}
//         >
//           <span className="text-jordanian-gold mb-2">اكتشف المزيد</span>
//           <motion.div 
//             animate={{ y: [0, 10, 0] }} 
//             transition={{ repeat: Infinity, duration: 1.5 }}
//           >
//             <ArrowDown className="text-jordanian-gold" size={24} />
//           </motion.div>
//         </motion.div>
//       </div>
      
//       {/* Video Modal */}
//       {showVideo && (
//         <motion.div 
//           className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//         >
//           <div className="relative w-full max-w-4xl">
//             <button 
//               className="absolute -top-10 right-0 text-white hover:text-jordanian-gold"
//               onClick={() => setShowVideo(false)}
//             >
//               إغلاق
//             </button>
//             <div className="aspect-video bg-black">
//               <iframe 
//                 width="100%" 
//                 height="100%" 
//                 src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
//                 title="Jordan Cities" 
//                 frameBorder="0"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
//                 allowFullScreen
//               ></iframe>
//             </div>
//           </div>
//         </motion.div>
//       )}
//     </div>
//   );
// };

// export default About;