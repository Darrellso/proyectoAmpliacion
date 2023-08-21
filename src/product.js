import { prices } from "./modules/prices";
import { getSoilName, getPotDescription, capitalize } from "./modules/names";

document.addEventListener("DOMContentLoaded", function() {
  const storedOrder = JSON.parse(localStorage.getItem("productPlants"));
  
  
  if(storedOrder) {
      document.getElementById("plant-image").src = `./Assets/plant-${storedOrder.plant}.png`;
      document.getElementById("pot-image").src = `./Assets/pots/${storedOrder.pot}.png`;
      document.getElementById("soil-image").src = `./Assets/soil-${storedOrder.soil}.png`;
      document.getElementById("extras-image").src = storedOrder.extras ? `./Assets/${storedOrder.extras}.png` : "";

      document.getElementById("plant-name").textContent = capitalize(storedOrder.plant);
      document.getElementById("soil-type").textContent = getSoilName(storedOrder.soil);
      document.getElementById("pot-description").textContent = getPotDescription(storedOrder.pot);
      document.getElementById("pot-color").textContent = storedOrder.pot.split('-').slice(-1)[0]; // Asume que el color es la última parte de la cadena
      document.getElementById("extras-list").textContent = storedOrder.extras;
  }
  function calculateTotalPrice(selection) {
    let total = 0;

    console.log(`Plant: ${selection.plant} - Price: ${prices.plants[selection.plant]}`);
    total += prices.plants[selection.plant];

    const potParts = selection.pot.split("-");
    const potDecoration = potParts[0];
    const potType = potParts[1];
    const potColor = potParts[2];
    
    let potPriceKey = `${potDecoration}-${potType}`;
    if(potColor && potColor !== 'unpainted') {
        potPriceKey += `-painted`;  // Esto hará, por ejemplo, 'decorated-clay-painted'
    }
    console.log(`Pot: ${potPriceKey} - Price: ${prices.pots[potPriceKey]}`);
    total += prices.pots[potPriceKey];

    console.log(`Soil: ${selection.soil} - Price: ${prices.soils[selection.soil]}`);
    total += prices.soils[selection.soil];

    if(selection.extras) {
        console.log(`Extra: ${selection.extras} - Price: ${prices.extras[selection.extras]}`);
        total += prices.extras[selection.extras];
    }

    return total;
}
function displayPriceBreakdown(selection) {
  const breakdownDiv = document.getElementById("price-breakdown");
  const totalDiv = document.getElementById("total-price");

  const total = calculateTotalPrice(selection);

  let breakdownHtml = `<ul>`;
  breakdownHtml += `<li>Plant (${prices.plants[selection.plant]}): ${selection.plant}</li>`;

  const potParts = selection.pot.split("-");
  const potDecoration = potParts[0];
  const potType = potParts[1];
  const potColor = potParts[2];
  let potPriceKey = `${potDecoration}-${potType}`;
  if(potColor && potColor !== 'unpainted') {
      potPriceKey += `-painted`;
  }
  breakdownHtml += `<li>Pot (${prices.pots[potPriceKey]}): ${potPriceKey}</li>`;

  breakdownHtml += `<li>Soil (${prices.soils[selection.soil]}): ${selection.soil}</li>`;
  
  if(selection.extras) {
      breakdownHtml += `<li>Extras (${prices.extras[selection.extras]}): ${selection.extras}</li>`;
  }

  breakdownHtml += `</ul>`;
  breakdownDiv.innerHTML = breakdownHtml;

  totalDiv.innerHTML = `Total: $${total.toFixed(2)}`;
  document.getElementById("price-total").textContent = `$${total}`
}

function convertToApiFormat(selectionItem) {
  const parts = selectionItem.split('-');
  if (parts.length === 3) {
      return `${parts[1]}-${parts[0]}-${parts[2]}`;
  }
  return selectionItem;
}

async function getInventory(productType, itemId) {
  const url = `https://qfble0gquj.execute-api.us-east-2.amazonaws.com/plant-store/inventory/${productType}/${itemId}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.stock; 
}

async function checkInventory(selection) {
  const alertDiv = document.getElementById('inventory-alert-message');
  const potItemId = convertToApiFormat(selection.pot)
  const inventoryElement = document.querySelector("#accordions-container details:nth-child(2) p");
  let alerts = '';


  let outOfStock = false;
  let limitedStock = false;

  const plantStock = await getInventory('plant', selection.plant);
  if (plantStock === 0) {
      alerts += `${capitalizeFirstLetter(selection.plant)} is out of stock. Please select a different plant.<br>`;
      outOfStock = true;
  } else if (plantStock < 10) {
      alerts += `${capitalizeFirstLetter(selection.plant)}: Only ${plantStock} items left in stock!<br>`
      limitedStock = true;
  }

  const potStock = await getInventory('pot', potItemId);
  if (potStock === 0) {
      alerts += `${convertToReadableFormat(selection.pot)} is out of stock. Please select a different pot.<br>`
      outOfStock = true;
  } else if (potStock < 10) {
      alerts += `${convertToReadableFormat(selection.pot)}: Only ${potStock} items left in stock!<br>`
      limitedStock = true;
  }

  const soilStock = await getInventory('soil', selection.soil);
  if (soilStock === 0) {
      alerts += `${capitalizeFirstLetter(selection.soil)} soil is out of stock. Please select a different soil.<br>`
      outOfStock = true;
  } else if (soilStock < 10) {
      alerts += `${capitalizeFirstLetter(selection.soil)} soil: Only ${soilStock} items left in stock!<br>`
      limitedStock = true;
  }

  if (alerts === '') {
    alerts = 'All items in your order are in stock.';
  }
  inventoryElement.innerHTML = alerts;

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function convertToReadableFormat(string) {
    const parts = string.split('-');
    return parts.map(part => capitalizeFirstLetter(part)).join(' ');
  }


  if (outOfStock) {
      alertDiv.innerHTML = 'One of the items in your order is out of stock. Please check the inventory alerts.';
      alertDiv.className = 'stock-out';
  } else if (limitedStock) {
      alertDiv.innerHTML = 'One of the items in your order has limited stock. Order soon!';
      alertDiv.className = 'stock-limited';
  } else {
      alertDiv.innerHTML = 'In Stock';
      alertDiv.className = 'stock-in';
  }
}

const storedProductPlants = JSON.parse(localStorage.getItem("productPlants"));
checkInventory(storedProductPlants);
displayPriceBreakdown(storedProductPlants);
const allDetails = document.querySelectorAll('details');

allDetails.forEach(detail => {
    detail.addEventListener('toggle', event => {
        if (detail.open) {
            allDetails.forEach(innerDetail => {
                if (innerDetail !== detail) {
                    innerDetail.removeAttribute('open');
                }
            });
        }
    });
});

async function getPlantInfo(plantId) {
  const apiUrl = "https://qfble0gquj.execute-api.us-east-2.amazonaws.com/plant-store/info";

  try {
      const response = await fetch(`${apiUrl}/${plantId}`);
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error fetching plant info:', error);
      return null;
  }
}

async function displayPlantInfo(plantId) {
  const plantData= await getPlantInfo(plantId);

  if (!plantData) {
      console.error('Failed to retrieve plant info');
      return;
  }



  const descriptionElement = document.querySelector("#accordions-container details:nth-child(3) p");
  descriptionElement.textContent = plantData.description;

      document.getElementById("light-text").textContent = plantData.care.light;
      document.getElementById("water-text").textContent = plantData.care.water;
      document.getElementById("humidity-text").textContent = plantData.care.humidity;
      document.getElementById("temperature-text").textContent = plantData.care.temperature;
  
}


displayPlantInfo(storedOrder.plant.replace(/-\s/g, ''));

});

document.getElementById("back-to-customization").addEventListener("click", function() {
  window.location.href = "customization.html";
});