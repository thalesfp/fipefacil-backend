import VehicleType from "../types/VehicleType";

const vehicleTypeToString = (vehicleTypeParam: VehicleType): string => {
  switch (vehicleTypeParam) {
    case VehicleType.car:
      return "cars";
    case VehicleType.motorcycle:
      return "motorcycles";
    case VehicleType.trucks:
      return "trucks";
    default:
      throw new Error(`Invalid vehicle type: ${vehicleTypeParam}`);
  }
};

export default vehicleTypeToString;
