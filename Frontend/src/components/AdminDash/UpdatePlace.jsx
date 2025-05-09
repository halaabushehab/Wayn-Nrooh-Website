// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';
// import Cookies from 'js-cookie'; // تأكد من أنك قمت بتثبيت مكتبة js-cookie

// const UpdatePlace = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [place, setPlace] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [images, setImages] = useState([]);
//   const [imagePreviews, setImagePreviews] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState(null);

//   useEffect(() => {
//     const loadUserFromCookies = () => {
//       const userCookie = Cookies.get("user"); // جلب الكوكيز الذي يحمل بيانات المستخدم
//       if (userCookie) {
//         try {
//           const parsedUser = JSON.parse(userCookie); // تحليل الكوكيز
//           console.log("🧖 Loading user from cookies:", parsedUser);

//           if (parsedUser.token) {
//             // تعيين التوكن في هيدر الـ axios
//             axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
//           }
//         } catch (error) {
//           console.error("Error parsing user cookie:", error); // في حال حدث خطأ في تحليل الكوكيز
//           Cookies.remove("user"); // إزالة الكوكيز إذا كان هناك خطأ
//         }
//       }
//     };

//     loadUserFromCookies();
//   }, []);

//   useEffect(() => {
//     const fetchPlace = async () => {
//       try {
//         const response = await axios.get(`http://localhost:9527/dashboard/places/${id}`);
//         const fetchedPlace = response.data;

//         fetchedPlace.categories = Array.isArray(fetchedPlace.categories) ? fetchedPlace.categories.join(", ") : fetchedPlace.categories;
//         fetchedPlace.suitable_for = Array.isArray(fetchedPlace.suitable_for) ? fetchedPlace.suitable_for.join(", ") : fetchedPlace.suitable_for;

//         setPlace(fetchedPlace);
//         setLoading(false);
//       } catch (err) {
//         setError('حدث خطأ أثناء تحميل البيانات');
//         setLoading(false);
//       }
//     };

//     fetchPlace();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, type, value, checked } = e.target;
//     setPlace((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     setImages(files);

//     const previews = files.map((file) => URL.createObjectURL(file));
//     setImagePreviews(previews);
//   };

//   const removeImage = (index) => {
//     const newImages = [...images];
//     newImages.splice(index, 1);
//     setImages(newImages);

//     const newPreviews = [...imagePreviews];
//     newPreviews.splice(index, 1);
//     setImagePreviews(newPreviews);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     if (!place) return;
  
//     try {
//       const formData = new FormData();
//       formData.append('name', place.name);
//       formData.append('short_description', place.short_description);
//       formData.append('detailed_description', place.detailed_description);
//       formData.append('city', place.city);
//       formData.append('categories', place.categories); // تأكد من أن القيمة صحيحة
//       formData.append('suitable_for', place.suitable_for); // تأكد من أن القيمة صحيحة
//       formData.append('phone', place.phone);
//       formData.append('website', place.website);
//       formData.append('latitude', place.latitude);
//       formData.append('longitude', place.longitude);
//       formData.append('working_hours', place.working_hours);
//       formData.append('rating', place.rating);
//       formData.append('ticket_price', place.ticket_price);
//       formData.append('map_link', place.map_link);

//       if (images && images.length > 0) {
//         for (let i = 0; i < images.length; i++) {
//           formData.append('images', images[i]);
//         }
//       }
  
//       setIsSubmitting(true);
  
//       const response = await axios.put(`http://localhost:9527/dashboard/places/update/${id}`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: axios.defaults.headers.common['Authorization'],
//         },
//       });
  
//       console.log('تم التعديل بنجاح');
//       setSubmitStatus('success');
//       navigate('/admin/places');
//     } catch (error) {
//       console.error('خطأ أثناء التعديل:', error);
//       setSubmitStatus('error');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
  

//   if (loading) return <div>جاري التحميل...</div>;
//   if (error) return <div>{error}</div>;

//   return (
// <div style={{ padding: '2rem' }}>
//   <h1>تعديل المكان</h1>
//   <form onSubmit={handleSubmit}>
//     <div>
//       <label>اسم المكان</label>
//       <input
//         type="text"
//         name="name"
//         value={place?.name || ''}
//         onChange={handleChange}
//       />
//     </div>

//     <div>
//       <label>الوصف المختصر</label>
//       <textarea
//         name="short_description"
//         value={place?.short_description || ''}
//         onChange={handleChange}
//       />
//     </div>

//     <div>
//       <label>الوصف التفصيلي</label>
//       <textarea
//         name="detailed_description"
//         value={place?.detailed_description || ''}
//         onChange={handleChange}
//       />
//     </div>

