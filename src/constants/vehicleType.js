const vehicleType = {
  car: 1,
  motorcycle: 2,
  trucks: 3,
};

const vehicleTypeToString = (vehicleTypeParam) => {
  switch (vehicleTypeParam) {
    case vehicleType.car:
      return "cars";
    case vehicleType.motorcycle:
      return "motorcycles";
    case vehicleType.trucks:
      return "trucks";
    default:
      throw new Error(`Invalid vehicle type: ${vehicleTypeParam}`);
  }
};

module.exports = { vehicleType, vehicleTypeToString };
