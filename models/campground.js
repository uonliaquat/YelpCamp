const { required } = require('joi');
const mongoose = require('mongoose');
const { campgroundSchema } = require('../schemas');
const Review = require('./review');
const Schema = mongoose.Schema;


const imageSchema = new Schema({
        url: String,
        filename: String
})

imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', 'upload/w_200');
})
const campGroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String, 
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true      
        }
    },
    images: [imageSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

campGroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('CampGround', campGroundSchema);  