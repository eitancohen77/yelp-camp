const express = require('express');
const app = express()
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const AppError = require('./error/AppError');
 
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useUnifiedTopology: true
})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "CONNECTION ERROR"));
db.once("open", () => {
    console.log("CONNECTION OPEN")
})

function wrapAsync(fn) {
    return function(req, res, next) {
        fn(req, res, next).catch(e => next(e))
    }
}
 
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true })) // We use this so that our req.params come out normal
 
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
app.get('/', (req, res) => {
    res.render('home')
})
 
app.get('/campgrounds', wrapAsync(async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))
 
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})
 
app.post('/campgrounds', wrapAsync(async(req, res, next) => {
        const campground = new Campground(req.body.campground)
        await campground.save()
        res.redirect(`/campgrounds/${campground.id}`)
}))

app.get('/campgrounds/:id', wrapAsync(async(req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        return next(new AppError('ID not found', 404))
    }
    res.render('campgrounds/show', { campground });
}))

app.get('/campgrounds/:id/edit', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
}))
 
app.patch('/campgrounds/:id', wrapAsync(async(req, res, next) => {
        const { id } = req.params;
        const campground = req.body.campground;
        await Campground.findByIdAndUpdate(id, campground)
        res.redirect('/campgrounds')
}))
 
app.delete('/campgrounds/:id', wrapAsync(async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

app.use((err, req, res, next) => {
    const { status = 500, message = 'Something Went Wrong' } = err;
    res.status(status).send(message);
})
 
app.listen(3000, () => {
    console.log('Serving on Port 3000')
})
