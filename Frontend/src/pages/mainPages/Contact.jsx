// // import { MapPin, Phone, Mail, Globe } from "lucide-react";
// // import { useState } from "react";



// // const ContactSection = () => {
// //   const [isModalOpen, setIsModalOpen] = useState(false);

// //   return (
// //     <div>

// // <div
// //   className="relative h-[400px] flex items-center justify-center bg-cover bg-center rounded-lg shadow-lg"
// //   style={{ backgroundImage: "url('https://i.pinimg.com/736x/7a/39/c9/7a39c98897363a0625c40c57d8522bc7.jpg')" }}
// // >
// //   <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg"></div>
// //   <div className="relative z-10 text-center text-white px-6 max-w-2xl">
// //     <h3 className="text-4xl font-extrabold mb-4 drop-shadow-lg">تواصل معنا</h3>
// //     <p className="text-lg text-gray-200 leading-relaxed">
// //       نسعد بالتواصل معكم ونسعى لتقديم تجارب استثنائية تمزج بين الشغف والمغامرة في أروع الوجهات الفريدة.
// //     </p>
// //   </div>
// // </div>







// //       {/* Contact Info Section */}
// //       <section className="py-16 bg-[rgb(2,44,67)] text-white">
// //   <div className="container mx-auto px-6">
// //     <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
// //       <ContactCard
// //         icon={<MapPin className="w-12 h-12 text-[#FFD700]" />}
// //         title="اقتراح مكان جديد"
// //         description="دلنا على مكان جديد اكتشفته"
// //         onClick={() => setIsModalOpen(true)}
// //         className="bg-gradient-to-r from-[rgb(17,81,115)] to-[rgb(2,44,67)] text-white shadow-lg p-6 rounded-xl hover:scale-105 transition-transform"
// //       />
// //       <ContactCard
// //         icon={<Phone className="w-12 h-12 text-[#FFD700]" />}
// //         title="تواصل معنا"
// //         description="+962 79 0000 000"
// //         link="tel://962790000000"
// //         className="bg-[rgb(17,81,115)] shadow-md p-6 rounded-xl hover:shadow-lg transition-shadow"
// //       />
// //       <ContactCard
// //         icon={<Mail className="w-12 h-12 text-[#FFD700]" />}
// //         title="البريد الإلكتروني"
// //         description="info@waynNrooh.com"
// //         link="mailto:info@waynNrooh.com"
// //         className="bg-[rgb(17,81,115)] shadow-md p-6 rounded-xl hover:shadow-lg transition-shadow"
// //       />
// //       <ContactCard
// //         icon={<Globe className="w-12 h-12 text-[#FFD700]" />}
// //         title="الموقع الإلكتروني"
// //         description="waynNrooh.com"
// //         link="#"
// //         className="bg-[rgb(17,81,115)] shadow-md p-6 rounded-xl hover:shadow-lg transition-shadow"
// //       />
// //     </div>
// //   </div>
// // </section>

// //       {/* Contact Form Section */}
// //       <section className="py-16 bg-white">
// //         <div className="container mx-auto px-6 flex flex-col md:flex-row gap-10">
// //           <ContactForm />
// //           <div className="w-full md:w-1/2 flex justify-center">
// //             <img
// //               src="https://i.pinimg.com/736x/b3/b4/fb/b3b4fba8fa2ebe4786538b5a2150df8a.jpg"
// //               alt="Map"
// //               className="w-4/5 object-cover rounded-lg shadow-lg border-4 border-[rgb(2,44,67)]"
// //             />
// //           </div>
// //         </div>
// //       </section>

// //       {/* Suggest Place Modal */}
// //       {isModalOpen && <SuggestPlaceModal onClose={() => setIsModalOpen(false)} />}
// //     </div>
// //   );
// // };

// // const ContactCard = ({ icon, title, description, link, onClick }) => (
// //   <div
// //     className="bg-white p-6 rounded-lg shadow-lg cursor-pointer transition-transform transform hover:scale-105 hover:shadow-xl border-l-4 border-[#FFD700]"
// //     onClick={onClick}
// //   >
// //     <div className="flex justify-center mb-4">{icon}</div>
// //     <h3 className="text-lg font-semibold mb-2 text-[rgb(2,44,67)]">{title}</h3>
// //     {link ? (
// //       <a href={link} className="text-[#FFD700] hover:underline">
// //         {description}
// //       </a>
// //     ) : (
// //       <p className="text-gray-700">{description}</p>
// //     )}
// //   </div>
// // );

// // const ContactForm = () => (
// //   <div className="w-full md:w-1/2 bg-[rgb(2,44,67)] p-8 rounded-lg shadow-lg text-white">
// //     <h2 className="text-2xl font-semibold mb-6 text-center">تواصل معنا</h2>
// //     <form className="space-y-4">
// //       <input type="text" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#FFD700] bg-white text-[rgb(2,44,67)]" placeholder="اسمك" />
// //       <input type="email" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#FFD700] bg-white text-[rgb(2,44,67)]" placeholder="بريدك الإلكتروني" />
// //       <input type="text" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#FFD700] bg-white text-[rgb(2,44,67)]" placeholder="الموضوع" />
// //       <textarea className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#FFD700] bg-white text-[rgb(2,44,67)]" placeholder="رسالتك" rows="4"></textarea>
// //       <button className="w-full bg-[#FFD700] text-[rgb(2,44,67)] py-3 rounded-lg hover:bg-yellow-500 transition-all font-semibold">
// //         إرسال
// //       </button>
// //     </form>
// //   </div>
// // );

