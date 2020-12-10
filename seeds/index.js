const mongoose = require('mongoose');
const cities = require('./cities');

const campground = require('../models/campground');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    userCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
})

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await campground.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new campground({
            author : '5fca2a1cc15232c220a97ba5',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry:{
                type: "Point",
                coordinates: [-113.1331, 47.0202]
            },
            images: [
                {
                    url: 'https://source.unsplash.com/collection/483251',
                    filename: 'YelpCamp/image1'
                },
                {
                    url: 'https://source.unsplash.com/collection/483251',
                    filename: 'YelpCamp/image2'
                },
                {
                    url: 'https://source.unsplash.com/collection/483251',
                    filename: 'YelpCamp/image3'
                }
            ],
            price,
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusamus ut autem voluptatum, saepe quae laudantium error. Esse molestias eum sunt odit dolorum corrupti! Earum asperiores odio ratione cum non qui!'
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})