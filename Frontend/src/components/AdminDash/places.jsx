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

  // Fetch data from server
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let url = `http://localhost:9527/api/places/`;
        
        // Add filter if not 'all'
        if (filter !== 'all') {
          url += `&status=${filter}`;
        }

        const [placesRes, statsRes] = await Promise.all([
          axios.get(url, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get('http://localhost:9527/api/places/status', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        ]);

        // Process places
        if (placesRes.data && Array.isArray(placesRes.data.places)) {
          setPlaces(placesRes.data.places);
          setPagination({
            ...pagination,
            total: placesRes.data.total,
            totalPages: placesRes.data.totalPages
          });
        }

        // Process stats
        setStats(statsRes.data);

      } catch (error) {
        toast.error("Failed to fetch data");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter, pagination.page, pagination.limit]);

  // Handle approval
  const handleApprove = async (id) => {
    try {
      const response = await axios.patch(
        `http://localhost:9527/api/places/${id}/status`, 
        { status: 'approved' }, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
  
      // Update UI
      setPlaces(places.map(p => 
        p._id === id ? { ...p, status: 'approved' } : p
      ));
  
      toast.success('Place approved successfully');
    } catch (error) {
      toast.error('Failed to approve place');
      console.error('Error:', error);
    }
  };

  // Handle rejection
  const handleReject = async (id) => {
    try {
      await axios.patch(
        `http://localhost:9527/api/places/${id}/status`, 
        { status: 'rejected' }, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      // Update UI
      setPlaces(places.map(p => 
        p._id === id ? { ...p, status: 'rejected' } : p
      ));
      toast.success('Place rejected successfully');
    } catch (error) {
      toast.error('Failed to reject place');
      console.error('Error:', error);
    }
  };

 // Handle soft delete
const handleSoftDelete = async (id) => {
  if (!window.confirm('Are you sure you want to delete this place?')) return;

  try {
    await axios.delete(`http://localhost:9527/places/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    // Update UI
    setPlaces(places.filter(p => p._id !== id));
    toast.success('Place deleted successfully');
  } catch (error) {
    toast.error('Failed to delete place');
    console.error('Error:', error);
  }
};

  
  // Handle edit
  const handleEdit = (id) => {
    navigate(`/admin/places/edit/${id}`);
  };

  // Change page
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