import { RecommendationBuilder } from "./modules/builder.js";
import { Subject, Observer } from "./modules/observer.js";

const customizationForm = document.getElementById("customization-form");
const potDecorationsToggle = document.getElementById("pot-decorations-toggle");
const pottype = document.querySelectorAll('input[name="pot"]');
const potColorToggle = document.getElementById("pot-color-toggle");
const potColorOptionsList = document.getElementById("pot-color-options-list");
const plantSelect = document.getElementById("plant");
const plantPreviewDiv = document.getElementById("plant-preview");
const orderInfoDiv = document.getElementById("order-info");
const imageContainer = document.getElementById("image-container");

const storedRecommendation = JSON.parse(localStorage.getItem("localPlant"));
const customizationSubject = new Subject();

const logObserver = new Observer((updatedData) => {
  console.log("Data has been updated!", updatedData);
});

customizationSubject.addObserver(logObserver);

potColorToggle.addEventListener("change", function () {
  if (potColorToggle.checked) {
    potColorOptionsList.style.display = "block";
  } else {
    potColorOptionsList.style.display = "none";
  }
});

const checkStoreButton = document.getElementById("check-store-button");

checkStoreButton.addEventListener("click", () => {
  window.location.href = "product.html";
});

customizationForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Evitar el envío del formulario

  const pot = document.querySelector('input[name="pot"]:checked').value;
  const potDecorations = potDecorationsToggle.checked ? "Yes" : "No";
  const potColor = potColorToggle.checked
    ? document.querySelector('input[name="pot-color"]:checked').value
    : "No";
  const plant = plantSelect.value;
  const soil = document.querySelector('input[name="soil"]:checked').value;
  const extras = Array.from(
    document.querySelectorAll('input[name="extras"]:checked')
  ).map((el) => el.value);

  const customizedRecommendation = RecommendationBuilder.withPot(pot)
    .withPotDecorations(potDecorations)
    .withPotColor(potColor)
    .withPlant(plant)
    .withSoil(soil)
    .withExtras(extras)
    .build();

  plantPreviewDiv.innerHTML = "";
  const plantPreviewCard = customizedRecommendation.render();
  plantPreviewDiv.appendChild(plantPreviewCard);

  orderInfoDiv.innerHTML = "";
  const orderInfo = customizedRecommendation.getOrderInfo();
  orderInfoDiv.appendChild(orderInfo);
});

const plantImage = document.createElement("img");
plantImage.alt = storedRecommendation.plantName;
imageContainer.appendChild(plantImage);

const potImage = document.createElement("img");
potImage.alt = "Pot Image";
imageContainer.appendChild(potImage);

const soilImage = document.createElement("img");
soilImage.alt = "Soil Image";
imageContainer.appendChild(soilImage);

const extrasImage = document.createElement("img");
extrasImage.alt = "Extras Image";
imageContainer.appendChild(extrasImage);

let potValue = storedRecommendation.potImage;

pottype.forEach((pottype) => {
  pottype.addEventListener("change", (event) => {
    const selectedValue = event.target.value;
    potValue = selectedValue;
    updatePreview();
  });
});
const soiltype = document.querySelectorAll('input[name="soil"]');
let soilvalue = storedRecommendation.soilImage;
soiltype.forEach((soiltype) => {
  soiltype.addEventListener("change", (event) => {
    const selectedValue = event.target.value;
    soilvalue = selectedValue;
    updatePreview();
  });
});

const potColor = document.querySelectorAll('input[name="pot-color"]');
potColor.forEach((potColor) => {
  potColor.addEventListener("change", (event) => {
    const selectedValue = event.target.value;
  });
});

potDecorationsToggle.addEventListener("change", updatePreview);
plantSelect.addEventListener("change", updatePreview);

function updatePreview() {
  const potDecorations = potDecorationsToggle.checked ? "Yes" : "No";
  const potColor = potColorToggle.checked ? "Yes" : "No";
  const plant = plantSelect.value;
  const pottypes = potValue;
  const soilFinal = soilvalue;
  const potColorValue = potColorToggle.checked
    ? document.querySelector('input[name="pot-color"]:checked').value
    : "unpainted";
  const extrasValues = Array.from(
    document.querySelectorAll('input[name="extras"]:checked')
  ).map((el) => el.value);
  const firstExtraImage = extrasValues.length > 0 ? extrasValues[0] : "";

  const updatedInfo = {
    plant: plant,
    pot: `${
      potDecorations === "Yes" ? "decorated" : "simple"
    }-${pottypes}-${potColorValue}`,
    soil: soilFinal,
    extras: firstExtraImage,
  };

  plantImage.src = `./Assets/plant-${plant}.png`;
  potImage.src = `./Assets/pots/${updatedInfo.pot}.png`;
  soilImage.src = `./Assets/soil-${soilFinal}.png`;
  extrasImage.src = firstExtraImage ? `./Assets/${firstExtraImage}.png` : "";

  customizationSubject.notifyObservers(updatedInfo);
  return updatedInfo;
}

checkStoreButton.addEventListener("click", () => {
  const updatedProductInfo = updatePreview();
  localStorage.setItem("productPlants", JSON.stringify(updatedProductInfo));
  window.location.href = "product.html";
});
