export function getSoilName(soilType) {
  const soilNames = {
    drainage: "Drainage Soil",
    composted: "Composted Soil",
    fertilized: "Fertilized Soil",
  };
  return soilNames[soilType];
}

export function getPotDescription(potType) {
  const parts = potType.split("-");
  let description = "";

  if (parts[0] === "decorated") {
    description += capitalize(parts[1]) + " pot with decorations";
  } else {
    description += capitalize(parts[1]) + " pot simple";
  }

  return description;
}
export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
