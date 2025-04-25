import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Star, 
  Calendar, 
  ChevronDown, 
  Filter, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Trash2,
  Edit
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Places() {
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 1
  });
  const [stats, setStats] = useState({
    topPlaces: [],
    byCategory: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        setError(null);
  
        const url = `http://localhost:9527/api/places?page=${pagination.page}&limit=${pagination.limit}${
          filter !== 'all' ? `&status=${filter}` : ''
        }`;
  
        const placesRes = await axios.get(url, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
  
        if (placesRes.data && Array.isArray(placesRes.data.docs)) {
          setPlaces(placesRes.data.docs);
          setPagination({
            ...pagination,
            total: placesRes.data.totalDocs,
            totalPages: placesRes.data.totalPages
          });
        }
  
        // تعيين قيم افتراضية للإحصائيات مؤقتاً
        setStats({
          topPlaces: [],
          byCategory: []
        });
  
        setLoading(false);
      } catch (error) {
        console.error('Error fetching places:', error);
        setError('Failed to fetch places. Please try again.');
        setLoading(false);
      }
    };
  
    fetchPlaces();
  }, [filter, pagination.page, pagination.limit]);

  const handleApprove = async (id) => {
    try {
      await axios.patch(`http://localhost:9527/api/places/${id}/status`, 
        { status: 'approved' }, 
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setPlaces(places.map(p => p._id === id ? { ...p, status: 'approved' } : p));
      toast.success('Place approved successfully');
    } catch (error) {
      toast.error('Failed to approve place');
      console.error('Error:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.patch(`http://localhost:9527/api/places/${id}/status`, 
        { status: 'rejected' }, 
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setPlaces(places.map(p => p._id === id ? { ...p, status: 'rejected' } : p));
      toast.success('Place rejected successfully');
    } catch (error) {
      toast.error('Failed to reject place');
      console.error('Error:', error);
    }
  };

  const handleSoftDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this place?')) return;

    try {
      await axios.delete(`http://localhost:9527/api/places/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPlaces(places.filter(p => p._id !== id));
      toast.success('Place deleted successfully');
    } catch (error) {
      toast.error('Failed to delete place');
      console.error('Error:', error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/places/edit/${id}`);
  };

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
    } else {
      toast.info('This is the last page');
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Places Management</h1>
          <p className="text-gray-500">Manage all places in the system</p>
        </div>
        <button 
          className="bg-[#115173] hover:bg-[#053F5E] text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          onClick={() => navigate('/admin/places/add')}
        >
          <Plus size={18} className="ml-2" />
          Add New Place
        </button>
      </div>

      {/* Filters and search */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex space-x-2 space-x-reverse">
            <button
              className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-gray-100'}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${filter === 'approved' ? 'bg-green-100 text-green-700 font-medium' : 'bg-gray-100'}`}
              onClick={() => setFilter('approved')}
            >
              Approved
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-amber-100 text-amber-700 font-medium' : 'bg-gray-100'}`}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${filter === 'rejected' ? 'bg-red-100 text-red-700 font-medium' : 'bg-gray-100'}`}
              onClick={() => setFilter('rejected')}
            >
              Rejected
            </button>
          </div>
          
          <div className="flex w-full md:w-auto space-x-2 space-x-reverse">
            <div className="relative flex-1 md:flex-none">
              <input
                type="text"
                placeholder="Search for a place..."
                className="w-full md:w-64 border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-[#053F5E] focus:border-[#053F5E]"
              />
              <Filter
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Places list */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#115173]"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.length > 0 ? (
                places.map((place) => (
                  <PlaceCard
                    key={place._id}
                    place={place}
                    onApprove={() => handleApprove(place._id)}
                    onReject={() => handleReject(place._id)}
                    onDelete={() => handleSoftDelete(place._id)}
                    onEdit={() => handleEdit(place._id)}
                  />
                ))
              ) : (
                <div className="col-span-3 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <MapPin className="h-12 w-12 mb-4 text-gray-300" />
                    <p className="text-lg">No places match your search</p>
                  </div>
                </div>
              )}
            </div>

            {/* Pagination */}
            {places.length > 0 && (
              <div className="mt-8 flex justify-center">
                <div className="flex space-x-2 space-x-reverse">
                  <button 
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
                    onClick={() => changePage(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    <ChevronDown className="rotate-90" size={18} />
                  </button>
                  
                  {Array.from({ length: Math.min(3, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page === 1) {
                      pageNum = i + 1;
                    } else if (pagination.page === pagination.totalPages) {
                      pageNum = pagination.totalPages - 2 + i;
                    } else {
                      pageNum = pagination.page - 1 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg border ${pagination.page === pageNum ? 'bg-[#115173] text-white border-[#115173]' : 'bg-white border-gray-300 hover:bg-gray-50'}`}
                        onClick={() => changePage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button 
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
                    onClick={() => changePage(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    <ChevronDown className="-rotate-90" size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Most Visited Places</h2>
          <div className="space-y-4">
            {stats.topPlaces.length > 0 ? (
              stats.topPlaces.map((place, i) => (
                <div key={i} className="flex items-center">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {i + 1}
                  </span>
                  <span className="flex-1 mx-3">{place.name}</span>
                  <span className="text-gray-500">
                    {place.visits?.toLocaleString() || 0} visits
                  </span>
                  {place.trend && (
                    <span className={`text-xs px-2 py-1 rounded-full ${place.trend.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {place.trend}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">No data available</div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Places by Category</h2>
          <div className="space-y-4">
            {stats.byCategory.length > 0 ? (
              stats.byCategory.map((category, i) => (
                <div key={i} className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${getCategoryColor(category.category)}`}></div>
                  <span className="flex-1 mr-3">{category.category}</span>
                  <span className="text-gray-500">{category.count} places</span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">No data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
function PlaceCard({ place, onApprove, onReject, onDelete, onEdit }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="relative h-48">
        {place.images?.length > 0 ? (
          <img 
            src={place.images[0].path || place.images[0]} 
            alt={place.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
            <MapPin size={40} />
          </div>
        )}
        
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium">
          {place.category || 'Uncategorized'}
        </div>
        
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium ${
          place.status === 'approved' ? 'bg-green-100 text-green-800' :
          place.status === 'rejected' ? 'bg-red-100 text-red-800' :
          'bg-amber-100 text-amber-800'
        }`}>
          {place.status === 'approved' ? 'Approved' : 
           place.status === 'rejected' ? 'Rejected' : 'Pending'}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800">{place.name}</h3>
        <div className="flex items-center text-gray-500 text-sm mt-1">
          <MapPin size={14} className="ml-1" />
          {place.location?.city || 'Location not specified'}
        </div>
        
        <div className="mt-3 text-sm text-gray-600 line-clamp-2">
          {place.description}
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center text-sm">
            <span className="text-gray-500">Created by:</span>
            <span className="font-medium mr-1">{place.createdBy?.username || 'Admin'}</span>
          </div>
          
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar size={14} className="ml-1" />
            {new Date(place.createdAt).toLocaleDateString()}
          </div>
        </div>
        
        <div className="mt-4 flex space-x-2 space-x-reverse">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Edit size={16} />
            <span>Edit</span>
          </button>
          
          {place.status !== 'approved' ? (
            <button
              onClick={onApprove}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              <CheckCircle2 size={16} />
              <span>Approve</span>
            </button>
          ) : (
            <button
              onClick={onReject}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
            >
              <XCircle size={16} />
              <span>Reject</span>
            </button>
          )}
          
          <button
            onClick={onDelete}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper function to get category color
function getCategoryColor(category) {
  const colors = {
    'Tourist Attractions': 'bg-blue-500',
    'Museums': 'bg-purple-500',
    'Parks': 'bg-green-500',
    'Beaches': 'bg-amber-500',
    'Mountains': 'bg-red-500',
    'Entertainment': 'bg-pink-500'
  };
  return colors[category] || 'bg-gray-500';
}











// import React, { useState, useEffect } from 'react';
// import { 
//   MapPin, 
//   Star, 
//   Calendar, 
//   ChevronDown, 
//   Filter, 
//   Plus, 
//   CheckCircle2, 
//   XCircle, 
//   Clock,
//   Trash2,
//   Edit
// } from 'lucide-react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';

// export default function Places() {
//   const [filter, setFilter] = useState('all');
//   const [loading, setLoading] = useState(true);
//   const [places, setPlaces] = useState([]);
//   const [error, setError] = useState(null);  // تعريف setError

//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 6,
//     total: 0,
//     totalPages: 1
//   });
//   const [stats, setStats] = useState({
//     topPlaces: [],
//     byCategory: []
//   });;
//   const navigate = useNavigate()

//   // Fetch data from server
//   useEffect(() => {
//     const fetchPlaces = async () => {
//       try {
//         const response = await axios.get("http://localhost:9527/api/places/");
//         console.log(response.data); // تحقق من بنية البيانات هنا
//         if (Array.isArray(response.data.data.docs)) {
//           setPlaces(response.data.data.docs);
//         } else {
//           setError("البيانات غير صحيحة.");
//         }
        
        
//         console.log("بيانات السيرفر:", response.data);

//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching places:", error);
//         setError("حدث خطأ أثناء جلب الأماكن.");
//         setLoading(false);
//       }
//     };
    
    
    

//     fetchPlaces();
//   }, []); // يتم استدعاء fetchPlaces فقط عند تحميل المكون لأول مرة





//   // Handle approval
//   const handleApprove = async (id) => {
//     try {
//       const response = await axios.patch(
//         `http://localhost:9527/api/places/${id}/status`, 
//         { status: 'approved' }, 
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         }
//       );
//       console.log(response.data); // تحقق من بنية البيانات هنا

//       // Update UI
//       setPlaces(places.map(p => 
//         p._id === id ? { ...p, status: 'approved' } : p
//       ));
  
//       toast.success('Place approved successfully');
//     } catch (error) {
//       toast.error('Failed to approve place');
//       console.error('Error:', error);
//     }
//   };

//   // Handle rejection
//   const handleReject = async (id) => {
//     try {
//       await axios.patch(
//         `http://localhost:9527/api/places/${id}/status`, 
//         { status: 'rejected' }, 
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         }
//       );

//       // Update UI
//       setPlaces(places.map(p => 
//         p._id === id ? { ...p, status: 'rejected' } : p
//       ));
//       toast.success('Place rejected successfully');
//     } catch (error) {
//       toast.error('Failed to reject place');
//       console.error('Error:', error);
//     }
//   };

//  // Handle soft delete
//  const handleSoftDelete = async (id) => {
//   if (!window.confirm('Are you sure you want to delete this place?')) return;
  
//   try {
//     const response = await axios.delete(`http://localhost:9527/api/places/${id}`, {
//       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//     });
    
//     if (response.data.success) {
//       setPlaces(places.filter(p => p._id !== id));
//       toast.success('Place deleted successfully');
//     } else {
//       toast.error(response.data.message || 'Failed to delete place');
//     }
//   } catch (error) {
//     toast.error(error.response?.data?.message || 'Failed to delete place');
//     console.error('Error:', error);
//   }
// };

  
//   // Handle edit
//   const handleEdit = (id) => {
//     navigate(`/admin/places/edit/${id}`);
//   };

//   // Change page
//   const changePage = (newPage) => {
//     if (newPage >= 1 && newPage <= pagination.totalPages) {
//       setPagination({ ...pagination, page: newPage });
//     } else {
//       toast.info('This is the last page');
//     }
//   };

//   // return (
//   //   <div className="space-y-6 p-6 bg-gray-50">
//   //     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//   //       <div>
//   //         <h1 className="text-2xl font-bold text-gray-800">Places Management</h1>
//   //         <p className="text-gray-500">Manage all places in the system</p>
//   //       </div>
//   //       <button 
//   //         className="bg-[#115173] hover:bg-[#053F5E] text-white px-4 py-2 rounded-lg flex items-center transition-colors"
//   //         onClick={() => navigate('/admin/places/add')}
//   //       >
//   //         <Plus size={18} className="ml-2" />
//   //         Add New Place
//   //       </button>
//   //     </div>

//   //     {/* Filters and search */}
//   //     <div className="bg-white rounded-xl shadow-sm p-6">
//   //       <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
//   //         <div className="flex space-x-2 space-x-reverse">
//   //           <button
//   //             className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-gray-100'}`}
//   //             onClick={() => setFilter('all')}
//   //           >
//   //             All
//   //           </button>
//   //           <button
//   //             className={`px-4 py-2 rounded-lg ${filter === 'approved' ? 'bg-green-100 text-green-700 font-medium' : 'bg-gray-100'}`}
//   //             onClick={() => setFilter('approved')}
//   //           >
//   //             Approved
//   //           </button>
//   //           <button
//   //             className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-amber-100 text-amber-700 font-medium' : 'bg-gray-100'}`}
//   //             onClick={() => setFilter('pending')}
//   //           >
//   //             Pending
//   //           </button>
//   //           <button
//   //             className={`px-4 py-2 rounded-lg ${filter === 'rejected' ? 'bg-red-100 text-red-700 font-medium' : 'bg-gray-100'}`}
//   //             onClick={() => setFilter('rejected')}
//   //           >
//   //             Rejected
//   //           </button>
//   //         </div>
          
//   //         <div className="flex w-full md:w-auto space-x-2 space-x-reverse">
//   //           <div className="relative flex-1 md:flex-none">
//   //             <input
//   //               type="text"
//   //               placeholder="Search for a place..."
//   //               className="w-full md:w-64 border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-[#053F5E] focus:border-[#053F5E]"
//   //             />
//   //             <Filter
//   //               size={18}
//   //               className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//   //             />
//   //           </div>
//   //         </div>
//   //       </div>

//   //       {/* Places list */}
//   //       {loading ? (
//   //         <div className="flex justify-center items-center h-64">
//   //           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#115173]"></div>
//   //         </div>
//   //       ) : (
//   //         <>
//   //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//   //             {places.length > 0 ? (
//   //               places.map((place) => (
//   //                 <PlaceCard
//   //                   key={place._id}
//   //                   place={place}
//   //                   onApprove={() => handleApprove(place._id)}
//   //                   onReject={() => handleReject(place._id)}
//   //                   onDelete={() => handleSoftDelete(place._id)}
//   //                   onEdit={() => handleEdit(place._id)}
//   //                 />
//   //               ))
//   //             ) : (
//   //               <div className="col-span-3 py-12 text-center">
//   //                 <div className="flex flex-col items-center justify-center text-gray-500">
//   //                   <MapPin className="h-12 w-12 mb-4 text-gray-300" />
//   //                   <p className="text-lg">No places match your search</p>
//   //                 </div>
//   //               </div>
//   //             )}
//   //           </div>

//   //           {/* Pagination */}
//   //           {places.length > 0 && (
//   //             <div className="mt-8 flex justify-center">
//   //               <div className="flex space-x-2 space-x-reverse">
//   //                 <button 
//   //                   className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
//   //                   onClick={() => changePage(pagination.page - 1)}
//   //                   disabled={pagination.page === 1}
//   //                 >
//   //                   <ChevronDown className="rotate-90" size={18} />
//   //                 </button>
                  
//   //                 {Array.from({ length: Math.min(3, pagination.totalPages) }, (_, i) => {
//   //                   let pageNum;
//   //                   if (pagination.totalPages <= 3) {
//   //                     pageNum = i + 1;
//   //                   } else if (pagination.page === 1) {
//   //                     pageNum = i + 1;
//   //                   } else if (pagination.page === pagination.totalPages) {
//   //                     pageNum = pagination.totalPages - 2 + i;
//   //                   } else {
//   //                     pageNum = pagination.page - 1 + i;
//   //                   }
                    
//   //                   return (
//   //                     <button
//   //                       key={pageNum}
//   //                       className={`w-10 h-10 flex items-center justify-center rounded-lg border ${pagination.page === pageNum ? 'bg-[#115173] text-white border-[#115173]' : 'bg-white border-gray-300 hover:bg-gray-50'}`}
//   //                       onClick={() => changePage(pageNum)}
//   //                     >
//   //                       {pageNum}
//   //                     </button>
//   //                   );
//   //                 })}
                  
//   //                 <button 
//   //                   className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
//   //                   onClick={() => changePage(pagination.page + 1)}
//   //                   disabled={pagination.page === pagination.totalPages}
//   //                 >
//   //                   <ChevronDown className="-rotate-90" size={18} />
//   //                 </button>
//   //               </div>
//   //             </div>
//   //           )}
//   //         </>
//   //       )}
//   //     </div>

//   //     {/* Statistics */}
//   //     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//   //       <div className="bg-white rounded-xl shadow-sm p-6">
//   //         <h2 className="text-lg font-bold mb-4 text-gray-800">Most Visited Places</h2>
//   //         <div className="space-y-4">
//   //           {stats.topPlaces.length > 0 ? (
//   //             stats.topPlaces.map((place, i) => (
//   //               <div key={i} className="flex items-center">
//   //                 <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
//   //                   {i + 1}
//   //                 </span>
//   //                 <span className="flex-1 mx-3">{place.name}</span>
//   //                 <span className="text-gray-500">
//   //                   {place.visits?.toLocaleString() || 0} visits
//   //                 </span>
//   //                 {place.trend && (
//   //                   <span className={`text-xs px-2 py-1 rounded-full ${place.trend.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//   //                     {place.trend}
//   //                   </span>
//   //                 )}
//   //               </div>
//   //             ))
//   //           ) : (
//   //             <div className="text-center py-4 text-gray-500">No data available</div>
//   //           )}
//   //         </div>
//   //       </div>
        
//   //       <div className="bg-white rounded-xl shadow-sm p-6">
//   //         <h2 className="text-lg font-bold mb-4 text-gray-800">Places by Category</h2>
//   //         <div className="space-y-4">
//   //           {stats.byCategory.length > 0 ? (
//   //             stats.byCategory.map((category, i) => (
//   //               <div key={i} className="flex items-center">
//   //                 <div className={`w-3 h-3 rounded-full ${getCategoryColor(category.category)}`}></div>
//   //                 <span className="flex-1 mr-3">{category.category}</span>
//   //                 <span className="text-gray-500">{category.count} places</span>
//   //               </div>
//   //             ))
//   //           ) : (
//   //             <div className="text-center py-4 text-gray-500">No data available</div>
//   //           )}
//   //         </div>
//   //       </div>
//   //     </div>
//   //   </div>
//   // );
//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4">قائمة الأماكن</h2>
  
//       {loading && <p>جاري التحميل...</p>}
//       {error && <p className="text-red-500">{error}</p>}
  
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {places.map((place) => (
//           <div key={place.id} className="bg-white rounded-2xl shadow p-4 flex flex-col gap-2">
//             <img
//               src={place.image || "https://via.placeholder.com/300"}
//               alt={place.name}
//               className="w-full h-48 object-cover rounded-lg"
//             />
//             <h3 className="text-xl font-semibold">{place.name}</h3>
//             <div className="flex items-center gap-1 text-gray-500 text-sm">
//               <MapPin size={16} />
//               <span>{place.city || "بدون مدينة"}</span>
//             </div>
//             <div className="flex items-center gap-1 text-yellow-500">
//               <Star size={16} />
//               <span>{place.rating || "لا يوجد تقييم"}</span>
//             </div>
//             <p className="text-gray-600 text-sm">{place.description || "لا يوجد وصف"}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
  
// }

// function PlaceCard({ place, onApprove, onReject, onDelete, onEdit }) {
//   return (
//     <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
//       <div className="relative h-48">
//         {place.images?.length > 0 ? (
//           <img 
//             src={place.images[0].path || place.images[0]} 
//             alt={place.name} 
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
//             <MapPin size={40} />
//           </div>
//         )}
        
//         <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium">
//           {place.category || 'Uncategorized'}
//         </div>
        
//         <div className={`absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium ${
//           place.status === 'approved' ? 'bg-green-100 text-green-800' :
//           place.status === 'rejected' ? 'bg-red-100 text-red-800' :
//           'bg-amber-100 text-amber-800'
//         }`}>
//           {place.status === 'approved' ? 'Approved' : 
//            place.status === 'rejected' ? 'Rejected' : 'Pending'}
//         </div>
//       </div>
      
//       <div className="p-4">
//         <h3 className="font-bold text-lg text-gray-800">{place.name}</h3>
//         <div className="flex items-center text-gray-500 text-sm mt-1">
//           <MapPin size={14} className="ml-1" />
//           {place.location?.city || 'Location not specified'}
//         </div>
        
//         <div className="mt-3 text-sm text-gray-600 line-clamp-2">
//           {place.description}
//         </div>
        
//         <div className="flex justify-between items-center mt-4">
//           <div className="flex items-center text-sm">
//             <span className="text-gray-500">Created by:</span>
//             <span className="font-medium mr-1">{place.createdBy?.username || 'Admin'}</span>
//           </div>
          
//           <div className="flex items-center text-gray-500 text-sm">
//             <Calendar size={14} className="ml-1" />
//             {new Date(place.createdAt).toLocaleDateString()}
//           </div>
//         </div>
        
//         <div className="mt-4 flex space-x-2 space-x-reverse">
//           <button
//             onClick={onEdit}
//             className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
//           >
//             <Edit size={16} />
//             <span>Edit</span>
//           </button>
          
//           {place.status !== 'approved' ? (
//             <button
//               onClick={onApprove}
//               className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
//             >
//               <CheckCircle2 size={16} />
//               <span>Approve</span>
//             </button>
//           ) : (
//             <button
//               onClick={onReject}
//               className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
//             >
//               <XCircle size={16} />
//               <span>Reject</span>
//             </button>
//           )}
          
//           <button
//             onClick={onDelete}
//             className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
//           >
//             <Trash2 size={16} />
//             <span>Delete</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Helper function to get category color
// function getCategoryColor(category) {
//   const colors = {
//     'Tourist Attractions': 'bg-blue-500',
//     'Museums': 'bg-purple-500',
//     'Parks': 'bg-green-500',
//     'Beaches': 'bg-amber-500',
//     'Mountains': 'bg-red-500',
//     'Entertainment': 'bg-pink-500'
//   };
//   return colors[category] || 'bg-gray-500';
// }




// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const PlacesList = () => {
//   const [places, setPlaces] = useState([]);  // تعيين قيمة أولية فارغة للمصفوفة
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchPlaces = async () => {
//       try {
//         const response = await axios.get("http://localhost:9527/api/places/");
//         console.log(response.data); // تحقق من بنية البيانات هنا
//         if (Array.isArray(response.data)) {  // إذا كانت البيانات في response.data مباشرة
//           setPlaces(response.data);
//         }
//         else {
//           setError("البيانات غير صحيحة.");
//         }
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching places:", error);
//         setError("حدث خطأ أثناء جلب الأماكن.");
//         setLoading(false);
//       }
//     };
    
    

//     fetchPlaces();
//   }, []); // يتم استدعاء fetchPlaces فقط عند تحميل المكون لأول مرة

//   // إذا كان هناك خطأ، عرض رسالة الخطأ
//   if (error) {
//     return <div>{error}</div>;
//   }

//   // إذا كانت الصفحة لا تزال في حالة تحميل، عرض مؤشر التحميل
//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h1>أماكن</h1>
//       <ul>
//         {places.length > 0 ? (
//           places.map((place) => (
//             <li key={place._id}>
//               <h2>{place.name}</h2>
//               <p>{place.description}</p>
//               <img src={place.images[0]?.path} alt={place.name} />
//             </li>
//           ))
//         ) : (
//           <p>لا توجد أماكن لعرضها.</p> // عرض رسالة عند عدم وجود أماكن
//         )}
//       </ul>
//     </div>
//   );
// };

// export default PlacesList;

// import React, { useState, useEffect } from 'react';
// import { 
//   MapPin, 
//   Star, 
//   Calendar, 
//   ChevronDown, 
//   Filter, 
//   Plus, 
//   CheckCircle2, 
//   XCircle, 
//   Clock,
//   Trash2,
//   Edit
// } from 'lucide-react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';

// export default function Places() {
//   const [filter, setFilter] = useState('all');
//   const [loading, setLoading] = useState(true);
//   const [places, setPlaces] = useState([]);
//   const [error, setError] = useState(null);  // تعريف setError

//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 6,
//     total: 0,
//     totalPages: 1
//   });
//   const [stats, setStats] = useState({
//     topPlaces: [],
//     byCategory: []
//   });;
//   const navigate = useNavigate()

//   // Fetch data from server
//   useEffect(() => {
//     const fetchPlaces = async () => {
//       try {
//         const response = await axios.get("http://localhost:9527/api/places/");
//         console.log(response.data); // تحقق من بنية البيانات هنا
//         if (Array.isArray(response.data.data.docs)) {
//           setPlaces(response.data.data.docs);
//         } else {
//           setError("البيانات غير صحيحة.");
//         }
        
        
//         console.log("بيانات السيرفر:", response.data);

//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching places:", error);
//         setError("حدث خطأ أثناء جلب الأماكن.");
//         setLoading(false);
//       }
//     };
    
    
    

//     fetchPlaces();
//   }, []); // يتم استدعاء fetchPlaces فقط عند تحميل المكون لأول مرة





//   // Handle approval
//   const handleApprove = async (id) => {
//     try {
//       const response = await axios.patch(
//         `http://localhost:9527/api/places/${id}/status`, 
//         { status: 'approved' }, 
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         }
//       );
//       console.log(response.data); // تحقق من بنية البيانات هنا

//       // Update UI
//       setPlaces(places.map(p => 
//         p._id === id ? { ...p, status: 'approved' } : p
//       ));
  
//       toast.success('Place approved successfully');
//     } catch (error) {
//       toast.error('Failed to approve place');
//       console.error('Error:', error);
//     }
//   };

//   // Handle rejection
//   const handleReject = async (id) => {
//     try {
//       await axios.patch(
//         `http://localhost:9527/api/places/${id}/status`, 
//         { status: 'rejected' }, 
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         }
//       );

//       // Update UI
//       setPlaces(places.map(p => 
//         p._id === id ? { ...p, status: 'rejected' } : p
//       ));
//       toast.success('Place rejected successfully');
//     } catch (error) {
//       toast.error('Failed to reject place');
//       console.error('Error:', error);
//     }
//   };

//  // Handle soft delete
//  const handleSoftDelete = async (id) => {
//   if (!window.confirm('Are you sure you want to delete this place?')) return;
  
//   try {
//     const response = await axios.delete(`http://localhost:9527/api/places/${id}`, {
//       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//     });
    
//     if (response.data.success) {
//       setPlaces(places.filter(p => p._id !== id));
//       toast.success('Place deleted successfully');
//     } else {
//       toast.error(response.data.message || 'Failed to delete place');
//     }
//   } catch (error) {
//     toast.error(error.response?.data?.message || 'Failed to delete place');
//     console.error('Error:', error);
//   }
// };

  
//   // Handle edit
//   const handleEdit = (id) => {
//     navigate(`/admin/places/edit/${id}`);
//   };

//   // Change page
//   const changePage = (newPage) => {
//     if (newPage >= 1 && newPage <= pagination.totalPages) {
//       setPagination({ ...pagination, page: newPage });
//     } else {
//       toast.info('This is the last page');
//     }
//   };

//   // return (
//   //   <div className="space-y-6 p-6 bg-gray-50">
//   //     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//   //       <div>
//   //         <h1 className="text-2xl font-bold text-gray-800">Places Management</h1>
//   //         <p className="text-gray-500">Manage all places in the system</p>
//   //       </div>
//   //       <button 
//   //         className="bg-[#115173] hover:bg-[#053F5E] text-white px-4 py-2 rounded-lg flex items-center transition-colors"
//   //         onClick={() => navigate('/admin/places/add')}
//   //       >
//   //         <Plus size={18} className="ml-2" />
//   //         Add New Place
//   //       </button>
//   //     </div>

//   //     {/* Filters and search */}
//   //     <div className="bg-white rounded-xl shadow-sm p-6">
//   //       <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
//   //         <div className="flex space-x-2 space-x-reverse">
//   //           <button
//   //             className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-gray-100'}`}
//   //             onClick={() => setFilter('all')}
//   //           >
//   //             All
//   //           </button>
//   //           <button
//   //             className={`px-4 py-2 rounded-lg ${filter === 'approved' ? 'bg-green-100 text-green-700 font-medium' : 'bg-gray-100'}`}
//   //             onClick={() => setFilter('approved')}
//   //           >
//   //             Approved
//   //           </button>
//   //           <button
//   //             className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-amber-100 text-amber-700 font-medium' : 'bg-gray-100'}`}
//   //             onClick={() => setFilter('pending')}
//   //           >
//   //             Pending
//   //           </button>
//   //           <button
//   //             className={`px-4 py-2 rounded-lg ${filter === 'rejected' ? 'bg-red-100 text-red-700 font-medium' : 'bg-gray-100'}`}
//   //             onClick={() => setFilter('rejected')}
//   //           >
//   //             Rejected
//   //           </button>
//   //         </div>
          
//   //         <div className="flex w-full md:w-auto space-x-2 space-x-reverse">
//   //           <div className="relative flex-1 md:flex-none">
//   //             <input
//   //               type="text"
//   //               placeholder="Search for a place..."
//   //               className="w-full md:w-64 border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-[#053F5E] focus:border-[#053F5E]"
//   //             />
//   //             <Filter
//   //               size={18}
//   //               className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//   //             />
//   //           </div>
//   //         </div>
//   //       </div>

//   //       {/* Places list */}
//   //       {loading ? (
//   //         <div className="flex justify-center items-center h-64">
//   //           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#115173]"></div>
//   //         </div>
//   //       ) : (
//   //         <>
//   //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//   //             {places.length > 0 ? (
//   //               places.map((place) => (
//   //                 <PlaceCard
//   //                   key={place._id}
//   //                   place={place}
//   //                   onApprove={() => handleApprove(place._id)}
//   //                   onReject={() => handleReject(place._id)}
//   //                   onDelete={() => handleSoftDelete(place._id)}
//   //                   onEdit={() => handleEdit(place._id)}
//   //                 />
//   //               ))
//   //             ) : (
//   //               <div className="col-span-3 py-12 text-center">
//   //                 <div className="flex flex-col items-center justify-center text-gray-500">
//   //                   <MapPin className="h-12 w-12 mb-4 text-gray-300" />
//   //                   <p className="text-lg">No places match your search</p>
//   //                 </div>
//   //               </div>
//   //             )}
//   //           </div>

//   //           {/* Pagination */}
//   //           {places.length > 0 && (
//   //             <div className="mt-8 flex justify-center">
//   //               <div className="flex space-x-2 space-x-reverse">
//   //                 <button 
//   //                   className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
//   //                   onClick={() => changePage(pagination.page - 1)}
//   //                   disabled={pagination.page === 1}
//   //                 >
//   //                   <ChevronDown className="rotate-90" size={18} />
//   //                 </button>
                  
//   //                 {Array.from({ length: Math.min(3, pagination.totalPages) }, (_, i) => {
//   //                   let pageNum;
//   //                   if (pagination.totalPages <= 3) {
//   //                     pageNum = i + 1;
//   //                   } else if (pagination.page === 1) {
//   //                     pageNum = i + 1;
//   //                   } else if (pagination.page === pagination.totalPages) {
//   //                     pageNum = pagination.totalPages - 2 + i;
//   //                   } else {
//   //                     pageNum = pagination.page - 1 + i;
//   //                   }
                    
//   //                   return (
//   //                     <button
//   //                       key={pageNum}
//   //                       className={`w-10 h-10 flex items-center justify-center rounded-lg border ${pagination.page === pageNum ? 'bg-[#115173] text-white border-[#115173]' : 'bg-white border-gray-300 hover:bg-gray-50'}`}
//   //                       onClick={() => changePage(pageNum)}
//   //                     >
//   //                       {pageNum}
//   //                     </button>
//   //                   );
//   //                 })}
                  
//   //                 <button 
//   //                   className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
//   //                   onClick={() => changePage(pagination.page + 1)}
//   //                   disabled={pagination.page === pagination.totalPages}
//   //                 >
//   //                   <ChevronDown className="-rotate-90" size={18} />
//   //                 </button>
//   //               </div>
//   //             </div>
//   //           )}
//   //         </>
//   //       )}
//   //     </div>

//   //     {/* Statistics */}
//   //     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//   //       <div className="bg-white rounded-xl shadow-sm p-6">
//   //         <h2 className="text-lg font-bold mb-4 text-gray-800">Most Visited Places</h2>
//   //         <div className="space-y-4">
//   //           {stats.topPlaces.length > 0 ? (
//   //             stats.topPlaces.map((place, i) => (
//   //               <div key={i} className="flex items-center">
//   //                 <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
//   //                   {i + 1}
//   //                 </span>
//   //                 <span className="flex-1 mx-3">{place.name}</span>
//   //                 <span className="text-gray-500">
//   //                   {place.visits?.toLocaleString() || 0} visits
//   //                 </span>
//   //                 {place.trend && (
//   //                   <span className={`text-xs px-2 py-1 rounded-full ${place.trend.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//   //                     {place.trend}
//   //                   </span>
//   //                 )}
//   //               </div>
//   //             ))
//   //           ) : (
//   //             <div className="text-center py-4 text-gray-500">No data available</div>
//   //           )}
//   //         </div>
//   //       </div>
        
//   //       <div className="bg-white rounded-xl shadow-sm p-6">
//   //         <h2 className="text-lg font-bold mb-4 text-gray-800">Places by Category</h2>
//   //         <div className="space-y-4">
//   //           {stats.byCategory.length > 0 ? (
//   //             stats.byCategory.map((category, i) => (
//   //               <div key={i} className="flex items-center">
//   //                 <div className={`w-3 h-3 rounded-full ${getCategoryColor(category.category)}`}></div>
//   //                 <span className="flex-1 mr-3">{category.category}</span>
//   //                 <span className="text-gray-500">{category.count} places</span>
//   //               </div>
//   //             ))
//   //           ) : (
//   //             <div className="text-center py-4 text-gray-500">No data available</div>
//   //           )}
//   //         </div>
//   //       </div>
//   //     </div>
//   //   </div>
//   // );
//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4">قائمة الأماكن</h2>
  
//       {loading && <p>جاري التحميل...</p>}
//       {error && <p className="text-red-500">{error}</p>}
  
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {places.map((place) => (
//           <div key={place.id} className="bg-white rounded-2xl shadow p-4 flex flex-col gap-2">
//             <img
//               src={place.image || "https://via.placeholder.com/300"}
//               alt={place.name}
//               className="w-full h-48 object-cover rounded-lg"
//             />
//             <h3 className="text-xl font-semibold">{place.name}</h3>
//             <div className="flex items-center gap-1 text-gray-500 text-sm">
//               <MapPin size={16} />
//               <span>{place.city || "بدون مدينة"}</span>
//             </div>
//             <div className="flex items-center gap-1 text-yellow-500">
//               <Star size={16} />
//               <span>{place.rating || "لا يوجد تقييم"}</span>
//             </div>
//             <p className="text-gray-600 text-sm">{place.description || "لا يوجد وصف"}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
  
// }

// function PlaceCard({ place, onApprove, onReject, onDelete, onEdit }) {
//   return (
//     <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
//       <div className="relative h-48">
//         {place.images?.length > 0 ? (
//           <img 
//             src={place.images[0].path || place.images[0]} 
//             alt={place.name} 
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
//             <MapPin size={40} />
//           </div>
//         )}
        
//         <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium">
//           {place.category || 'Uncategorized'}
//         </div>
        
//         <div className={`absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium ${
//           place.status === 'approved' ? 'bg-green-100 text-green-800' :
//           place.status === 'rejected' ? 'bg-red-100 text-red-800' :
//           'bg-amber-100 text-amber-800'
//         }`}>
//           {place.status === 'approved' ? 'Approved' : 
//            place.status === 'rejected' ? 'Rejected' : 'Pending'}
//         </div>
//       </div>
      
//       <div className="p-4">
//         <h3 className="font-bold text-lg text-gray-800">{place.name}</h3>
//         <div className="flex items-center text-gray-500 text-sm mt-1">
//           <MapPin size={14} className="ml-1" />
//           {place.location?.city || 'Location not specified'}
//         </div>
        
//         <div className="mt-3 text-sm text-gray-600 line-clamp-2">
//           {place.description}
//         </div>
        
//         <div className="flex justify-between items-center mt-4">
//           <div className="flex items-center text-sm">
//             <span className="text-gray-500">Created by:</span>
//             <span className="font-medium mr-1">{place.createdBy?.username || 'Admin'}</span>
//           </div>
          
//           <div className="flex items-center text-gray-500 text-sm">
//             <Calendar size={14} className="ml-1" />
//             {new Date(place.createdAt).toLocaleDateString()}
//           </div>
//         </div>
        
//         <div className="mt-4 flex space-x-2 space-x-reverse">
//           <button
//             onClick={onEdit}
//             className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
//           >
//             <Edit size={16} />
//             <span>Edit</span>
//           </button>
          
//           {place.status !== 'approved' ? (
//             <button
//               onClick={onApprove}
//               className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
//             >
//               <CheckCircle2 size={16} />
//               <span>Approve</span>
//             </button>
//           ) : (
//             <button
//               onClick={onReject}
//               className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
//             >
//               <XCircle size={16} />
//               <span>Reject</span>
//             </button>
//           )}
          
//           <button
//             onClick={onDelete}
//             className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
//           >
//             <Trash2 size={16} />
//             <span>Delete</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Helper function to get category color
// function getCategoryColor(category) {
//   const colors = {
//     'Tourist Attractions': 'bg-blue-500',
//     'Museums': 'bg-purple-500',
//     'Parks': 'bg-green-500',
//     'Beaches': 'bg-amber-500',
//     'Mountains': 'bg-red-500',
//     'Entertainment': 'bg-pink-500'
//   };
//   return colors[category] || 'bg-gray-500';
// }




// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const PlacesList = () => {
//   const [places, setPlaces] = useState([]);  // تعيين قيمة أولية فارغة للمصفوفة
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchPlaces = async () => {
//       try {
//         const response = await axios.get("http://localhost:9527/api/places/");
//         console.log(response.data); // تحقق من بنية البيانات هنا
//         if (Array.isArray(response.data)) {  // إذا كانت البيانات في response.data مباشرة
//           setPlaces(response.data);
//         }
//         else {
//           setError("البيانات غير صحيحة.");
//         }
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching places:", error);
//         setError("حدث خطأ أثناء جلب الأماكن.");
//         setLoading(false);
//       }
//     };
    
    

//     fetchPlaces();
//   }, []); // يتم استدعاء fetchPlaces فقط عند تحميل المكون لأول مرة

//   // إذا كان هناك خطأ، عرض رسالة الخطأ
//   if (error) {
//     return <div>{error}</div>;
//   }

//   // إذا كانت الصفحة لا تزال في حالة تحميل، عرض مؤشر التحميل
//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h1>أماكن</h1>
//       <ul>
//         {places.length > 0 ? (
//           places.map((place) => (
//             <li key={place._id}>
//               <h2>{place.name}</h2>
//               <p>{place.description}</p>
//               <img src={place.images[0]?.path} alt={place.name} />
//             </li>
//           ))
//         ) : (
//           <p>لا توجد أماكن لعرضها.</p> // عرض رسالة عند عدم وجود أماكن
//         )}
//       </ul>
//     </div>
//   );
// };

// export default PlacesList;





///////////////////////////////////////////
// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import {
//   Edit2,
//   Trash2,
//   RefreshCw,
//   CheckCircle,
//   XCircle,
//   Clock,
// } from "lucide-react";

// const Place = () => {
//   const [places, setplaces] = useState([]);
//   const [providers, setProviders] = useState([]);
//   const [selectedProvider, setSelectedProvider] = useState(null);
//   const [editingPlace, setEditingPlace] = useState(null);
//   const [showDeleted, setShowDeleted] = useState(false);
//   const [newPlace, setNewPlace] = useState({
//     name: "",
//     description: "",
//     price: "",
//     category: "carpet",
//     size: "",
//     color: "",
//     material: "",
//     stock: "",
//     provider: "",
//     images: null,
//     style: "",
//     pattern: "",
//     roomType: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [fileInputKey, setFileInputKey] = useState(Date.now()); // Key for resetting file input
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     const fetchplaces = async () => {
//       setIsLoading(true);
//       try {
//         const params = new URLSearchParams();
//         if (selectedProvider) params.append("provider", selectedProvider);
//         if (showDeleted) params.append("showDeleted", "true");

//         const response = await axios.get(
//           `http://localhost:9527/api/admin/places?${params.toString()}`,
//           { withCredentials: true }
//         );
//         setplaces(response.data);
//       } catch (error) {
//         console.error("Error fetching places:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchplaces();
//   }, [selectedProvider, showDeleted]);

//   useEffect(() => {
//     const fetchProviders = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:5000/api/admin/providers",
//           { withCredentials: true }
//         );
//         setProviders(response.data);
//       } catch (error) {
//         console.error("Error fetching providers:", error);
//       }
//     };

//     fetchProviders();
//   }, []);

//   const handleProviderSelect = (providerId) => {
//     setSelectedProvider(providerId === selectedProvider ? null : providerId);
//   };

//   const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files);
//     setNewPlace({ ...newPlace, images: files });
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewPlace({ ...newPlace, [name]: value });
//   };

//   const handleStatusChange = async (placeId, newStatus) => {
//     try {
//       await axios.put(
//         `http://localhost:9527/api/admin/place/${placeId}/status`,
//         { status: newStatus },
//         { withCredentials: true }
//       );

//       setplace(
//         place.map((place) =>
//           place._id === placeId
//             ? { ...place, status: newStatus }
//             : place
//         )
//       );
//     } catch (error) {
//       console.error("Error changing Place status:", error);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     Object.entries(newPlace).forEach(([key, value]) => {
//       if (key === "images") {
//         value.forEach((file) => formData.append("images", file));
//       } else {
//         formData.append(key, value);
//       }
//     });

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/admin/places",
//         formData,
//         {
//           withCredentials: true,
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       setNewPlace({
//         name: "",
//         description: "",
//         price: "",
//         category: "carpet",
//         size: "",
//         color: "",
//         material: "",
//         stock: "",
//         provider: "",
//         images: null,
//         style: "",
//         pattern: "",
//         roomType: "",
//       });
//       if (fileInputRef.current) {
//         fileInputRef.current.value = ""; // Clear file input
//       }
//     } catch (error) {
//       console.error("Error adding place:", error);
//     }
//   };

//   const handleSoftDelete = async (placeId) => {
//     try {
//       await axios.put(
//         `http://localhost:5000/api/admin/places/${placesId}/soft-delete`,
//         {},
//         { withCredentials: true }
//       );
//       setplaces(places.filter((place) => place._id !== place));
//     } catch (error) {
//       console.error("Error soft deleting place:", error);
//     }
//   };

//   const handleEdit = (place) => {
//     setEditingPlace(place);
//     setNewPlace({
//       name: Place.name,
//       description: Place.description,
//       price: Place.price,
//       category: Place.category,
//       size: Place.size,
//       color: Place.color,
//       material: Place.material,
//       stock: Place.stock,
//       provider: Place.provider._id,
//       images: Place.images,
//       style: Place?.style,
//       pattern: Place?.pattern,
//       roomType: Place?.roomType,
//     });
//     setFileInputKey(Date.now()); // Reset file input when editing
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       Object.entries(newPlace).forEach(([key, value]) => {
//         if (key === "images" && value) {
//           if (Array.isArray(value)) {
//             value.forEach((file) => formData.append("images", file));
//           } else {
//             formData.append("images", value);
//           }
//         } else if (value !== null && value !== undefined) {
//           formData.append(key, value);
//         }
//       });

//       const response = await axios.put(
//         `http://localhost:9527/api/admin/places/${editingPlace._id}`,
//         formData,
//         {
//           withCredentials: true,
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       setPlace(
//         places.map((p) => (p._id === editingPlace._id ? response.data : p))
//       );
//       setEditingPlace(null);
//       setNewPlace({
//         name: "",
//         description: "",
//         price: "",
//         category: "carpet",
//         size: "",
//         color: "",
//         material: "",
//         stock: "",
//         provider: "",
//         images: null,
//         style: "",
//         pattern: "",
//         roomType: "",
//       });
//       setFileInputKey(Date.now());
//     } catch (error) {
//       console.error("Error updating Place:", error);
//       // يمكنك إضافة عرض رسالة خطأ للمستخدم هنا
//     }
//   };
//   return (
//     <div className="bg-[#D8D2C2] min-h-screen p-8 mt-25">
//       <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
//         {/* Header */}
//         <div className="bg-[#4A4947] text-[#D8D2C2] p-6">
//           <h1 className="text-3xl font-bold tracking-wide">
//           Place Management
//           </h1>
//         </div>

//         {/* Providers Section */}
//         <div className="p-6">
//           <h2 className="text-2xl font-semibold mb-4 text-[#4A4947]">
//             Providers
//           </h2>
//           <div className="flex flex-wrap gap-3">
//             <button
//               onClick={() => handleProviderSelect(null)}
//               className={`px-4 py-2 rounded-full transition-all duration-300 ${
//                 !selectedProvider
//                   ? "bg-[#4A4947] text-[#D8D2C2]"
//                   : "bg-[#D8D2C2] text-[#4A4947] hover:bg-[#4A4947]/10"
//               }`}
//             >
//               All Providers
//             </button>
//             {providers.map((provider) => (
//               <button
//                 key={provider._id}
//                 onClick={() => handleProviderSelect(provider._id.toString())}
//                 className={`px-4 py-2 rounded-full transition-all duration-300 ${
//                   selectedProvider === provider._id.toString()
//                     ? "bg-[#4A4947] text-[#D8D2C2]"
//                     : "bg-[#D8D2C2] text-[#4A4947] hover:bg-[#4A4947]/10"
//                 }`}
//               >
//                 {provider.name}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Place Form */}
//         <form
//           onSubmit={editingPlace ? handleUpdate : handleSubmit}
//           className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-[#D8D2C2]/20"
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* حقل الاسم */}
//             <div className="flex flex-col">
//               <label
//                 htmlFor="name"
//                 className="mb-2 text-sm font-medium text-[#4A4947]"
//               >
//                 Name
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={newPlace.name}
//                 onChange={handleInputChange}
//                 className="p-2 border border-[#4A4947]/20 rounded-lg focus:ring-2 focus:ring-[#4A4947]/30 transition-all"
//                 required
//               />
//             </div>
//             {/* حقل الوصف */}
//             <div className="flex flex-col">
//               <label
//                 htmlFor="description"
//                 className="mb-2 text-sm font-medium text-[#4A4947]"
//               >
//                 Description
//               </label>
//               <input
//                 type="text"
//                 id="description"
//                 name="description"
//                 value={newPlace.description}
//                 onChange={handleInputChange}
//                 className="p-2 border border-[#4A4947]/20 rounded-lg focus:ring-2 focus:ring-[#4A4947]/30 transition-all"
//                 required
//               />
//             </div>
//             {/* حقل السعر */}
//             <div className="flex flex-col">
//               <label
//                 htmlFor="price"
//                 className="mb-2 text-sm font-medium text-[#4A4947]"
//               >
//                 Price
//               </label>
//               <input
//                 type="number"
//                 id="price"
//                 name="price"
//                 value={newPlace.price}
//                 onChange={handleInputChange}
//                 className="p-2 border border-[#4A4947]/20 rounded-lg focus:ring-2 focus:ring-[#4A4947]/30 transition-all"
//                 required
//               />
//             </div>
//             {/* حقل الفئة */}
//             <div className="flex flex-col">
//               <label
//                 htmlFor="category"
//                 className="mb-2 text-sm font-medium text-[#4A4947]"
//               >
//                 Category
//               </label>
//               <select
//                 id="category"
//                 name="category"
//                 value={newPlace.category}
//                 onChange={handleInputChange}
//                 className="p-2 border border-[#4A4947]/20 rounded-lg focus:ring-2 focus:ring-[#4A4947]/30 transition-all"
//                 required
//               >
//                 <option value="carpet">Carpet</option>
//                 <option value="accessory">Accessory</option>
//               </select>
//             </div>
//             {/* Enhanced Style Selector */}
//             <div className="flex flex-col">
//               <label
//                 htmlFor="style"
//                 className="mb-2 text-sm font-medium text-[#4A4947]"
//               >
//                 Design Style
//               </label>
//               <div className="relative">
//                 <select
//                   id="style"
//                   name="style"
//                   value={newPlacet.style}
//                   onChange={handleInputChange}
//                   className="block w-full p-3 pr-8 text-sm text-[#4A4947] bg-white border border-[#D8D2C2] rounded-lg shadow-sm focus:ring-2 focus:ring-[#4A4947]/50 focus:border-[#4A4947]/50 appearance-none"
//                 >
//                   <option value="">Select a design style</option>
//                   <option value="traditional">Traditional</option>
//                   <option value="modern">Modern</option>
//                   <option value="bohemian">Bohemian</option>
//                   <option value="transitional">Transitional</option>
//                   <option value="vintage">Vintage</option>
//                   <option value="contemporary">Contemporary</option>
//                   <option value="minimalist">Minimalist</option>
//                   <option value="coastal">Coastal</option>
//                 </select>
//                 <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                   <svg
//                     className="w-5 h-5 text-[#4A4947]/50"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M19 9l-7 7-7-7"
//                     ></path>
//                   </svg>
//                 </div>
//               </div>
//             </div>

//             {/* Enhanced Pattern Selector */}
//             <div className="flex flex-col">
//               <label
//                 htmlFor="pattern"
//                 className="mb-2 text-sm font-medium text-[#4A4947]"
//               >
//                 Pattern
//               </label>
//               <div className="relative">
//                 <select
//                   id="pattern"
//                   name="pattern"
//                   value={newPlace.pattern}
//                   onChange={handleInputChange}
//                   className="block w-full p-3 pr-8 text-sm text-[#4A4947] bg-white border border-[#D8D2C2] rounded-lg shadow-sm focus:ring-2 focus:ring-[#4A4947]/50 focus:border-[#4A4947]/50 appearance-none"
//                 >
//                   <option value="">Select a pattern</option>
//                   <option value="solid">Solid</option>
//                   <option value="geometric">Geometric</option>
//                   <option value="floral">Floral</option>
//                   <option value="abstract">Abstract</option>
//                   <option value="striped">Striped</option>
//                   <option value="oriental">Oriental</option>
//                 </select>
//                 <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                   <svg
//                     className="w-5 h-5 text-[#4A4947]/50"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M19 9l-7 7-7-7"
//                     ></path>
//                   </svg>
//                 </div>
//               </div>
//             </div>

//             {/* Enhanced Room Type Selector */}
//             <div className="flex flex-col">
//               <label
//                 htmlFor="roomType"
//                 className="mb-2 text-sm font-medium text-[#4A4947]"
//               >
//                 Recommended Room
//               </label>
//               <div className="relative">
//                 <select
//                   id="roomType"
//                   name="roomType"
//                   value={newPlace.roomType}
//                   onChange={handleInputChange}
//                   className="block w-full p-3 pr-8 text-sm text-[#4A4947] bg-white border border-[#D8D2C2] rounded-lg shadow-sm focus:ring-2 focus:ring-[#4A4947]/50 focus:border-[#4A4947]/50 appearance-none"
//                 >
//                   <option value="">Select recommended room</option>
//                   <option value="living-room">Living Room</option>
//                   <option value="bedroom">Bedroom</option>
//                   <option value="dining-room">Dining Room</option>
//                   <option value="office">Office</option>
//                   <option value="hallway">Hallway</option>
//                   <option value="outdoor">Outdoor</option>
//                 </select>
//                 <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                   <svg
//                     className="w-5 h-5 text-[#4A4947]/50"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M19 9l-7 7-7-7"
//                     ></path>
//                   </svg>
//                 </div>
//               </div>
//             </div>
//             {/* حقل الحجم */}
//             <div className="flex flex-col">
//               <label
//                 htmlFor="size"
//                 className="mb-2 text-sm font-medium text-[#4A4947]"
//               >
//                 Size
//               </label>
//               <input
//                 type="text"
//                 id="size"
//                 name="size"
//                 value={newPlace.size}
//                 onChange={handleInputChange}
//                 className="p-2 border border-[#4A4947]/20 rounded-lg focus:ring-2 focus:ring-[#4A4947]/30 transition-all"
//                 required
//               />
//             </div>
//             {/* حقل اللون */}

//             {/*In your form section, replace the single color input with:*/}
//             <div className="flex flex-col">
//               <label className="mb-2 text-sm font-medium text-[#4A4947]">
//                 Colors
//               </label>
//               <div className="flex flex-wrap gap-2">
//                 {newPlace.colors?.map((color, index) => (
//                   <div key={index} className="flex items-center gap-1">
//                     <input
//                       type="color"
//                       value={color}
//                       onChange={(e) => {
//                         const updatedColors = [...newPlace.colors];
//                         updatedColors[index] = e.target.value;
//                         setNewPlace({ ...newPlace, colors: updatedColors });
//                       }}
//                       className="h-8 w-8 cursor-pointer"
//                     />
//                     <input
//                       type="text"
//                       value={color}
//                       onChange={(e) => {
//                         const updatedColors = [...newPlace.colors];
//                         updatedColors[index] = e.target.value;
//                         setNewPlace({ ...newPlace, colors: updatedColors });
//                       }}
//                       className="p-1 border border-[#4A4947]/20 rounded-lg w-24"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => {
//                         const updatedColors = newPlace.colors.filter(
//                           (_, i) => i !== index
//                         );
//                         setNewPlace({ ...newPlace, colors: updatedColors });
//                       }}
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       ×
//                     </button>
//                   </div>
//                 ))}
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setNewPlace({
//                       ...newPlace,
//                       colors: [...(newPlace.colors || []), "#000000"],
//                     });
//                   }}
//                   className="p-1 text-[#4A4947] hover:bg-[#D8D2C2]/20 rounded"
//                 >
//                   + Add Color
//                 </button>
//               </div>
//             </div>
//             {/* حقل المادة */}
//             <div className="flex flex-col">
//               <label
//                 htmlFor="material"
//                 className="mb-2 text-sm font-medium text-[#4A4947]"
//               >
//                 Material
//               </label>
//               <input
//                 type="text"
//                 id="material"
//                 name="material"
//                 value={newPlace.material}
//                 onChange={handleInputChange}
//                 className="p-2 border border-[#4A4947]/20 rounded-lg focus:ring-2 focus:ring-[#4A4947]/30 transition-all"
//                 required
//               />
//             </div>
//             {/* حقل المخزون */}
//             <div className="flex flex-col">
//               <label
//                 htmlFor="stock"
//                 className="mb-2 text-sm font-medium text-[#4A4947]"
//               >
//                 Stock
//               </label>
//               <input
//                 type="number"
//                 id="stock"
//                 name="stock"
//                 value={newPlace.stock}
//                 onChange={handleInputChange}
//                 className="p-2 border border-[#4A4947]/20 rounded-lg focus:ring-2 focus:ring-[#4A4947]/30 transition-all"
//                 required
//               />
//             </div>
//             {/* حقل المورد */}
//             <div className="flex flex-col">
//               <label
//                 htmlFor="provider"
//                 className="mb-2 text-sm font-medium text-[#4A4947]"
//               >
//                 Provider
//               </label>
//               <select
//                 id="provider"
//                 name="provider"
//                 value={newPlace.provider}
//                 onChange={handleInputChange}
//                 className="p-2 border border-[#4A4947]/20 rounded-lg focus:ring-2 focus:ring-[#4A4947]/30 transition-all"
//                 required
//               >
//                 <option value="">Select a provider</option>
//                 {providers.map((provider) => (
//                   <option key={provider._id} value={provider._id}>
//                     {provider.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             {/* حقل الصور */}
//             <div className="flex flex-col">
//               <label
//                 htmlFor="images"
//                 className="mb-2 text-sm font-medium text-[#4A4947]"
//               >
//                 Images
//               </label>
//               <input
//                 key={fileInputKey} // استخدم key لإعادة تعيين حقل الإدخال
//                 type="file"
//                 id="images"
//                 name="images"
//                 onChange={handleImageUpload}
//                 className="p-2 border border-[#4A4947]/20 rounded-lg focus:ring-2 focus:ring-[#4A4947]/30 transition-all"
//                 multiple
//                 ref={fileInputRef}
//               />
//             </div>
//           </div>
//           {/* Form Buttons */}
//           <div className="col-span-full flex space-x-4 mt-6">
//             <button
//               type="submit"
//               className="flex items-center px-6 py-2 bg-[#4A4947] text-[#D8D2C2] rounded-full hover:bg-[#4A4947]/90 transition-all"
//             >
//               {editingPlace ? "Update places" : "Add places"}
//             </button>
//             {editingPlace && (
//               <button
//                 type="button"
//                 onClick={() => {
//                   setEditingplaces(null);
//                   setNewplaces({
//                     name: "",
//                     description: "",
//                     price: "",
//                     category: "carpet",
//                     size: "",
//                     color: "",
//                     material: "",
//                     stock: "",
//                     provider: "",
//                     images: null,
//                   });
//                   if (fileInputRef.current) {
//                     fileInputRef.current.value = ""; // Reset file input
//                   }
//                 }}
//                 className="flex items-center px-6 py-2 bg-[#D8D2C2] text-[#4A4947] rounded-full hover:bg-[#D8D2C2]/90 transition-all"
//               >
//                 Cancel
//               </button>
//             )}
//           </div>
//         </form>

//         {/* places Table */}
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-4">
//             <label className="inline-flex items-center">
//               <input
//                 type="checkbox"
//                 checked={showDeleted}
//                 onChange={() => setShowDeleted(!showDeleted)}
//                 className="form-checkbox text-[#4A4947] rounded"
//               />
//               <span className="ml-2 text-[#4A4947]">Show Deleted places</span>
//             </label>
//           </div>

//           {isLoading ? (
//             <div className="flex justify-center items-center py-8">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4A4947]"></div>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white">
//                 <thead className="bg-[#D8D2C2]/30">
//                   <tr>
//                     {[
//                       "Name",
//                       "Price",
//                       "Category",
//                       "Stock",
//                       "Status",
//                       "Actions",
//                     ].map((header) => (
//                       <th
//                         key={header}
//                         className="py-3 px-4 text-left text-[#4A4947] font-semibold uppercase tracking-wider"
//                       >
//                         {header}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {places.map((place) => (
//                     <tr
//                       key={places._id}
//                       className={`hover:bg-[#D8D2C2]/10 transition-all duration-300 ${
//                         places.isDeleted ? "bg-red-50" : ""
//                       }`}
//                     >
//                       <td className="py-3 px-4 border-b border-[#4A4947]/10">
//                         {places.name}
//                       </td>
//                       <td className="py-3 px-4 border-b border-[#4A4947]/10">
//                         ${places.price}
//                       </td>
//                       <td className="py-3 px-4 border-b border-[#4A4947]/10 capitalize">
//                         {places.category}
//                       </td>
//                       <td className="py-3 px-4 border-b border-[#4A4947]/10">
//                         {places.stock}
//                       </td>
//                       <td className="py-3 px-4 border-b border-[#4A4947]/10">
//                         <select
//                           value={places.status}
//                           onChange={(e) =>
//                             handleStatusChange(places._id, e.target.value)
//                           }
//                           className={`
//                             w-full 
//                             px-3 py-1 
//                             rounded-full 
//                             text-xs 
//                             font-semibold 
//                             border-2 
//                             transition-all 
//                             duration-300 
//                             ${
//                               places.status === "approved"
//                                 ? "border-green-300 bg-green-50 text-green-800 hover:bg-green-100"
//                                 : places.status === "pending"
//                                 ? "border-yellow-300 bg-yellow-50 text-yellow-800 hover:bg-yellow-100"
//                                 : "border-red-300 bg-red-50 text-red-800 hover:bg-red-100"
//                             }
//                             appearance-none 
//                             cursor-pointer 
//                             focus:outline-none 
//                             focus:ring-2 
//                             focus:ring-opacity-50 
//                             ${
//                               places.status === "approved"
//                                 ? "focus:ring-green-300"
//                                 : places.status === "pending"
//                                 ? "focus:ring-yellow-300"
//                                 : "focus:ring-red-300"
//                             }
//                           `}
//                         >
//                           <option value="pending">Pending</option>
//                           <option value="approved">Approved</option>
//                           <option value="rejected">Rejected</option>
//                         </select>
//                       </td>
//                       <td className="py-3 px-4 border-b border-[#4A4947]/10 space-x-2">
//                         <div className="flex items-center space-x-2">
//                           <button
//                             onClick={() => handleEdit(places)}
//                             className="text-[#4A4947] hover:text-[#4A4947]/70 transition-all"
//                             title="Edit"
//                           >
//                             <Edit2 size={18} />
//                           </button>
//                           {places.isDeleted ? (
//                             <button
//                               onClick={() => handleRestore(places._id)}
//                               className="text-green-600 hover:text-green-800 transition-all"
//                               title="Restore"
//                             >
//                               <RefreshCw size={18} />
//                             </button>
//                           ) : (
//                             <button
//                               onClick={() => handleSoftDelete(places._id)}
//                               className="text-red-600 hover:text-red-800 transition-all"
//                               title="Delete"
//                             >
//                               <Trash2 size={18} />
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Places;
