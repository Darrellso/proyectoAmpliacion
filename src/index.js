//index-js
import { RecommendationBuilder } from "./modules/builder.js";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("plant-form");
  const resultDiv = document.getElementById("result");

  form.addEventListener("submit", function (event) {
    event.preventDefault(); 

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

    const recommendation = RecommendationBuilder.withLight(light)
      .withSunlight(sunlight)
      .withPets(pets)
      .withWatering(watering)
      .withStyle(style)
      .withElements(elements)
      .build();

    resultDiv.innerHTML = "";
    const recommendationCard = recommendation.render();
    resultDiv.appendChild(recommendationCard);

    const customizeButton = document.createElement("button");
    customizeButton.textContent = "Customize";
    customizeButton.addEventListener("click", function () {
      window.location.href = "customization.html"; 
    });
    resultDiv.appendChild(customizeButton);
  });

  const clearButton = document.getElementById("clear-button");
  clearButton.addEventListener("click", function () {
    form.reset();
    resultDiv.innerHTML = "";
  });
});
