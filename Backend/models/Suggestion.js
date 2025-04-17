const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    placeName: { type: String, required: true },
    description: { type: String, required: true },
    workingHours: { type: String, default: "Not specified" },
    rating: { type: Number, default: 0 },
    ticketPrice: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    bestSeason: { type: String, default: "any" },
    requiresTickets: { type: Boolean, default: false },
    isFree: { type: Boolean, default: false },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false },
}, { timestamps: true 
});


const Suggestion = mongoose.model("Suggestion", suggestionSchema);
module.exports = Suggestion;
