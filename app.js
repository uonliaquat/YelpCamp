const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const campground = require('./models/campground');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError')
const {campgroundSchema, reviewSchema} = require('./schemas');
const Review = require('./models/review');
const campgroundRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
const { dirname } = require('path');
const session = require('express-session');
// const { setFlagsFromString } = require('v8');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const userRoutes = require('./routes/user');



mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,  
    userCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
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

const sessionConfig = {
    secret: 'thisshouldbeabettersecrete',
    resave: false,
    saveUintialized: true,
    cookie: {
        httpOnly: true,  
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}


app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();

});

app.get('/fakeUser', async (req, res) => {
    const user = new User({email: 'conta@gmail.com', username: 'conta'});
    const newUser = await User.register(user, '1234');
    res.send(newUser);
})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);
app.use(express.static(path.join(__dirname, 'public')));



app.all('*', (req, res, next) =>{
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500, message = 'Something went wrong!'} = err;
    if(!err.message) err.message = 'Oh No!, omething went wrong';
    res.status(statusCode).render('error', {err});
})

;