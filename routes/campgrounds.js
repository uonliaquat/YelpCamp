const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');





router.get('/', catchAsync(async (req, res) => { 
    const campgrounds = await campground.find({});
    res.render('campgrounds/index', {campgrounds});
}))


router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const camp = new campground(req.body.campground);
    camp.author = req.user._id;
    await camp.save();
    req.flash('success', 'Successfully made a campground');
    res.redirect(`campgrounds/${camp._id}`);
}))

router.get('/:id', catchAsync(async (req, res) => {
    const camp = await campground.findById(req.params.id)
    .populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    })
    .populate('author');
    if(!camp){
        req.flash('error', 'Cannot find the campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { camp });
}))

router.get('/:id/edit', isAuthor, isLoggedIn, catchAsync(async(req, res) => {
    const { id } = req.params;
    const camp = await campground.findById(id);
    if(!camp){
        req.flash('error', 'Cannot find the campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {camp});
}))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async(req, res) => {
    const {id} = req.params;
    const campground = await campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success', 'Successfully Updated Campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:id', isAuthor, isLoggedIn, catchAsync( async (req, res) => {
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}))



module.exports = router;