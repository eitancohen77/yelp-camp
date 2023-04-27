const express = require('express');
const router = express.Router()
const Campground = require('../models/campground')

function wrapAsync(fn) {
    return function(req, res, next) {
        fn(req, res, next).catch(e => next(e))
    }
}

router.get('/', wrapAsync(async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))
 
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
})
 
router.post('/', wrapAsync(async(req, res, next) => {
        const campground = new Campground(req.body.campground)
        await campground.save()
        res.redirect(`/campgrounds/${campground.id}`)
}))

router.get('/:id', wrapAsync(async(req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        return next(new AppError('ID not found', 404))
    }
    res.render('campgrounds/show', { campground });
}))

router.get('/:id/edit', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
}))
 
router.patch('/:id', wrapAsync(async(req, res, next) => {
        const { id } = req.params;
        const campground = req.body.campground;
        await Campground.findByIdAndUpdate(id, campground)
        res.redirect('/campgrounds')
}))
 
router.delete('/:id', wrapAsync(async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

module.exports = router