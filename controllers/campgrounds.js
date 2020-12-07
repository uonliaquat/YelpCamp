const campground = require('../models/campground');

module.exports.index = async (req, res) => { 
    const campgrounds = await campground.find({});
    res.render('campgrounds/index', {campgrounds});
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    const camp = new campground(req.body.campground);
    camp.author = req.user._id;
    await camp.save();
    req.flash('success', 'Successfully made a campground');
    res.redirect(`campgrounds/${camp._id}`);
}

module.exports.showCampground = async (req, res) => {
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
}

module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const camp = await campground.findById(id);
    if(!camp){
        req.flash('error', 'Cannot find the campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {camp});
}

module.exports.updateForm = async(req, res) => {
    const {id} = req.params;
    const campground = await campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success', 'Successfully Updated Campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}