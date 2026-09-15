const Wishlist = require("../models/Wishlist");

const getWishlist = async (req, res) => {
  try {
    const movies = await Wishlist.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      results: movies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch wishlist",
    });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const movie = await Wishlist.create(req.body);

    res.status(201).json({
      success: true,
      movie,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Movie already exists in wishlist",
      });
    }

    res.status(500).json({
      success: false,
      message: "Unable to add movie",
    });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const movie = await Wishlist.findOneAndDelete({
      movieId: Number(req.params.movieId),
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.json({
      success: true,
      message: "Movie removed from wishlist",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to remove movie",
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};