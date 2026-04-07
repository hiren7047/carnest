export const brands = [
  "Mercedes-Benz",
  "BMW",
  "Audi",
  "Porsche",
  "Toyota",
  "Land Rover",
  "Volvo",
  "Jaguar",
  "Lexus",
  "Tesla",
  "Honda",
  "Maruti Suzuki",
  "MG",
  "Hyundai",
  "Tata",
];

export const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"];

export const transmissions = ["Automatic", "Manual"];

export const locations = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Pune", "Chennai"];

const yEnd = new Date().getFullYear();
const yStart = 2010;
export const modelYears: string[] = Array.from({ length: yEnd - yStart + 1 }, (_, i) =>
  String(yEnd - i)
);

export const bodyTypes = ["Sedan", "SUV", "Hatchback", "Coupe", "Convertible"];