// // const SuggestPlaceModal = ({ onClose }) => (
// //   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
// //     <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
// //       <button className="absolute top-3 right-3 text-gray-700" onClick={onClose}>
// //         &times;
// //       </button>
// //       <h2 className="text-xl font-semibold mb-4 text-[rgb(2,44,67)]">اقتراح مكان جديد</h2>
// //       <p className="text-gray-700 mb-4">شاركنا معلومات عن أماكن غير مشهورة تستحق الزيارة.</p>
// //       <form className="space-y-4">
// //         <input type="text" className="w-full p-3 border rounded-lg" placeholder="اسم المكان" />
// //         <input type="email" className="w-full p-3 border rounded-lg" placeholder="البريد الإلكتروني" />
// //         <input type="tel" className="w-full p-3 border rounded-lg" placeholder="رقم الهاتف" />
// //         <select className="w-full p-3 border rounded-lg">
// //           <option value="">اختر المدينة</option>
// //           <option value="zarqa">الزرقاء</option>
// //           <option value="amman">عمان</option>
// //           <option value="irbid">إربد</option>
// //           <option value="other">مدينة أخرى</option>
// //         </select>
// //         <textarea className="w-full p-3 border rounded-lg" placeholder="وصف المكان" rows="4"></textarea>
// //         <input type="file" className="w-full p-3 border rounded-lg" multiple />
// //         <button className="w-full bg-[#FFD700] text-[rgb(2,44,67)] py-3 rounded-lg hover:bg-yellow-500 transition-all font-semibold">
// //           إرسال
// //         </button>
// //       </form>
// //     </div>
// //   </div>
// // );

