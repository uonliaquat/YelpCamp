const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const campground = require('./models/campground');
const ejsMate = require('ejs-mate');

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

const app = express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true}))
app.use(methodOverride('_method'));

app.listen(3000, () => {
    console.log('Serving on PORT 3000');
})


app.get('/campgrounds', async (req, res) => {
    const campgrounds = await campground.find({});
    res.render('campgrounds/index', {campgrounds});
})


app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', async (req, res) => {
    const camp = new campground(req.body.campground);
    await camp.save();
    res.redirect(`campgrounds/${camp._id}`);
})

app.get('/campgrounds/:id', async (req, res) => {
    const camp = await campground.findById(req.params.id);
    res.render('campgrounds/show', { camp });
})

app.get('/campgrounds/:id/edit', async(req, res) => {
    const camp = await campground.findById(req.params.id);
    res.render('campgrounds/edit', {camp});
})

app.put('/campgrounds/:id', async(req, res) => {
    const {id} = req.params;
    const camp = await campground.findByIdAndUpdate(id, {...req.body.campground});
    res.redirect(`/campgrounds/${camp._id}`);
})

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})


