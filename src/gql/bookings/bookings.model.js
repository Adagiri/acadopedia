const getAllBookings = () => {
  return [
    {
      id: "123444",
      name: "adagiri",
      date: "2020-19-09",
    },
    {
      id: "123444",
      name: "adagiri",
      date: "2020-19-09",
    },
    {
      id: "123444",
      name: "adagiri",
      date: "2020-19-09",
    },
  ];
};

const getBookingsByDate = () => {
  return [
    {
      id: "123444",
      name: "adagiri",
      date: "2020-19-09",
    },
  ];
};

const getBooking = (id) => {
  // do something with the id
  return {
    id: "123444",
    name: "adagiri",
    date: "2020-19-09",
  };
};

module.exports = {
  getAllBookings,
  getBookingsByDate,
  getBooking,
};
