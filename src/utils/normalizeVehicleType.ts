import VehicleType from "../types/VehicleType";

export const stringToVehicleType = (vehicleType: string): VehicleType => {
  switch (vehicleType) {
    case VehicleType.car.toString():
      return VehicleType.car;
    case VehicleType.motorcycle.toString():
      return VehicleType.motorcycle;
    case VehicleType.truck.toString():
      return VehicleType.truck;
    default:
      throw new Error(`Invalid VehicleType: ${vehicleType}`);
  }
};

export const vehicleTypeToInteger = (vehicleType: VehicleType): number => {
  switch (vehicleType) {
    case VehicleType.car:
      return 1;
    case VehicleType.motorcycle:
      return 2;
    case VehicleType.truck:
      return 3;
  }
};
