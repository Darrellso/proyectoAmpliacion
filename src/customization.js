// Importar la clase RecommendationBuilder
import { RecommendationBuilder } from "./modules/builder.js";
import { Subject, Observer } from './modules/observer.js';

// Obtener elementos del DOM
const customizationForm = document.getElementById("customization-form");
const potDecorationsToggle = document.getElementById("pot-decorations-toggle");
const pottype = document.querySelectorAll('input[name="pot"]');
const potColorToggle = document.getElementById("pot-color-toggle");
const potColorOptionsList = document.getElementById("pot-color-options-list");
const plantSelect = document.getElementById("plant");
const plantPreviewDiv = document.getElementById("plant-preview");
const orderInfoDiv = document.getElementById("order-info");
const imageContainer = document.getElementById("image-container");

// Acceder al objeto almacenado en localStorage
const storedRecommendation = JSON.parse(localStorage.getItem("localPlant"));
const customizationSubject = new Subject();

const logObserver = new Observer((updatedData) => {
  console.log("Data has been updated!", updatedData);
});

customizationSubject.addObserver(logObserver)

// Evento de cambio en el toggle de pot color
potColorToggle.addEventListener("change", function () {
  if (potColorToggle.checked) {
    potColorOptionsList.style.display = "block";
  } else {
    potColorOptionsList.style.display = "none";
  }
});

// Obtener el botón "Check store availability"
const checkStoreButton = document.getElementById("check-store-button");

// Agregar evento de clic al botón
checkStoreButton.addEventListener("click", () => {
  // Redirigir al usuario al view de producto (product.html)
  window.location.href = "product.html";
});

// Evento de submit del formulario de personalización
customizationForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Evitar el envío del formulario

  // Obtener respuestas del formulario de personalización
  const pot = document.querySelector('input[name="pot"]:checked').value;
  const potDecorations = potDecorationsToggle.checked ? "Yes" : "No";
  const potColor = potColorToggle.checked
    ? document.querySelector('input[name="pot-color"]:checked').value
    : "No";
  const plant = plantSelect.value;
  const soil = document.querySelector('input[name="soil"]:checked').value;
  const extras = Array.from(
    document.querySelectorAll('input[name="extras"]:checked'),
  ).map((el) => el.value);

  // Construir objeto de recomendación personalizada
  const customizedRecommendation = RecommendationBuilder.withPot(pot)
    .withPotDecorations(potDecorations)
    .withPotColor(potColor)
    .withPlant(plant)
    .withSoil(soil)
    .withExtras(extras)
    .build();

  // Actualizar la vista de preview de planta
  plantPreviewDiv.innerHTML = "";
  const plantPreviewCard = customizedRecommendation.render();
  plantPreviewDiv.appendChild(plantPreviewCard);

  // Actualizar la vista de información de la orden
  orderInfoDiv.innerHTML = "";
  const orderInfo = customizedRecommendation.getOrderInfo();
  orderInfoDiv.appendChild(orderInfo);
});

// Crear elementos de imagen y asignar atributos
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

let potValue = storedRecommendation.potImage ;

pottype.forEach(pottype => {
    pottype.addEventListener('change', (event) => {
        const selectedValue = event.target.value;
        potValue=selectedValue
        updatePreview()
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

// Función para actualizar la vista previa de las imágenes  
function updatePreview() {
  const potDecorations = potDecorationsToggle.checked ? "Yes" : "No";
  const potColor = potColorToggle.checked ? "Yes" : "No";
  const plant = plantSelect.value;
  const pottypes = potValue;
  const soilFinal = soilvalue;
  const potColorValue = potColorToggle.checked ? document.querySelector('input[name="pot-color"]:checked').value : "unpainted";
  const extrasValues = Array.from(document.querySelectorAll('input[name="extras"]:checked')).map(el => el.value);
  const firstExtraImage = extrasValues.length > 0 ? extrasValues[0] : "";

  // Define el objeto con la información actualizada
  const updatedInfo = {
      plant: plant,
      pot: `${potDecorations === "Yes" ? "decorated" : "simple"}-${pottypes}-${potColorValue}`,
      soil: soilFinal,
      extras: firstExtraImage
  };

  // Actualiza las imágenes en la vista previa
  plantImage.src = `./Assets/plant-${plant}.png`;
  potImage.src = `./Assets/pots/${updatedInfo.pot}.png`;
  soilImage.src = `./Assets/soil-${soilFinal}.png`;
  extrasImage.src = firstExtraImage ? `./Assets/${firstExtraImage}.png` : "";

  // Devuelve el objeto con la información actualizada
  customizationSubject.notifyObservers(updatedInfo);
  return updatedInfo;
}

checkStoreButton.addEventListener("click", () => {
  const updatedProductInfo = updatePreview();
  localStorage.setItem("productPlants", JSON.stringify(updatedProductInfo));
  window.location.href = "product.html";
});