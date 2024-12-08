const apiKey = 'b/HsPxzC6d/nQjQijbvvJw==SMa0npBggCcaYMXG';
const apiUrl = 'https://api.api-ninjas.com/v1/animals?name=';

const animalsContainer = document.querySelector('#animals-container');

async function getAnimalsSum() {
    try {
        // Load the animals.json file
        const response = await fetch('./data/animals.json');
        const data = await response.json();

        // Loop through the animals and make API requests
        for (const animal of data.animals) {
            const animalData = await fetch(`${apiUrl}${animal}`, {
                headers: { 'X-Api-Key': apiKey }
            });

            if (animalData.ok) {
                const animalInfo = await animalData.json();
                displayAnimalsSum(animalInfo);
                // console.log(`${animal}:`, animalInfo); // Do something with the data
            } else {
                console.error(`Failed to fetch data for ${animal}:`, animalData.status);
            }
        }
    } catch (error) {
        console.error('Error fetching animal data:', error);
    }
}

getAnimalsSum();

function createAnimalSumTemplate(animal) {

        /*
        Card             | div
        Name             | h3
        Scientific Name  | p
        Slogan           | p
        Location         | p
        */

    let card = document.createElement('div');

    let title = document.createElement('h3');
    title.textContent = animal.name;
    card.appendChild(title);

    let scientificName = document.createElement('p')
    scientificName.innerHTML = `<b>Scientific name</b>:<i>${animal.taxonomy.scientific_name}</i>`;
    card.appendChild(scientificName);

    let slogan = document.createElement('p');
    slogan.textContent = animal.characteristics.slogan;
    card.appendChild(slogan);

    let animalLocation = document.createElement('p');
    animalLocation.innerHTML = `<b>Location</b>: ${animal.locations.join(", ")}`;
    card.appendChild(animalLocation);
    
    return card;
}


function createAnimalInfoTemplate(animal) {

}

function displayAnimalsSum(animals) {

    animals.forEach(element => {
        
        let card = createAnimalSumTemplate(element);
        animalsContainer.appendChild(card);
    });

}

