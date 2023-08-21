//index-js
import { RecommendationBuilder } from "./modules/builder.js";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("plant-form");
  const resultDiv = document.getElementById("result");

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar el envío del formulario

    // Obtener respuestas del formulario
    const light = document.querySelector('input[name="light"]:checked').value;
    const sunlight = document.querySelector(
      'input[name="sunlight"]:checked',
    ).value;
    const pets = document.querySelector('input[name="pets"]:checked').value;
    const watering = document.querySelector(
      'input[name="watering"]:checked',
    ).value;
    const style = document.querySelector('input[name="style"]:checked').value;
    const elements = Array.from(
      document.querySelectorAll('input[name="elements"]:checked'),
    ).map((el) => el.value);

    // Construir objeto de recomendación
    const recommendation = RecommendationBuilder.withLight(light)
      .withSunlight(sunlight)
      .withPets(pets)
      .withWatering(watering)
      .withStyle(style)
      .withElements(elements)
      .build();

    // Mostrar la ficha de planta en resultDiv
    resultDiv.innerHTML = "";
    const recommendationCard = recommendation.render();
    resultDiv.appendChild(recommendationCard);

    // Agregar el botón "Customize"
    const customizeButton = document.createElement("button");
    customizeButton.textContent = "Customize";
    customizeButton.addEventListener("click", function () {
      window.location.href = "customization.html"; // Redirigir a la vista de personalización
    });
    resultDiv.appendChild(customizeButton);
  });

  const clearButton = document.getElementById("clear-button");
  clearButton.addEventListener("click", function () {
    form.reset();
    resultDiv.innerHTML = ""; // Limpiar resultados anteriores
  });
});
