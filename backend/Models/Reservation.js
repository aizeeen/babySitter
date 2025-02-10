// Import required modules
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReservationSchema = new Schema({
    date: { 
        type: Date, 
        required: true 
    },
    time: { 
        type: String, 
        required: true 
    },
    duration: { 
        type: Number, 
        required: true,
        min: 1,
        max: 12
    },
    babysitter: { 
        type: Schema.Types.ObjectId, 
        ref: 'BabySitters', 
        required: true 
    },
    parent: { 
        type: Schema.Types.ObjectId, 
        ref: 'Parents', 
        required: true 
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    description: { 
        type: String, 
        required: true 
    },
    totale: { 
        type: Number, 
        required: true 
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Reservations', ReservationSchema);

