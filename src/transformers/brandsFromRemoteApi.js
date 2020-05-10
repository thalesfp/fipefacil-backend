const normalizeBrandName = (brandName) => {
  switch (brandName) {
    case "AM Gen":
      return "AM General";
    case "ASTON MARTIN":
      return "Aston Martin";
    case "CHANA":
      return "Chana";
    case "CHANGAN":
      return "Changan";
    case "CHERY":
      return "Chery";
    case "EFFA":
      return "Effa";
    case "FOTON":
      return "Foton";
    case "GEELY":
      return "Geely";
    case "GREAT WALL":
      return "Great Wall";
    case "HAFEI":
      return "Hafei";
    case "HITECH ELECTRIC":
      return "Hitech Electric";
    case "JINBEI":
      return "Jinbei";
    case "LAMBORGHINI":
      return "Lamborghini";
    case "LIFAN":
      return "Lifan";
    case "LOBINI":
      return "Lobini";
    case "RELY":
      return "Rely";
    case "SHINERAY":
      return "Shineray";
    case "smart":
      return "Smart";
    case "SSANGYONG":
      return "SsangYong";
    case "VW - VolksWagen":
      return "Volkswagen";
    default:
      return brandName;
  }
};

const isPopularBrand = (brandName) =>
  [
    "GM - Chevrolet",
    "Volkswagen",
    "Fiat",
    "Renault",
    "Ford",
    "Toyota",
    "Hyundai",
    "Jeep",
    "Honda",
    "Nissan",
    "Citroën",
    "Mitsubishi",
    "Peugeot",
    "Chery",
    "BMW",
    "Mercedes-Benz",
    "Kia Motors",
    "Audi",
    "Volvo",
    "Land Rover",
  ].includes(brandName);

module.exports = {
  normalizeBrandName,
  isPopularBrand,
};
