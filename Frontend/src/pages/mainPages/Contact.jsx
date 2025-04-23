
import { MapPin, Phone, Mail, Globe } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ContactSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formdata, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formdata, [e.target.name]: e.target.value });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    console.log("Form Data being sent:", formdata);
  
    try {
      await axios.post("http://localhost:9527/api/message", formdata);
      Swal.fire({
        title: "تم الإرسال بنجاح!",
        text: "سنتواصل معك قريبًا",
        icon: "success",
        confirmButtonColor: "#C2A878",
      });
  
      setFormData({ name: "", email: "", title: "", message: "" });
    } catch (error) {
      console.error("Error response:", error.response?.data || error.message);
      Swal.fire({
        title: "خطأ",
        text: "فشل في إرسال الرسالة، يرجى المحاولة مرة أخرى",
        icon: "error",
        confirmButtonColor: "#C2A878",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-amber-50 to-white">
      {/* Hero Section with Creative Design */}
      <div
        className="relative h-96  w-full flex items-center justify-center bg-cover bg-center rounded-xl overflow-hidden mx-4 my-8"
        style={{ backgroundImage: "url('https://i.pinimg.com/736x/7a/39/c9/7a39c98897363a0625c40c57d8522bc7.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/70 to-black/60 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center text-white p-6 max-w-2xl">
          <div className="mb-4 transform -rotate-2">
            <h3 className="text-5xl font-extrabold mb-2 drop-shadow-lg">تواصل معنا</h3>
            <div className="h-1 w-20 bg-amber-400 mx-auto rounded-full"></div>
          </div>
          <p className="text-lg text-amber-50 leading-relaxed">
            نسعد بالتواصل معكم ونسعى لتقديم تجارب استثنائية تمزج بين الشغف والمغامرة في أروع الوجهات الفريدة.
          </p>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent"></div>
      </div>

      {/* Contact Info Section with Creative Cards */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <ContactCard
              icon={<MapPin className="w-10 h-10 text-amber-700" />}
              title="اقتراح مكان جديد"
              description="دلنا على مكان جديد اكتشفته"
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-br from-amber-50 to-white shadow-lg p-6 rounded-2xl hover:scale-105 transition-transform border-b-4 border-amber-400"
            />
            <ContactCard
              icon={<Phone className="w-10 h-10 text-amber-700" />}
              title="تواصل معنا"
              description="+962 79 0000 000"
              link="tel://962790000000"
              className="bg-gradient-to-br from-amber-50 to-white shadow-lg p-6 rounded-2xl hover:scale-105 transition-transform border-b-4 border-amber-400"
            />
            <ContactCard
              icon={<Mail className="w-10 h-10 text-amber-700" />}
              title="البريد الإلكتروني"
              description="info@waynNrooh.com"
              link="mailto:info@waynNrooh.com"
              className="bg-gradient-to-br from-amber-50 to-white shadow-lg p-6 rounded-2xl hover:scale-105 transition-transform border-b-4 border-amber-400"
            />
            <ContactCard
              icon={<Globe className="w-10 h-10 text-amber-700" />}
              title="الموقع الإلكتروني"
              description="waynNrooh.com"
              link="#"
              className="bg-gradient-to-br from-amber-50 to-white shadow-lg p-6 rounded-2xl hover:scale-105 transition-transform border-b-4 border-amber-400"
            />
          </div>
        </div>
      </section>

      {/* Contact Form Section with Creative Design */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-10 bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="w-full md:w-1/2 relative">
              <img
                src="https://i.pinimg.com/736x/b3/b4/fb/b3b4fba8fa2ebe4786538b5a2150df8a.jpg"
                alt="Map"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-amber-900/70 to-transparent flex items-end">
                <div className="p-8 text-white">
                  <h3 className="text-2xl font-bold mb-2">استكشف</h3>
                  <p className="text-amber-100">مغامرات جديدة بانتظارك</p>
                </div>
              </div>
            </div>
            
            <ContactForm 
              formdata={formdata} 
              handleChange={handleChange} 
              handlesubmit={handlesubmit} 
              loading={loading} 
            />
          </div>
        </div>
      </section>

      {/* Suggest Place Modal */}
      {isModalOpen && <SuggestPlaceModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

const ContactCard = ({ icon, title, description, link, onClick, className }) => (
  <div
    className={`${className} group cursor-pointer`}
    onClick={onClick}
  >
    <div className="flex justify-center mb-4 bg-amber-100 w-16 h-16 rounded-full mx-auto flex items-center justify-center group-hover:bg-amber-200 transition-colors">
      {icon}
    </div>
    <h3 className="text-lg font-bold mb-2 text-amber-900 text-center">{title}</h3>
    {link ? (
      <a href={link} className="text-amber-700 hover:text-amber-500 block text-center">
        {description}
      </a>
    ) : (
      <p className="text-amber-700 text-center">{description}</p>
    )}
  </div>
);

const ContactForm = ({ formdata, handleChange, handlesubmit, loading }) => (
  <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
    <div className="mb-8">
      <h2 className="text-3xl font-bold mb-2 text-amber-900">تواصل معنا</h2>
      <div className="h-1 w-16 bg-amber-400 rounded-full"></div>
    </div>
    
    <form onSubmit={handlesubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <input
            id="name"
            name="name"
            type="text"
            value={formdata.name}
            onChange={handleChange}
            className="w-full p-3 border-2 border-amber-200 rounded-lg focus:ring focus:ring-amber-200 focus:border-amber-400 bg-amber-50/50 placeholder-amber-700/50 text-amber-900 font-medium"
            placeholder="اسمك"
          />
          <div className="absolute h-1 bg-amber-400 w-0 bottom-0 left-0 transition-all duration-300 group-focus-within:w-full"></div>
        </div>
        
        <div className="relative">
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formdata.email}
            onChange={handleChange}
            className="w-full p-3 border-2 border-amber-200 rounded-lg focus:ring focus:ring-amber-200 focus:border-amber-400 bg-amber-50/50 placeholder-amber-700/50 text-amber-900 font-medium"
            placeholder="بريدك الإلكتروني"
          />
        </div>
      </div>
      
      <div className="relative">
        <input
          type="text"
          className="w-full p-3 border-2 border-amber-200 rounded-lg focus:ring focus:ring-amber-200 focus:border-amber-400 bg-amber-50/50 placeholder-amber-700/50 text-amber-900 font-medium"
          placeholder="الموضوع"
          id="title"
          name="title"
          required
          value={formdata.title}
          onChange={handleChange}
        />
      </div>
      
      <div className="relative">
        <textarea
          className="w-full p-3 border-2 border-amber-200 rounded-lg focus:ring focus:ring-amber-200 focus:border-amber-400 bg-amber-50/50 placeholder-amber-700/50 text-amber-900 font-medium"
          placeholder="رسالتك"
          id="message"
          name="message"
          required
          value={formdata.message}
          onChange={handleChange}
          rows={5}
        ></textarea>
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-white py-4 rounded-lg hover:from-amber-700 hover:to-amber-600 transition-all font-bold text-lg shadow-lg transform hover:translate-y-px flex items-center justify-center overflow-hidden group relative"
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-amber-400 to-amber-300 transition-transform duration-300 transform translate-y-full group-hover:translate-y-0"></span>
        <span className="relative flex items-center justify-center gap-2">
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <>
              <span>إرسال </span>
            </>
          )}
        </span>
      </button>
    </form>
  </div>
);


export default ContactSection;