// Import required modules
const mongoose = require('mongoose');
const { Schema } = mongoose;

const BabysitterSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    adresse: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    tarif: {
        type: Number,
        default: 0
    },
    experience: {
        type: Number,
        default: 0
    },
    competances: [{
        type: String
    }],
    disponibilite: {
        type: Boolean,
        default: true
    },
    rating: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Evaluations'
    }],
    certifications: [{
        name: String,
        date: Date,
        issuer: String
    }],
    languages: [{
        type: String
    }],
    availability: [{
        day: String,
        startTime: String,
        endTime: String
    }],
    bio: {
        type: String,
        maxlength: 500
    }
}, {
    timestamps: true
});

BabysitterSchema.index({ 
    name: 'text', 
    adresse: 'text',
    competances: 'text' 
});

module.exports = mongoose.model('BabySitters', BabysitterSchema);
 