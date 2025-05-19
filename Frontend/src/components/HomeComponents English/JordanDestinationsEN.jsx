import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

function JordanGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [likedImages, setLikedImages] = useState({});

  const toggleLike = (index) => {
    setLikedImages(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const destinations = [
    {
      title: "THE TENNIS CLUB PLACE",
      description: "We Paddle Club - the best facilities for playing paddle tennis in Amman.",
      image: "https://www.thisisamman.com/wp-content/uploads/2023/11/355552942_626994779393395_2253788047399669891_n.jpg",
      location: "Amman"
    },
    {
      title: "GAMENATION",
      description: "An entertainment center featuring video games and unique interactive challenges.",
      image: "https://scontent.famm10-1.fna.fbcdn.net/v/t39.30808-6/475308661_540893789001661_2320922547613782719_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=vNtiqnJjYwoQ7kNvwH93R3O&_nc_oc=Admn92wTnq2vH_qA7hOBQog7Q9G0l2tkcapD_lWCsC0VUJGhA_1TgGj2LANzcuYWrP8&_nc_zt=23&_nc_ht=scontent.famm10-1.fna&_nc_gid=bMQ4afJLCtg6JfW-9W1Ydg&oh=00_AfKvVUU4De-Pm6hzrxsFYoL6gR8jZ5EKsoUxNrD2lH_odQ&oe=6824364F",
      location: "Amman"
    },
    {
      title: "Amman Panorama Art",
      description: "An art gallery showcasing artworks with a stunning view of Amman city.",
      image: "https://acorjordan.org/wp-content/uploads/2023/11/citadel-tourist-trail-amman-panorama-art-gallery-1-1800x1200-1-1024x683.jpg",
      location: "Amman"
    },
    {
      title: "The Jordanian Kitchen",
      description: "A restaurant serving the most delicious traditional Jordanian dishes in a cozy atmosphere.",
      image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/99/b5/0f/caption.jpg?w=900&h=500&s=1",
      location: "Amman"
    },
    {
      title: "Jingo’s Jungle",
      description: "We are Jingo’s Jungle, a unique indoor family entertainment center located in Amman.",
      image: "https://www.jingosjungle.com/Admin_Site/Articles/Images/0edd9d03-f483-40ba-b661-b9475f6ae254.jpg",
      location: "Amman"
    },
    {
      title: "First Archer",
      description: "Archery training center with great views of Amman. Suitable for all ages.",
      image: "https://www.joc.jo/uploads/2021/10/89f97dca98b05222e8e501572c3704ed.jpg",
      location: "Amman"
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
          <h2 className="text-4xl font-bold text-[#022C43] mb-4">Enchanting Jordan Gallery</h2>
          <p className="text-lg text-[#444444] max-w-3xl mx-auto">
            A photo tour of the most beautiful tourist destinations in the Hashemite Kingdom of Jordan
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
