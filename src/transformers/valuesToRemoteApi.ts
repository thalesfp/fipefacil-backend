import VehicleType from "../types/VehicleType";

export const vehicleTypeToNumber = (vehicleType: VehicleType): number => {
  switch (vehicleType) {
    case VehicleType.car:
      return 1;
    case VehicleType.motorcycle:
      return 2;
    case VehicleType.trucks:
      return 3;
    default:
      throw new Error(`Invalid vehicle type: ${vehicleType}`);
  }
};
