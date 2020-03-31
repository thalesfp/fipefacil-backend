const vehicleType = {
  car: 1,
  motorcycle: 2,
};

const vehicleTypeToString = (vehicleTypeParam) => {
  switch (vehicleTypeParam) {
    case vehicleType.car:
      return "cars";
    case vehicleType.motorcycle:
      return "motorcycles";
    default:
      throw new Error(`Invalid vehicle type: ${vehicleTypeParam}`);
  }
};

module.exports = { vehicleType, vehicleTypeToString };
