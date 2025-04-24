import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = ({ onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    const previewUrls = files.map(file => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const handleUpload = async () => {
    const uploadedUrls = [];

    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'unsigned_preset'); // عدل الاسم إذا كنت استخدمت اسم مختلف

      try {
        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/waynroh/image/upload',
          formData
        );
        uploadedUrls.push(response.data.secure_url);
      } catch (error) {
        console.error('خطأ في رفع الصورة:', error);
      }
    }

    onUpload(uploadedUrls);
  };

  return (
    <div>
      <input type="file" multiple accept="image/*" onChange={handleFileChange} />
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        {previews.map((src, index) => (
          <img key={index} src={src} alt={`معاينة ${index + 1}`} width="100" />
        ))}
      </div>
      <button onClick={handleUpload}>رفع الصور</button>
    </div>
  );
};

export default ImageUpload;
