const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');
const ExpressError = require('../utils/ExpressError');
const campground = require('../models/campground');

const { reviewSchema } = require('../schemas');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');


router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));
 
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

 module.exports = router;