 // Import required modules
const mongoose = require('mongoose');
const { Schema } = mongoose;

const Parent  = new Schema({
    id  : {
        type: String,
        required: true,
        unique: true
    } , 
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    } , 
    email: {
        type: String,
        required: true
    
    } , 
    password: {
        type: String,
        required: true
    } ,
    contact : {
        type: String,
        required: true
    } , 


    adresse : {
        type: String,
        required : true ,
    } ,
    photo : {
        type: String,
        required : true
    } , 
    favoris: [{
        type: Schema.Types.ObjectId,
        ref: 'Babysitter' 
      }]
   
});

module.exports = mongoose.model('Parents', Parent);
