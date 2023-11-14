const Booking = require("../models/Booking");
const Company = require("../models/Company");
const User = require("../models/User");
const { sendMail } = require("./mails");

// exports.getBookings = async (req, res) => {
//     let query;
//     let companyId = req.query["companyId"];
//     if (req.user.role !== "admin") {
//         if (companyId) {
//             query = Booking.find({
//                 user: req.user.id,
//                 company: companyId,
//             }).populate({
//                 path: "company",
//                 select: "name address tel",
//             });
//         } else {
//             query = Booking.find({
//                 user: req.user.id,
//             }).populate({
//                 path: "company",
//                 select: "name address tel",
//             });
//         }
//     } else {
//         if (companyId) {
//             query = Booking.find({ company: companyId })
//                 .populate({
//                     path: "company",
//                     select: "name address tel",
//                 })
//                 .populate({
//                     path: "user",
//                     select: "name email tel",
//                 });
//         } else {
//             query = Booking.find()
//                 .populate({
//                     path: "company",
//                     select: "name address tel",
//                 })
//                 .populate({
//                     path: "user",
//                     select: "name email tel",
//                 });
//         }
//     }
//     try {
//         const bookings = await query;
//         res.status(200).json({
//             success: true,
//             count: bookings.length,
//             data: bookings,
//         });
//     } catch (error) {
//         console.log(error);
//         return res
//             .status(500)
//             .json({ success: false, message: "Cannot find Booking" });
//     }
// };

//@desc     Get all bookings
//@route    GET /api/v1/bookings
//@access   Private
exports.getBookings = async (req, res) => {
    let query;
    if (req.user.role !== "admin") {
        query = Booking.find({
            user: req.user.id,
        }).populate({
            path: "company",
            select: "name address tel",
        });

        query = Booking.find({
            user: req.user.id,
        }).populate({
            path: "company",
            select: "name address tel",
        });
    } else {
        query = Booking.find()
            .populate({
                path: "company",
                select: "name address tel",
            })
            .populate({
                path: "user",
                select: "name email tel",
            });
    }
    try {
        const bookings = await query;
        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: "Cannot find Booking" });
    }
};

// @desc    Get bookings by company
// @route   GET /api/v1/bookings/companies/:id
// @access  Private
exports.getBookingsByCompany = async (req, res) => {
    let query;
    const companyId = req.params.id;
    if (!companyId) {
        return res.status(400).json({
            success: false,
            message: "Please provide company id",
        });
    }
    if (companyId.length !== 24) {
        return res.status(400).json({
            success: false,
            message: "Please provide valid company id",
        });
    }

    if (req.user.role !== "admin") {
        query = Booking.find({
            user: req.user.id,
            company: companyId,
        }).populate({
            path: "company",
            select: "name address tel",
        });
    } else {
        query = Booking.find({ company: companyId })
            .populate({
                path: "company",
                select: "name address tel",
            })
            .populate({
                path: "user",
                select: "name email tel",
            });
    }
    try {
        const bookings = await query;
        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: "Cannot find Booking" });
    }
};

// @desc    Get bookings by user
// @route   GET /api/v1/bookings/users/:id
// @access  Private
exports.getBookingsByUser = async (req, res) => {
    let query;
    const userId = req.params.id;
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "Please provide user id",
        });
    }
    if (userId.length !== 24) {
        return res.status(400).json({
            success: false,
            message: "Please provide valid user id",
        });
    }
    query = Booking.find({ user: userId }).populate({
        path: "company",
        select: "name address tel",
    });
    try {
        const bookings = await query;
        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: "Cannot find Booking" });
    }
};

//@desc     Get single booking
//@route    GET /api/v1/bookings/:id
//@access   Private
exports.getBooking = async (req, res) => {
    let booking;
    try {
        booking = await Booking.findById(req.params.id)
            .populate({
                path: "company",
                select: "name address tel",
            })
            .populate({
                path: "user",
                select: "name email tel",
            });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: `No booking with the id of ${req.params.id}`,
            });
        }

        if (
            booking.user.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to view this booking`,
            });
        }

        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: "Cannot find Booking" });
    }
};

//@desc     Add booking
//@route    POST /api/v1/companies/:companyId/bookings
//@access   Private
exports.addBooking = async (req, res) => {
    try {
        req.body.company = req.params.companyId;
        const company = await Company.findById(req.params.companyId);
        if (!company) {
            return res.status(404).json({
                success: false,
                message: `No company with the id of ${req.params.companyId}`,
            });
        }
        req.body.user = req.user.id;

        // only allow the registered user to book up to 3 nights
        const bookingDate = new Date(req.body.bookingDate);
        const existedBookings = await Booking.find({ user: req.user.id });

        if (existedBookings.length >= 3) {
            return res.status(400).json({
                success: false,
                message: `The user with ID ${req.user.id} has already made 3 bookings`,
            });
        } else {
            const booking = await Booking.create(req.body);
            res.status(200).json({
                success: true,
                data: booking,
            });

            User.findById(req.user.id, function (err, user) {
                if (err) {
                    console.log(err);
                } else {
                    sendMail(user, booking);
                }
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot create Booking",
        });
    }
};

//@desc     Update booking
//@route    PUT /api/v1/bookings/:id
//@access   Private
exports.updateBooking = async (req, res) => {
    try {
        let booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: `No booking with the id of ${req.params.id}`,
            });
        }
        if (
            booking.user.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to update this booking`,
            });
        }

        booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot update Booking",
        });
    }
};

//@desc     Delete booking
//@route    DELETE /api/v1/bookings/:id
//@access   Private
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: `No booking with the id of ${req.params.id}`,
            });
        }
        if (
            booking.user.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to delete this booking`,
            });
        }
        await booking.remove();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot delete Booking",
        });
    }
};
