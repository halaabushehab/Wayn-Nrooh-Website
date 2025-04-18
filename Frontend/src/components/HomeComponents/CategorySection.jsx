import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  UtensilsIcon,
  LandmarkIcon,
  TreesIcon,
  DumbbellIcon,
  HeartIcon,
  MusicIcon,
  ShoppingBagIcon,
  CameraIcon,
  MountainIcon,
  BookIcon,
} from 'lucide-react';
import { PlaceCard } from '../HomeComponents/PlaceCard';
const CategorySection = () => {
  const [activeCategory, setActiveCategory] = useState('متاحف');
  const [activePlaces, setActivePlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);




  // "أماكن أثرية",
  // منتزهات
  const categories = [
    { id: 'مطاعم', name: 'مطاعم', icon: <UtensilsIcon className="w-5 h-5" /> },
    { id: 'متاحف', name: 'متاحف', icon: <LandmarkIcon className="w-5 h-5" /> },
    { id: 'حدائق', name: 'حدائق', icon: <TreesIcon className="w-5 h-5" /> },
    { id: 'رياضة', name: 'رياضة', icon: <DumbbellIcon className="w-5 h-5" /> },
    { id: 'الأطفال', name: 'الأطفال', icon: <HeartIcon className="w-5 h-5" /> },
    { id: 'ترفيه', name: 'ترفيه', icon: <MusicIcon className="w-5 h-5" /> },
    { id: 'تسوق', name: 'تسوق', icon: <ShoppingBagIcon className="w-5 h-5" /> },
    { id: 'تصوير', name: 'تصوير', icon: <CameraIcon className="w-5 h-5" /> },
    { id: 'تاريخي', name: 'تاريخي', icon: <LandmarkIcon className="w-5 h-5" /> },
    { id: 'مغامرات', name: 'مغامرات', icon: <MountainIcon className="w-5 h-5" /> },
    { id: 'تعليمي', name: 'تعليمي', icon: <BookIcon className="w-5 h-5" /> },
  ];

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      setError(null);
      console.log(`Fetching places for category: ${activeCategory}`);

      try {
        const response = await axios.get(`http://localhost:9527/places/category/${activeCategory}`);
        console.log("API Response:", response.data);

        if (Array.isArray(response.data)) {
          setActivePlaces(response.data);
        } else {
          console.error("البيانات المسترجعة ليست مصفوفة", response.data);
          setActivePlaces([]);
        }
      } catch (err) {
        setError(err.response ? err.response.data.message : 'فشل في جلب البيانات');
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [activeCategory]);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">استكشف حسب الفئة</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            اكتشف أفضل الأماكن في الأردن مصنفة حسب الفئات المختلفة. من المطاعم الشهيرة إلى المتاحف التاريخية والمنتزهات الخلابة.
          </p>
        </div>

        <div
          className="flex overflow-x-auto pb-4 mb-8 scrollbar-hide"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#ffffff transparent',
          }}
        >
          <div className="flex space-x-4 space-x-reverse mx-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center px-5 py-3 rounded-full whitespace-nowrap transition-all ${
                  activeCategory === category.id
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="col-span-full text-center py-20">
            <p className="text-gray-500 text-lg">جارٍ تحميل البيانات...</p>
          </div>
        ) : error ? (
          <div className="col-span-full text-center py-20">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activePlaces.length > 0 ? (
              activePlaces.map((place) =>
                place ? <PlaceCard key={place._id} place={place} /> : null
              )
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-500 text-lg">لا توجد أماكن في هذه الفئة حالياً</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategorySection;



































// import React, { useState } from 'react'
// import {
//   UtensilsIcon,
//   LandmarkIcon,
//   TreesIcon,
//   DumbbellIcon,
//   HeartIcon,
//   CoffeeIcon,
//   MusicIcon,
//   ShoppingBagIcon,
// } from 'lucide-react'
// import { PlaceCard } from '../HomeComponents/PlaceCard'

// const CategorySection = () => {
//   const [activeCategory, setActiveCategory] = useState('restaurants')
//   const categories = [
//     {
//       id: 'restaurants',
//       name: 'مطاعم ومقاهي',
//       icon: <UtensilsIcon className="w-5 h-5"  />
//       ,
//     },
//     {
//       id: 'museums',
//       name: 'متاحف',
//       icon: <LandmarkIcon className="w-5 h-5" />,
//     },
//     {
//       id: 'parks',
//       name: 'منتزهات',
//       icon: <TreesIcon className="w-5 h-5" />,
//     },
//     {
//       id: 'sports',
//       name: 'نوادي رياضية',
//       icon: <DumbbellIcon className="w-5 h-5" />,
//     },
//     {
//       id: 'kids',
//       name: 'أنشطة للأطفال',
//       icon: <HeartIcon className="w-5 h-5" />,
//     },
//     // {
//     //   id: 'cafes',
//     //   name: 'مقاهي',
//     //   icon: <CoffeeIcon className="w-5 h-5" />,
//     // },
//     {
//       id: 'entertainment',
//       name: 'ترفيه',
//       icon: <MusicIcon className="w-5 h-5" />,
//     },
//     {
//       id: 'shopping',
//       name: 'تسوق',
//       icon: <ShoppingBagIcon className="w-5 h-5" />,
//     },
//   ]
  
//   const places = {
//     restaurants: [
//       {
//         id: 1,
//         name: 'مطعم هاشم',
//         location: 'وسط البلد، عمان',
//         image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2574&auto=format&fit=crop',
//         rating: 4.8,
//         reviews: 320,
//         influencer: 'سارة الأردنية',
//         influencerImage: 'https://i.pravatar.cc/100?img=5',
//       },
//       {
//         id: 2,
//         name: 'مطعم سفرة',
//         location: 'الدوار السابع، عمان',
//         image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2570&auto=format&fit=crop',
//         rating: 4.5,
//         reviews: 180,
//         influencer: 'محمد الخطيب',
//         influencerImage: 'https://i.pravatar.cc/100?img=12',
//       },
//       {
//         id: 3,
//         name: 'مطعم ليفانت',
//         location: 'جبل عمان',
//         image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2574&auto=format&fit=crop',
//         rating: 4.7,
//         reviews: 210,
//         influencer: 'رنا العبدالله',
//         influencerImage: 'https://i.pravatar.cc/100?img=23',
//       },
//       {
//         id: 4,
//         name: 'مطعم الكلحة',
//         location: 'العقبة',
//         image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2574&auto=format&fit=crop',
//         rating: 4.9,
//         reviews: 150,
//         influencer: 'أحمد السالم',
//         influencerImage: 'https://i.pravatar.cc/100?img=15',
//       },
//     ],
//     museums: [
//       {
//         id: 5,
//         name: 'متحف الأردن',
//         location: 'جبل اللويبدة، عمان',
//         image: 'https://images.unsplash.com/photo-1566127992631-137a642a90f4?q=80&w=2670&auto=format&fit=crop',
//         rating: 4.6,
//         reviews: 120,
//         influencer: 'ليلى الخطيب',
//         influencerImage: 'https://i.pravatar.cc/100?img=20',
//       },
//       {
//         id: 6,
//         name: 'متحف السيارات الملكي',
//         location: 'الحسين للشباب، عمان',
//         image: 'https://images.unsplash.com/photo-1572248525483-6a228e2a2d46?q=80&w=2574&auto=format&fit=crop',
//         rating: 4.4,
//         reviews: 90,
//         influencer: 'عمر الراشد',
//         influencerImage: 'https://i.pravatar.cc/100?img=11',
//       },
//     ],
//     parks: [
//       {
//         id: 7,
//         name: 'حدائق الحسين',
//         location: 'عمان',
//         image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?q=80&w=2670&auto=format&fit=crop',
//         rating: 4.7,
//         reviews: 200,
//         influencer: 'سلمى العمري',
//         influencerImage: 'https://i.pravatar.cc/100?img=9',
//       },
//     ],
//   }

//   const activePlaces = places[activeCategory] || []

//   return (
//     <section className="py-16 bg-white">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-bold mb-4">استكشف حسب الفئة</h2>
//           <p className="text-gray-600 max-w-2xl mx-auto">
//             اكتشف أفضل الأماكن في الأردن مصنفة حسب الفئات المختلفة. من المطاعم
//             الشهيرة إلى المتاحف التاريخية والمنتزهات الخلابة.
//           </p>
//         </div>
//         <div className="flex overflow-x-auto pb-4 mb-8 scrollbar-hide">
//           <div className="flex space-x-4 space-x-reverse mx-auto">
//             {categories.map((category) => (
//               <button
//                 key={category.id}
//                 onClick={() => setActiveCategory(category.id)}
//                 className={`flex items-center px-5 py-3 rounded-full whitespace-nowrap transition-all ${activeCategory === category.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
//               >
//                 <span className="mr-2">{category.icon}</span>
//                 {category.name}
//               </button>
//             ))}
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {activePlaces.length > 0 ? (
//             activePlaces.map((place) => (
//               <PlaceCard key={place.id} place={place} />
//             ))
//           ) : (
//             <div className="col-span-full text-center py-20">
//               <p className="text-gray-500 text-lg">
//                 لا توجد أماكن في هذه الفئة حالياً
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   )
// }

// export default CategorySection








