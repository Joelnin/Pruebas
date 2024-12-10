async function fetchSpeciesLocation(scientificName) {
    const apiUrl = `https://api.gbif.org/v1/occurrence/search?scientificName=${encodeURIComponent(scientificName)}&limit=1`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.results.length > 0) {
            const { decimalLatitude, decimalLongitude, scientificName } = data.results[0];
            return { lat: decimalLatitude, lng: decimalLongitude, name: scientificName };
        } else {
            console.error("No data found for this species.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching species data:", error);
    }
}


function generateRandomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

const colorPalette = ["#ff0000"]; // Paleta predefinida

function getColorFromPalette(index) {
    return colorPalette[index % colorPalette.length];
}

async function fetchDynamicSpecies(speciesList) {
    const locations = [];
    for (const [index, scientificName] of speciesList.entries()) {
        const apiUrl = `https://api.gbif.org/v1/occurrence/search?scientificName=${encodeURIComponent(scientificName)}&limit=1`;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.results.length > 0) {
                const { decimalLatitude, decimalLongitude, scientificName } = data.results[0];
                locations.push({
                    lat: decimalLatitude,
                    lng: decimalLongitude,
                    name: scientificName,
                    color: getColorFromPalette(index), // Asignar color de la paleta
                });
            } else {
                console.warn(`No data found for ${scientificName}`);
            }
        } catch (error) {
            console.error(`Error fetching data for ${scientificName}:`, error);
        }
    }
    return locations;
}

async function createDynamicGlobe(userSpeciesList) {
    const globe = Globe()(document.getElementById("globe-container"))
    .globeImageUrl("//unpkg.com/three-globe/example/img/earth-blue-marble.jpg") 
    .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png") 
    .backgroundImageUrl("//unpkg.com/three-globe/example/img/night-sky.png")
    .pointOfView({ lat: 0, lng: 0, altitude: 2 });

const scene = globe.scene();
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // Suave y uniforme
scene.add(ambientLight);


    const animalLocations = await fetchDynamicSpecies(userSpeciesList);

    globe
        .pointsData(animalLocations)
        .pointAltitude(0.1)
        .pointRadius(0.5)
        .pointColor((d) => d.color) // Usar el color dinámico
        .pointLabel((d) => `${d.name} (${d.color})`);
}

// Ejemplo: Llamar con una lista de especies del usuario
// const userSpecies = ["Panthera onca", "Canis lupus", "Balaenoptera musculus", "Elephas maximus", "Ara macao"];
// createDynamicGlobe(userSpecies);

document.getElementById("animal-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = document.getElementById("animals").value;
    const speciesList = input.split(",").map((name) => name.trim());
    createDynamicGlobe(speciesList); // Crear globo con la lista del usuario
});
