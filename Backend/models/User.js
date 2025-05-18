const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false  },
    phone: { type: String, required: false },    
    photo: { type: String, default: '' }, 
    bio: { type: String, required: false },    
    birthdate: { type: Date, required: false }, 
    joinDate: { type: Date, default: Date.now },  
    city: { type: String, required: false },  
    isAdmin: { type: Boolean, default: false } ,
    googleId: { type: String, unique: true, sparse: true },
    isDeleted: { type: Boolean, default: false }   


});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;
