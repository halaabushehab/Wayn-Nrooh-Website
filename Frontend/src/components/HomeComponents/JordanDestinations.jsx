
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, MapPin, Star } from "lucide-react";

function JordanGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [likedImages, setLikedImages] = useState({});

  const toggleLike = (index) => {
    setLikedImages(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const destinations = [
    {
      title: "THE TENNIS CLUB PLACE",
      description: "نادي وي بادل  أفضل المرافق للعب البادل  في عمان.",
      image: "https://www.thisisamman.com/wp-content/uploads/2023/11/355552942_626994779393395_2253788047399669891_n.jpg",  // استبدل بالصورة المناسبة
      location: "عمان"
    },
    {
      title: "GAMENATION",
      description: "مركز ألعاب ترفيهية يحتوي على ألعاب فيديو وتحديات تفاعلية مميزة.",
      image: "https://scontent.famm6-1.fna.fbcdn.net/v/t39.30808-6/475207778_540893809001659_6627218436564345549_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_ohc=HBuvSUNZnsAQ7kNvwEJuSBu&_nc_oc=AdknFRBtVrKu4YusLlOHrdomR4-HTl-0ORgFtaqNpx6o2OoPxwgTf9KmUq_SL8Fh9O8&_nc_zt=23&_nc_ht=scontent.famm6-1.fna&_nc_gid=hHzJC6i000K7M3fzVacu-w&oh=00_AfGSc_hqQ8uY7J6qIxoiHJ4WtxXhO137NwEVt-IcDb6yMQ&oe=681ACA0E",  // استبدل بالصورة المناسبة
      location: "عمان"
    },
    {
      title: "Amman Panorama Art",
      description: "معرض فني يعرض أعمالاً فنية مع إطلالة رائعة على مدينة عمان.",
      image: "https://acorjordan.org/wp-content/uploads/2023/11/citadel-tourist-trail-amman-panorama-art-gallery-1-1800x1200-1-1024x683.jpg",  // استبدل بالصورة المناسبة
      location: "عمان"
    },
    {
      title: "The Jordanian Kitchen",
      description: "مطعم يقدم أشهى الأطباق الأردنية التقليدية في جو مريح ودي.",
      image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/99/b5/0f/caption.jpg?w=900&h=500&s=1",  // استبدل بالصورة المناسبة
      location: "عمان"
    },
    {
      title: "Jingo’s Jungle",
      description: " نحن غابة جينغو ، مركز ترفيهي عائلي داخلي ذو طابع خاص، يقع في مدينة عمّان،",
      image: "https://www.jingosjungle.com/Admin_Site/Articles/Images/0edd9d03-f483-40ba-b661-b9475f6ae254.jpg",  // استبدل بالصورة المناسبة
      location: "عمان"
    },
    {
      title: "First Archer",
      description: "مركز تدريب رماية مع إطلالات رائعة على مدينة عمان. مناسب لجميع الأعمار.",
      image: "https://www.joc.jo/uploads/2021/10/89f97dca98b05222e8e501572c3704ed.jpg",  // استبدل بالصورة المناسبة
      location: "عمان"
    }
  ];
  

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % destinations.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + destinations.length) % destinations.length);
  };


  return (
    <section className="py-16 ">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#022C43] mb-4">معرض الأردن الساحر</h2>
          <p className="text-lg text-[#444444] max-w-3xl mx-auto">
            جولة مصورة بين أجمل الوجهات السياحية في المملكة الأردنية الهاشمية
          </p>
        </div>

        {/* Main Gallery */}
        <div className="relative h-[70vh] mb-8 rounded-2xl overflow-hidden shadow-xl">
          {/* Navigation Arrows */}
          <button 
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all"
          >
            <ChevronLeft className="h-6 w-6 text-[#022C43]" />
          </button>
          
          <button 
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all"
          >
            <ChevronRight className="h-6 w-6 text-[#022C43]" />
          </button>

          {/* Like Button */}
          <button 
            onClick={() => toggleLike(activeIndex)}
            className="absolute top-4 right-4 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all"
          >
            <Heart 
              className={`h-6 w-6 ${likedImages[activeIndex] ? 'text-red-500 fill-red-500' : 'text-[#022C43]'}`} 
            />
          </button>

          {/* Current Image */}
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative h-full w-full"
          >
            <img
              src={destinations[activeIndex].image}
              alt={destinations[activeIndex].title}
              className="w-full h-full object-cover"
            />
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">{destinations[activeIndex].title}</h3>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-5 w-5" />
                <span>{destinations[activeIndex].location}</span>
                <Star className="h-5 w-5 ml-4 text-yellow-400" />
                <span>4.8</span>
              </div>
              <p>{destinations[activeIndex].description}</p>
            </div>
          </motion.div>
        </div>

        {/* Thumbnail Gallery */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {destinations.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative h-32 rounded-lg overflow-hidden cursor-pointer transition-all ${activeIndex === index ? 'ring-4 ring-[#FFD700]' : ''}`}
              onClick={() => setActiveIndex(index)}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 hover:bg-black/10 transition-all" />
              {likedImages[index] && (
                <div className="absolute top-2 right-2">
                  <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Gallery Info */}
        <div className="text-center mt-8">
          <p className="text-[#444444]">
            {activeIndex + 1} / {destinations.length} - {destinations[activeIndex].title}
          </p>
        </div>
      </div>
    </section>
  );
}

export default JordanGallery;