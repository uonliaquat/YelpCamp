const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const campground = require('../models/campground');
const {campgroundSchema} = require('../schemas');
const { isLoggedIn } = require('../middleware');



const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if ( error ) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

 


router.get('/', catchAsync(async (req, res) => { 
    const campgrounds = await campground.find({});
    res.render('campgrounds/index', {campgrounds});
}))


router.get('/new', isLoggedIn, (req, res) => {

    res.render('campgrounds/new');
})

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const camp = new campground(req.body.campground);
    await camp.save();
    req.flash('success', 'Successfully made a campground');
    res.redirect(`campgrounds/${camp._id}`);
}))

router.get('/:id', catchAsync(async (req, res) => {
    const camp = await campground.findById(req.params.id).populate('reviews');
    if(!camp){
        req.flash('error', 'Cannot find the campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { camp });
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async(req, res) => {
    const camp = await campground.findById(req.params.id);
    if(!camp){
        req.flash('error', 'Cannot find the campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {camp});
}))

router.put('/:id', isLoggedIn, validateCampground, catchAsync(async(req, res) => {
    const {id} = req.params;
    const camp = await campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success', 'Successfully Updated Campground!');
    res.redirect(`/campgrounds/${camp._id}`);
}))

router.delete('/:id', isLoggedIn, catchAsync( async (req, res) => {
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}))



module.exports = router;