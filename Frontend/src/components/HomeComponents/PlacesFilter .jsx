import React, { useState } from "react";

const PlacesFilter = ({ onFilterChange }) => {
    const [city, setCity] = useState("");
    const [category, setCategory] = useState("");
    const [ticketPrice, setTicketPrice] = useState("");

    // تحديث الفلاتر وإرسالها إلى Home.js
    const handleFilterChange = () => {
        const filters = {};

        if (city) filters.city = city;
        if (category) filters.category = category;
        if (ticketPrice) filters.ticket_price = ticketPrice;

        onFilterChange(filters); // تمرير الفلاتر إلى `Home.js`
    };

    return (
        <div style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }}>
            <h2>🔍 فلترة الأماكن</h2>

            <div>
                <label>المدينة:</label>
                <select value={city} onChange={(e) => setCity(e.target.value)}>
                    <option value="">الكل</option>
                    <option value="عمان">عمان</option>
                    <option value="إربد">إربد</option>
                    <option value="الزرقاء">الزرقاء</option>
                </select>
            </div>

            <div>
                <label>الفئة:</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">الكل</option>
                    <option value="منتزهات">منتزهات</option>
                    <option value="طبيعة">طبيعة</option>
                    <option value="ترفيه">ترفيه</option>
                </select>
            </div>

            <div>
                <label>سعر التذكرة:</label>
                <select value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)}>
                    <option value="">الكل</option>
                    <option value="free">مجاني</option>
                    <option value="less5">أقل من 5 دنانير</option>
                    <option value="more5">5 دنانير فأكثر</option>
                </select>
            </div>

            <button onClick={handleFilterChange} style={{ marginTop: "10px", padding: "8px 15px", background: "blue", color: "white", border: "none", borderRadius: "5px" }}>
                🔍 تطبيق الفلترة
            </button>
        </div>
    );
};





export default PlacesFilter;



