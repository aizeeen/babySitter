const express = require("express");
const {
  createReservation,
  getReservations,
  updateReservationStatus,
  deleteReservation
} = require("../Controllers/ReservationController");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

// Define routes with their handlers
router.post("/", authMiddleware, createReservation);
router.get("/", authMiddleware, getReservations);
router.patch("/:id/status", authMiddleware, updateReservationStatus);
router.delete("/:id", authMiddleware, deleteReservation);

module.exports = router;
