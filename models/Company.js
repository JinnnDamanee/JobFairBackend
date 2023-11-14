const mongoose = require("mongoose");
const CompanySchema = new mongoose.Schema(
    {
        // eg. "Google"
        name: {
            type: String,
            required: [true, "Please add a name"],
            unique: true,
            trim: true,
            maxlength: [20, "Name cannot be more than 20 characters"],
        },
        // eg. "Software Engineer"
        position: {
            type: String,
            required: [true, "Please add a position"],
            trim: true,
            maxlength: [20, "Position cannot be more than 20 characters"],
        },
        jd: {
            type: String,
            required: [true, "Please add a job description"],
            trim: true,
            maxlength: [
                500,
                "Job description cannot be more than 500 characters",
            ],
        },
        // eg. "London"
        location: {
            type: String,
            required: [true, "Please add an location"],
        },
        tel: {
            type: String,
            required: [true, "Please add a telephone number"],
        },
        image: {
            type: String,
            required: [true, "Please add URL to company picture"],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);
// Cascade delete bookings when a company is deleted
CompanySchema.pre("remove", async function (next) {
    console.log(`Booking being removed from company ${this._id}`);
    await this.model("Booking").deleteMany({ company: this._id });
    next();
});
// Reverse populate with virtuals
CompanySchema.virtual("bookings", {
    ref: "Booking",
    localField: "_id",
    foreignField: "company",
    justOne: false,
});
module.exports = mongoose.model("Company", CompanySchema);
