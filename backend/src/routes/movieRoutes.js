const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie'); // Make sure path matches your model

// This handles GET requests to the base url of this router
router.get('/', async (req, res) => {
    try {
        const { sort, genre, page = 1, limit = 6 } = req.query;
        let query = {};
        
        // Test 4 Filter
        if (genre && genre !== 'All') {
            query.genre = { $regex: new RegExp(genre, 'i') };
        }

        let sortOption = {};
        // Test 3 Sort
        if (sort === 'Highest Rated') {
            sortOption = { rating: -1 };
        } else {
            sortOption = { popularity: -1 }; // Default: Most Popular
        }

        // Test 5 Pagination logic
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const movies = await Movie.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Movie.countDocuments(query);

        res.json({
            movies,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// This handles POST requests to the base url of this router
router.post('/', async (req, res) => {
  const movie = new Movie({
    title: req.body.title,
    genre: req.body.genre,
    year: req.body.year,
    description: req.body.description
  });
  try {
    const savedMovie = await movie.save();
    res.status(201).json(savedMovie)
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;