const Reservation = require("../Models/Reservation");
const Babysitter = require("../Models/Babysitter");
const Parent = require("../Models/Parent");

// Create a single object to hold all controller functions
const ReservationController = {
  createReservation: async (req, res) => {
    try {
      console.log('Received reservation data:', req.body);

      const { 
        babysitterId, 
        date, 
        time, 
        duration, 
        description 
      } = req.body;

      // Get parent ID from authenticated user
      const parentId = req.user._id;

      // Validate babysitter exists
      const babysitter = await Babysitter.findById(babysitterId);
      if (!babysitter) {
        return res.status(404).json({ message: "Babysitter not found" });
      }

      // Calculate total cost
      const totale = babysitter.tarif * duration;

      // Create new reservation
      const reservation = new Reservation({
        date: new Date(date),
        time,
        duration: parseInt(duration),
        babysitter: babysitterId,
        parent: parentId,
        description,
        totale,
        status: 'pending'
      });

      console.log('Creating reservation:', reservation);

      await reservation.save();

      // Populate babysitter and parent details
      await reservation.populate([
        { path: 'babysitter', select: 'name photo' },
        { path: 'parent', select: 'name' }
      ]);

      res.status(201).json({
        message: "Reservation created successfully",
        reservation
      });
    } catch (error) {
      console.error("Error creating reservation:", error);
      res.status(500).json({ 
        message: "Error creating reservation", 
        error: error.message,
        stack: error.stack 
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

// Export the controller object
module.exports = ReservationController;
