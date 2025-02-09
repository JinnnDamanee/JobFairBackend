/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       required:
 *         - bookingDate
 *         - user
 *         - company
 *       properties:
 *         bookingDate:
 *           type: string
 *           format: date
 *           example: '2023-08-20'
 *           description: Interview Date
 *         user:
 *           type: string
 *           description: ID of the user making the booking
 *         company:
 *           type: string
 *           description: ID of the company being booked
 *         createdAt:
 *           type: string
 *           format: date
 *           example: '2023-08-20'
 *           description: The date of the creation of the booking
 *
 */

/**
 * @swagger
 * components:
 *   requestBodies:
 *     BookingBody:
 *       type: object
 *       required:
 *         - bookingDate
 *       properties:
 *         bookingDate:
 *           type: string
 *           format: date
 *           example: '2023-08-20'
 *           description: Interview Date
 */

const express = require("express");
const {
  getBookings,
  getBooking,
  addBooking,
  updateBooking,
  deleteBooking,
  getBookingsByUser,
  getBookingsByCompany,
} = require("../controllers/bookings");

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: The booking managing API
 */

const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../middleware/auth");

/**
 * @swagger
 * /bookings:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Returns the list of all the bookings
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: The list of the bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *               $ref: '#/components/schemas/Booking'
 */

/**
 * @swagger
 * /companies/{companyId}/bookings:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new Booking for the company specified by company id
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         schema:
 *           type: string
 *         required: true
 *         description: The company id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/requestBodies/BookingBody'
 *     responses:
 *       201:
 *         description: The booking was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       500:
 *         description: Some server error
 */

router
  .route("/")
  .get(protect, getBookings)
  .post(protect, authorize("admin", "user"), addBooking);

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get the booking by id
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The booking id
 *     responses:
 *       200:
 *         description: The booking information by booking id
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       404:
 *         description: The booking was not found
 */

/**
 * @swagger
 * /bookings/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update the booking by id
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The booking id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/requestBodies/BookingBody'
 *     responses:
 *       200:
 *         description: The booking was successfully updated
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       404:
 *         description: The booking was not found
 */

/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete the booking by id
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The booking id
 *     responses:
 *       200:
 *         description: The booking was successfully deleted
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       404:
 *         description: The booking was not found
 */

router
  .route("/:id")
  .get(protect, getBooking)
  .put(protect, authorize("admin", "user"), updateBooking)
  .delete(protect, authorize("admin", "user"), deleteBooking);

/**
 * @swagger
 * /bookings/users/{userId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Returns the list of all the bookings by user id
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The list of the bookings by user id
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *               $ref: '#/components/schemas/Booking'
 */

/**
 * @swagger
 * /bookings/companies/{companyId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Returns the list of all the bookings by company id
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         schema:
 *           type: string
 *         required: true
 *         description: The company id
 *     responses:
 *       200:
 *         description: The list of the bookings by company id
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *               $ref: '#/components/schemas/Booking'
 */

router.get("/users/:id", protect, getBookingsByUser);
router.get("/companies/:id", getBookingsByCompany);

module.exports = router;