// // export default ContactSection;









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
  
    console.log("Form Data being sent:", formdata); // ✅ تحقق من البيانات قبل الإرسال
  
    try {
      await axios.post("http://localhost:9527/api/message", formdata);
      Swal.fire({
        title: "Sent successfully!",
        text: "We will contact you soon",
        icon: "success",
        confirmButtonColor: "#FFD700",
      });
  
      setFormData({ name: "", email: "", title: "", message: "" });
    } catch (error) {
      console.error("Error response:", error.response?.data || error.message);
      Swal.fire({
        title: "Error",
        text: "Failed to send message, please try again",
        icon: "error",
        confirmButtonColor: "#FFD700",
      });
    } finally {
      setLoading(false);
    }
  };
  




  return (
    <div>

<div
  className="relative h-[400px] flex items-center justify-center bg-cover bg-center rounded-lg shadow-lg"
  style={{ backgroundImage: "url('https://i.pinimg.com/736x/7a/39/c9/7a39c98897363a0625c40c57d8522bc7.jpg')" }}
>
  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg"></div>
  <div className="relative z-10 text-center text-white px-6 max-w-2xl">
    <h3 className="text-4xl font-extrabold mb-4 drop-shadow-lg">تواصل معنا</h3>
    <p className="text-lg text-gray-200 leading-relaxed">
      نسعد بالتواصل معكم ونسعى لتقديم تجارب استثنائية تمزج بين الشغف والمغامرة في أروع الوجهات الفريدة.
    </p>
  </div>
</div>






      {/* Contact Info Section */}
      <section className="py-16 bg-white">
  <div className="container mx-auto px-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
      <ContactCard
        icon={<MapPin className="w-12 h-12 text-gray-800" />}
        title="اقتراح مكان جديد"
        description="دلنا على مكان جديد اكتشفته"
        onClick={() => setIsModalOpen(true)}
        className="bg-white shadow-lg p-6 rounded-xl hover:scale-105 transition-transform"
      />
      <ContactCard
        icon={<Phone className="w-12 h-12 text-gray-800" />}
        title="تواصل معنا"
        description="+962 79 0000 000"
        link="tel://962790000000"
        className="bg-white shadow-md p-6 rounded-xl hover:shadow-lg transition-shadow"
      />
      <ContactCard
        icon={<Mail className="w-12 h-12 text-gray-800" />}
        title="البريد الإلكتروني"
        description="info@waynNrooh.com"
        link="mailto:info@waynNrooh.com"
        className="bg-white shadow-md p-6 rounded-xl hover:shadow-lg transition-shadow"
      />
      <ContactCard
        icon={<Globe className="w-12 h-12 text-gray-800" />}
        title="الموقع الإلكتروني"
        description="waynNrooh.com"
        link="#"
        className="bg-white shadow-md p-6 rounded-xl hover:shadow-lg transition-shadow"
      />
    </div>
  </div>
</section>

      {/* Contact Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src="https://i.pinimg.com/736x/b3/b4/fb/b3b4fba8fa2ebe4786538b5a2150df8a.jpg"
              alt="Map"
              className="w-4/5 object-cover rounded-lg shadow-lg"
            />
          </div>
          <ContactForm formdata={formdata} handleChange={handleChange} handlesubmit={handlesubmit} loading={loading} />

        </div>
      </section>

      {/* Suggest Place Modal */}
      {isModalOpen && <SuggestPlaceModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

const ContactCard = ({ icon, title, description, link, onClick }) => (
  <div
    className="bg-white p-6 rounded-lg shadow-lg cursor-pointer transition-transform transform hover:scale-105 hover:shadow-xl border-l-4 border-[#FFD700]"
    onClick={onClick}
  >
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-lg font-semibold mb-2 text-[rgb(2,44,67)]">{title}</h3>
    {link ? (
      <a href={link} className="text-[#FFD700] hover:underline">
        {description}
      </a>
    ) : (
      <p className="text-gray-700">{description}</p>
    )}
  </div>
);

const ContactForm = ({ formdata, handleChange, handlesubmit, loading }) => (

  <div className="w-full md:w-1/2 bg-[white)] p-8 rounded-lg shadow-lg text-white">
    <h2 className="text-2xl font-semibold mb-6 text-center">تواصل معنا</h2>
    <form  onSubmit={handlesubmit} className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl border border-[#FFD700] grid gap-6 md:grid-cols-2">
        <input
          id="name"
          name="name"
          type="text"
          value={formdata.name}
          onChange={handleChange}
          className="w-full p-3 border border-[#FFD700] rounded-lg focus:ring-2 focus:ring-[#FFD700] text-[#022C43] font-[cursive] text-lg placeholder-opacity-70"
          placeholder="اسمك"
        />
        <input
           id="email"
           name="email"
           type="email"
           required
           value={formdata.email}
           onChange={handleChange}
          className="w-full p-3 border border-[#FFD700] rounded-lg focus:ring-2 focus:ring-[#FFD700] text-[#022C43] font-[cursive] text-lg placeholder-opacity-70"
          placeholder="بريدك الإلكتروني"
        />
        <input
          type="text"
          className="w-full p-3 border border-[#FFD700] rounded-lg focus:ring-2 focus:ring-[#FFD700] text-[#022C43] font-[cursive] text-lg placeholder-opacity-70 col-span-2"
          placeholder="الموضوع"
          id="title"
          name="title"
          required
          value={formdata.text}
          onChange={handleChange}
        />
        <textarea
          className="w-full p-3 border border-[#FFD700] rounded-lg focus:ring-2 focus:ring-[#FFD700] text-[#022C43] font-[cursive] text-lg placeholder-opacity-70 col-span-2"
          placeholder="رسالتك"
          id="message"
                    name="message"
                    required
                    value={formdata.message}
                    onChange={handleChange}
                    rows={5}
        ></textarea>
        {/* <button
          className="w-full col-span-2 bg-[#FFD700] text-[#022C43] py-3 rounded-lg hover:bg-yellow-500 transition-all font-semibold text-lg shadow-md transform hover:scale-105"
        >
          ✨ إرسال ✨
        </button> */}
               <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-md px-4 py-4 text-ج font-medium transition duration-300 hover:bg-red-800 flex items-center justify-center"
                    style={{ backgroundColor: "#115173" }}
                  >
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
                      "Send Message"
                    )}
                  </button>
                </div>
      </form>
  </div>
);

const SuggestPlaceModal = ({ onClose }) => (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 mt-30" >
  <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative max-h-[90vh] overflow-auto">
    <button className="absolute top-3 right-3 text-gray-700 text-2xl" onClick={onClose}>
      &times;
    </button>
    <h2 className="text-xl font-semibold mb-4 text-[rgb(2,44,67)]">اقتراح مكان جديد</h2>
    <p className="text-gray-700 mb-4">شاركنا معلومات عن أماكن غير مشهورة تستحق الزيارة.</p>
    <form className="space-y-4">
      <input type="text" className="w-full p-3 border rounded-lg" placeholder="اسم المكان" />
      <input type="email" className="w-full p-3 border rounded-lg" placeholder="البريد الإلكتروني" />
      <input type="tel" className="w-full p-3 border rounded-lg" placeholder="رقم الهاتف" />
      <select className="w-full p-3 border rounded-lg">
        <option value="">اختر المدينة</option>
        <option value="zarqa">الزرقاء</option>
        <option value="amman">عمان</option>
        <option value="irbid">إربد</option>
        <option value="other">مدينة أخرى</option>
      </select>
      <textarea className="w-full p-3 border rounded-lg" placeholder="وصف المكان" rows="4"></textarea>
      <input type="file" className="w-full p-3 border rounded-lg" multiple />
      <button className="w-full bg-[#FFD700] text-[rgb(2,44,67)] py-3 rounded-lg hover:bg-yellow-500 transition-all font-semibold">
        إرسال
      </button>
    </form>
  </div>
</div>

);

export default ContactSection;














