const Babysitter = require("../Models/Babysitter");
const Evaluation = require("../Models/Evaluation");

exports.getBabysitters = async (req, res) => {
  try {
    const {
      location,
      minPrice,
      maxPrice,
      experience,
      skills,
      availability,
      page = 1,
      limit = 10,
    } = req.query;

    let query = {};

  
    if (location) {
      query.adresse = { $regex: location, $options: "i" };
    }
    if (minPrice || maxPrice) {
      query.tarif = {};
      if (minPrice) query.tarif.$gte = Number(minPrice);
      if (maxPrice) query.tarif.$lte = Number(maxPrice);
    }
    if (experience) {
      query.experience = { $gte: Number(experience) };
    }
    if (skills) {
      query.competances = { $in: skills.split(",") };
    }
    if (availability) {
      query.disponibilite = availability === "true";
    }

    
    const skip = (Number(page) - 1) * Number(limit);

    const babysitters = await Babysitter.find(query)
      .select("-password")
      .skip(skip)
      .limit(Number(limit))
      .sort({ rating: -1 });

    const total = await Babysitter.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        babysitters,
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching babysitters",
      error: error.message,
    });
  }
};

exports.getBabysitterById = async (req, res) => {
  try {
    const babysitter = await Babysitter.findById(req.params.id)
      .select("-password")
      .populate({
        path: "reviews",
        populate: {
          path: "parent",
          select: "name photo",
        },
      });

    if (!babysitter) {
      return res.status(404).json({
        success: false,
        message: "Babysitter not found",
      });
    }

    res.status(200).json({
      success: true,
      data: babysitter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching babysitter details",
      error: error.message,
    });
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const { disponibilite, availability } = req.body;
    const babysitter = await Babysitter.findByIdAndUpdate(
      req.user.userId,
      {
        disponibilite,
        availability,
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      data: babysitter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating availability",
      error: error.message,
    });
  }
};

exports.getBabysitterReviews = async (req, res) => {
  try {
    const reviews = await Evaluation.find({ babysitter: req.params.id })
      .populate("parent", "name photo")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: error.message,
    });
  }
};