//     <div>
//       <label>المدينة</label>
//       <input
//         type="text"
//         name="city"
//         value={place?.city || ''}
//         onChange={handleChange}
//       />
//     </div>

//     <div>
//       <label>الفئات</label>
//       <input
//         type="text"
//         name="categories"
//         value={place?.categories || ''}
//         onChange={handleChange}
//       />
//     </div>

//     <div>
//       <label>مناسب لـ</label>
//       <input
//         type="text"
//         name="suitable_for"
//         value={place?.suitable_for || ''}
//         onChange={handleChange}
//       />
//     </div>

//     <div>
//       <label>الهاتف</label>
//       <input
//         type="text"
//         name="phone"
//         value={place?.phone || ''}
//         onChange={handleChange}
//       />
//     </div>

//     <div>
//       <label>الموقع الإلكتروني</label>
//       <input
//         type="text"
//         name="website"
//         value={place?.website || ''}
//         onChange={handleChange}
//       />
//     </div>

//     {/* الحقول الجديدة */}
//     <div>
//       <label>خط العرض (Latitude)</label>
//       <input
//         type="text"
//         name="latitude"
//         value={place?.latitude || ''}
//         onChange={handleChange}
//       />
//     </div>

//     <div>
//       <label>خط الطول (Longitude)</label>
//       <input
//         type="text"
//         name="longitude"
//         value={place?.longitude || ''}
//         onChange={handleChange}
//       />
//     </div>

//     <div>
//       <label>ساعات العمل</label>
//       <input
//         type="text"
//         name="working_hours"
//         value={place?.working_hours || ''}
//         onChange={handleChange}
//       />
//     </div>

//     <div>
//       <label>التقييم (Rating)</label>
//       <input
//         type="number"
//         step="0.1"
//         min="0"
//         max="5"
//         name="rating"
//         value={place?.rating || ''}
//         onChange={handleChange}
//       />
//     </div>

//     {/* الحقول الجديدة: ticket_price و map_link */}
//     <div>
//       <label>سعر التذكرة</label>
//       <input
//         type="number"
//         name="ticket_price"
//         value={place?.ticket_price || ''}
//         onChange={handleChange}
//       />
//     </div>

//     <div>
//       <label>رابط الخريطة</label>
//       <input
//         type="text"
//         name="map_link"
//         value={place?.map_link || ''}
//         onChange={handleChange}
//       />
//     </div>

//     <div>
//       <label>رفع الصور</label>
//       <input type="file" multiple accept="image/*" onChange={handleFileChange} />
//     </div>

//     {imagePreviews.length > 0 && (
//       <div>
//         <h4>معاينة الصور:</h4>
//         <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
//           {imagePreviews.map((preview, index) => (
//             <div key={index} style={{ position: "relative" }}>
//               <img
//                 src={preview}
//                 alt={`معاينة ${index + 1}`}
//                 style={{ width: "150px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
//               />
//               <button
//                 type="button"
//                 onClick={() => removeImage(index)}
//                 style={{
//                   position: "absolute",
//                   top: 0,
//                   right: 0,
//                   background: "red",
//                   color: "white",
//                   borderRadius: "50%",
//                   width: "24px",
//                   height: "24px",
//                   border: "none"
//                 }}
//               >
//                 ×
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     )}

//     <div style={{ marginTop: "1rem" }}>
//       <button type="submit" disabled={isSubmitting}>
//         {isSubmitting ? "جاري الإرسال..." : "تعديل المكان"}
//       </button>
//       <button type="button" onClick={() => navigate('/admin/places')} style={{ marginLeft: '1rem' }}>
//         إلغاء
//       </button>
//     </div>
//   </form>
// </div>

//   );
// };

