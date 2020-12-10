const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer( {storage} );



router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));
    

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateForm))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));




router.get('/:id/edit', isAuthor, isLoggedIn, catchAsync(campgrounds.renderEditForm));





module.exports = router;