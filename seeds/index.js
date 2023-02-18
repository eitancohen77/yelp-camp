const mongoose = require('mongoose')
const Campground = require('../models/campground');
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')

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

const sample = array => array[Math.floor(Math.random() * array.length)]
// This is a function in which we put in an array and return a random element of that array
// If you see in the seedDB function we call on this when we set title to a value


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: `https://source.unsplash.com/collection/8860683`,
            price: price,
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cumque eligendi, quis, quos esse deleniti vitae voluptatum odio reiciendis quo aliquam aperiam nemo consectetur ipsa, ad porro dolores rem explicabo neque!'

        })
        await camp.save()
    }
}

seedDB();