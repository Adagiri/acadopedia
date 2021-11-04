const bookingsModel = require("./bookings.model");
module.exports = {
  Query: {
    bookings: () => {
      return bookingsModel.getAllBookings();
    },
    bookingsByDate: (_, args) => {
      return bookingsModel.getBookingsByDate(args.date);
    },
    booking: (_, args) => {
      return bookingsModel.getBooking(args.id);
    },
  },
};
