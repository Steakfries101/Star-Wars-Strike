document.getElementById("getPlanetInfo").addEventListener("click", () => {
  displayPlanet(document.getElementById("planetInput").value);
});
document.getElementById("getCharacterInfo").addEventListener("click", () => {
  displayCharacter(document.getElementById("characterInput").value);
});

const bcPlaceNameApiUrl =
  "https://geogratis.gc.ca/services/geolocation/en/locate?q=,%20BC";

const laserIcon = L.icon({
  iconUrl: "images/laser.png",
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

//MAP FUNCTION
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

//CHARACTER INFO FUNCTIONS
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

//PLANET INFO FUNCTIONS
async function fetchAllPlanets() {
  const allPlanets = [];
  let nextPage = "https://www.swapi.tech/api/planets/";

  while (nextPage) {
    const response = await fetch(nextPage);
    const data = await response.json();

    // Add characters to the array
    allPlanets.push(...data.results);

    // Get the next page URL
    nextPage = data.next;
  }

  return allPlanets;
}

async function displayPlanet(planetName) {
  try {
    // Fetch all characters
    const allPlanets = await fetchAllPlanets();

    // Filter characters by name
    const matchedPlanets = allPlanets.filter((planet) =>
      planet.name.toLowerCase().includes(planetName.toLowerCase())
    );

    if (matchedPlanets.length === 0) {
      alert(`No planet found with the name "${planetName}"`);
      return;
    }

    // Fetch detailed information for the first match
    const planetUrl = matchedPlanets[0].url;
    const planetDetailResponse = await fetch(planetUrl);
    const planetDetailData = await planetDetailResponse.json();

    const planet = planetDetailData.result.properties;

    const planetInfo = `
      <ul>
        <li>Name: ${planet.name}</li>
        <li>Climate: ${planet.climate}</li>
        <li>Terrain: ${planet.terrain}</li>
        <li>Population: ${planet.population}</li>
        <li>Gravity: ${planet.gravity}</li>
      </ul>
    `;

    document.getElementById("planetInfo").innerHTML = planetInfo;
  } catch (error) {
    console.error("Error fetching character details:", error);
  }
}
