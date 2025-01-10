const bcPlaceNameApiUrl =
  "https://geogratis.gc.ca/services/geolocation/en/locate?q=,%20BC";

const laserIcon = L.icon({
  iconUrl: "images/laser.png",
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

document.getElementById("getPlanetInfo").addEventListener("click", emptyPlanCheck);
document.getElementById("getCharacterInfo").addEventListener("click", () => {
  displayCharacter(document.getElementById("characterInput").value);
});

async function getCoordinates() {
  try {
    const response = await fetch(bcPlaceNameApiUrl);
    const data = await response.json();
    const coordinatesArray = [];
    data.forEach((item) => {
      const names = item.title;
      const latitude = item.geometry.coordinates[1];
      const longitude = item.geometry.coordinates[0];

      coordinatesArray.push({ latitude, longitude, names });
    });
    coordinatesArray.forEach((item) => {
      L.marker([item.latitude, item.longitude], { icon: laserIcon })
        .addTo(myMap)
        .bindPopup(item.names, item.population);
    });
  } catch (error) {
    console.error("ERROR:", error);
  }
}

async function fetchAllCharacters() {
  const allCharacters = [];
  let nextPage = "https://www.swapi.tech/api/people/";

  while (nextPage) {
    const response = await fetch(nextPage);
    const data = await response.json();

    // Add characters to the array
    allCharacters.push(...data.results);

    // Get the next page URL
    nextPage = data.next;
  }

  return allCharacters;
}

async function displayCharacter(characterName) {
  try {
    // Fetch all characters
    const allCharacters = await fetchAllCharacters();

    // Filter characters by name
    const matchedCharacters = allCharacters.filter((character) =>
      character.name.toLowerCase().includes(characterName.toLowerCase())
    );

    if (matchedCharacters.length === 0) {
      alert(`No character found with the name "${characterName}"`);
      return;
    }

    // Fetch detailed information for the first match
    const characterUrl = matchedCharacters[0].url;
    const characterDetailResponse = await fetch(characterUrl);
    const characterDetailData = await characterDetailResponse.json();

    const character = characterDetailData.result.properties;

    const characterInfo = `
      <ul>
        <li>Name: ${character.name}</li>
        <li>Hair Color: ${character.hair_color}</li>
        <li>Eye Color: ${character.eye_color}</li>
        <li>Birth Year: ${character.birth_year}</li>
        <li>Gender: ${character.gender}</li>
        <li>Height: ${character.height} cm</li>
        <li>Mass: ${character.mass} kg</li>
      </ul>
    `;

    document.getElementById("characterInfo").innerHTML = characterInfo;
  } catch (error) {
    console.error("Error fetching character details:", error);
  }
}

async function displayPlanet(planetName) {
  const response = await fetch(`https://swapi.dev/api/planets/?search=${planetName}`);
  const data = await response.json();
  if (data.count === 0) {
    alert(`No planet found with the name ${planetName}`);
  } else {
    const planet = data.results[0];
    const planetInfo = `
    <li>Name: ${planet.name}</li>
    <li>Climate: ${planet.climate}</li>
    <li>Terrain: ${planet.terrain}</li>
    <li>Population: ${planet.population}</li>
    <li>Gravity: ${planet.gravity}</li>
  `;
    document.getElementById("planetInfo").innerHTML = planetInfo;
  }
}

function emptyPlanCheck() {
  const planetName = document.getElementById("planetInput").value;
  if (planetName == "") {
    alert("Please enter a planet name!");
  } else {
    displayPlanet(planetName);
  }
}