// export default UpdatePlace;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const UpdatePlace = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    const loadUserFromCookies = () => {
      const userCookie = Cookies.get("user");
      if (userCookie) {
        try {
          const parsedUser = JSON.parse(userCookie);
          console.log("🧖 Loading user from cookies:", parsedUser);

          if (parsedUser.token) {
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
    const fetchPlace = async () => {
      try {
        const response = await axios.get(`http://localhost:9527/dashboard/places/${id}`);
        const fetchedPlace = response.data;

        fetchedPlace.categories = Array.isArray(fetchedPlace.categories) ? fetchedPlace.categories.join(", ") : fetchedPlace.categories;
        fetchedPlace.suitable_for = Array.isArray(fetchedPlace.suitable_for) ? fetchedPlace.suitable_for.join(", ") : fetchedPlace.suitable_for;

        setPlace(fetchedPlace);
        setLoading(false);
      } catch (err) {
        setError('حدث خطأ أثناء تحميل البيانات');
        setLoading(false);
      }
    };

    fetchPlace();
  }, [id]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setPlace((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!place) return;
  
    try {
      const formData = new FormData();
      formData.append('name', place.name);
      formData.append('short_description', place.short_description);
      formData.append('detailed_description', place.detailed_description);
      formData.append('city', place.city);
      formData.append('categories', place.categories);
      formData.append('suitable_for', place.suitable_for);
      formData.append('phone', place.phone);
      formData.append('website', place.website);
      formData.append('latitude', place.latitude);
      formData.append('longitude', place.longitude);
      formData.append('working_hours', place.working_hours);
      formData.append('rating', place.rating);
      formData.append('ticket_price', place.ticket_price);
      formData.append('map_link', place.map_link);

      if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          formData.append('images', images[i]);
        }
      }
  
      setIsSubmitting(true);
  
      const response = await axios.put(`http://localhost:9527/dashboard/places/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: axios.defaults.headers.common['Authorization'],
        },
      });
  
      console.log('تم التعديل بنجاح');
      setSubmitStatus('success');
      navigate('/AdminDash');
    } catch (error) {
      console.error('خطأ أثناء التعديل:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div style={styles.loading}>جاري التحميل...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>تعديل المكان</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>اسم المكان</label>
          <input
            type="text"
            name="name"
            value={place?.name || ''}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>الوصف المختصر</label>
          <textarea
            name="short_description"
            value={place?.short_description || ''}
            onChange={handleChange}
            style={styles.textarea}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>الوصف التفصيلي</label>
          <textarea
            name="detailed_description"
            value={place?.detailed_description || ''}
            onChange={handleChange}
            style={styles.textarea}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>المدينة</label>
          <input
            type="text"
            name="city"
            value={place?.city || ''}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>الفئات</label>
          <input
            type="text"
            name="categories"
            value={place?.categories || ''}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>مناسب لـ</label>
          <input
            type="text"
            name="suitable_for"
            value={place?.suitable_for || ''}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>الهاتف</label>
          <input
            type="text"
            name="phone"
            value={place?.phone || ''}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>الموقع الإلكتروني</label>
          <input
            type="text"
            name="website"
            value={place?.website || ''}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>خط العرض (Latitude)</label>
          <input
            type="text"
            name="latitude"
            value={place?.latitude || ''}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>خط الطول (Longitude)</label>
          <input
            type="text"
            name="longitude"
            value={place?.longitude || ''}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>ساعات العمل</label>
          <input
            type="text"
            name="working_hours"
            value={place?.working_hours || ''}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>التقييم (Rating)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            name="rating"
            value={place?.rating || ''}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>سعر التذكرة</label>
          <input
            type="number"
            name="ticket_price"
            value={place?.ticket_price || ''}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>رابط الخريطة</label>
          <input
            type="text"
            name="map_link"
            value={place?.map_link || ''}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>رفع الصور</label>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={handleFileChange} 
            style={styles.fileInput}
          />
        </div>

        {imagePreviews.length > 0 && (
          <div style={styles.previewsContainer}>
            <h4 style={styles.previewTitle}>معاينة الصور:</h4>
            <div style={styles.previewsGrid}>
              {imagePreviews.map((preview, index) => (
                <div key={index} style={styles.previewItem}>
                  <img
                    src={preview}
                    alt={`معاينة ${index + 1}`}
                    style={styles.previewImage}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    style={styles.removeButton}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={styles.buttonGroup}>
          <button 
            type="submit" 
            disabled={isSubmitting}
            style={isSubmitting ? styles.submitButtonDisabled : styles.submitButton}
          >
            {isSubmitting ? "جاري الإرسال..." : "تعديل المكان"}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/admin/places')} 
            style={styles.cancelButton}
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    backgroundColor: '#FFFFFF',
    minHeight: '100vh',
    marginTop:"80px",
  },
  header: {
    color: '#022C43',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  form: {
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#FFFFFF',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#022C43',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    backgroundColor: '#FFFFFF',
    color: '#115173',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    minHeight: '100px',
    backgroundColor: '#FFFFFF',
    color: '#115173',
  },
  fileInput: {
    width: '100%',
    padding: '0.5rem',
  },
  previewsContainer: {
    margin: '1.5rem 0',
  },
  previewTitle: {
    color: '#022C43',
    marginBottom: '1rem',
  },
  previewsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '1rem',
  },
  previewItem: {
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  removeButton: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    background: '#FF0000',
    color: '#FFFFFF',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '1rem',
    marginTop: '2rem',
  },
  submitButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#115173',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  submitButtonDisabled: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#CCCCCC',
    color: '#666666',
    border: 'none',
    borderRadius: '4px',
    cursor: 'not-allowed',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#FFD700',
    color: '#022C43',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    color: '#022C43',
    fontSize: '1.2rem',
  },
  error: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    color: '#FF0000',
    fontSize: '1.2rem',
  },
};

export default UpdatePlace;