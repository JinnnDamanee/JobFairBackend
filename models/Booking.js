const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    bookingDate: {
        // start date
        // end date will 1 hour after start date
        type: Date,
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    company: {
        type: mongoose.Schema.ObjectId,
        ref: "Company",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Booking", BookingSchema);
