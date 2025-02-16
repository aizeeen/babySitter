const Reservation = require("../Models/Reservation");
const Babysitter = require("../Models/Babysitter");
const Parent = require("../Models/Parent");


const ReservationController = {
  createReservation: async (req, res) => {
    try {
      console.log('Received reservation request:', req.body);
      const { babysitter, date, time, duration, description } = req.body;
      
      // Get babysitter to calculate total
      const babysitterDoc = await Babysitter.findById(babysitter);
      if (!babysitterDoc) {
        return res.status(404).json({
          success: false,
          message: "Babysitter not found"
        });
      }

      // Calculate total cost
      const totale = babysitterDoc.tarif * duration;

      const reservation = new Reservation({
        babysitter,
        parent: req.user._id,
        date,
        time,
        duration,
        description,
        totale,
        status: 'pending'
      });

      await reservation.save();

      // Populate the saved reservation with babysitter and parent details
      await reservation.populate('babysitter', 'name photo');
      await reservation.populate('parent', 'name photo');

      res.status(201).json({
        success: true,
        message: "Reservation created successfully",
        data: reservation
      });
    } catch (error) {
      console.error('Create reservation error:', error);
      res.status(500).json({
        success: false,
        message: "Error creating reservation",
        error: error.message
      });
    }
  },

  getReservations: async (req, res) => {
    try {
      const { role, _id } = req.user;
      const query = role === "parent" ? { parent: _id } : { babysitter: _id };

      const reservations = await Reservation.find(query)
        .populate('babysitter', 'name photo')
        .populate('parent', 'name')
        .sort({ date: -1 });

      res.status(200).json(reservations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching reservations", error });
    }
  },

  updateReservationStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const reservation = await Reservation.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      )
      .populate('babysitter', 'name photo')
      .populate('parent', 'name');

      if (!reservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }

      res.status(200).json(reservation);
    } catch (error) {
      res.status(500).json({ message: "Error updating reservation", error });
    }
  },

  deleteReservation: async (req, res) => {
    try {
      const { id } = req.params;
      const reservation = await Reservation.findByIdAndDelete(id);
      
      if (!reservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }

      res.status(200).json({ message: "Reservation deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting reservation", error });
    }
  }
};

module.exports = ReservationController;
