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

export const numberToVehicleType = (vehicleType: number): VehicleType => {
  switch (vehicleType) {
    case 1:
      return VehicleType.car;
    case 2:
      return VehicleType.motorcycle;
    case 3:
      return VehicleType.trucks;
    default:
      throw new Error(`Invalid vehicle type: ${vehicleType}`);
  }
};
