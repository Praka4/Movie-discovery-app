const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    genre: { type: String, required: true },
    year: { type: Number, required: true },
    description: { type: String },
    rating: { type: Number, default: 0 },       // Needed for Test 3 & 6
    popularity: { type: Number, default: 0 },   // Needed for Test 3
    runtime: { type: Number, default: 120 },    // Needed for Test 6
    poster: { type: String, default: '' },        // Needed for Test 6
    posterPath: { type: String, default: '' }, // Needed for Test 6
});

module.exports = mongoose.model('Movie', movieSchema);