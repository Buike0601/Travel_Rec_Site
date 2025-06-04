document.getElementById("search-button").addEventListener("click", travelSearch);
document.getElementById("search-bar").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        travelSearch();
    }
});



const searchOutput = document.getElementById("search-output");

async function dataFetched() {
    try {
        const response = await fetch('travel_recommendation_api.json');
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        console.log("Data fetched successfully:", data);
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

async function travelSearch() {
    const searchInput = document.getElementById("search-bar").value.toLowerCase().trim();
    const data = await dataFetched();

    console.log("Search input:", searchInput);
    // searchOutput.innerHTML = '';
    // Check if the input is empty
    if (searchInput.trim() === "") {
        alert("Please enter a destination.");
        return;
    }

    if (!data) {
        searchOutput.innerHTML = `<p>Could not find you recommendations for ${searchInput.toUpperCase()}.</p>`;
        searchOutput.style.display = 'block';
        return;
    }

    let allDest = [];
    let foundDest = [];
    data.countries.forEach(country => {
        country.cities.forEach(city => {
            allDest.push({
                type: "city",
                countryName: country.name,
                ...city,
            });
        });
    });

    data.temples.forEach(temple => {
        allDest.push({
            type: "temple",
            ...temple,
        });
    });

    data.beaches.forEach(beach => {
        allDest.push({
            type: "beach",
            ...beach,
        });
    });

    console.log("All destinations:", allDest);

    if (searchInput.includes('country' || 'countries')) {
        foundDest = allDest.filter(place => place.type === 'city')
    } else if (searchInput.includes('temple' || 'temples')) {
        foundDest = allDest.filter(place => place.type === 'temple');
    } else if (searchInput.includes('beach' || 'beaches')) {
        foundDest = allDest.filter(place => place.type === 'beach');
    } else {
        foundDest = allDest.filter(place => {
            const placeName = place.name.toLowerCase();
            const placeDescription = (place.description || '').toLowerCase();
            const placeCountry = (place.countryName || '').toLowerCase();

            return placeName.includes(searchInput) ||
                placeDescription.includes(searchInput) ||
                placeCountry.includes(searchInput);
        });

    }
    displayRecommendations(foundDest);
}

function displayRecommendations(data) {
    // const recommendationQuery = document.getElementById("search-bar").value.toLowerCase().trim();
    // recommendationQuery.innerHTML = "";
    if (data.length > 0) {
        const gridContainer = document.createElement('div');
        gridContainer.classList.add('grid-container');

        data.forEach(recommendation => {
            const recommendationDiv = document.createElement('div');
            recommendationDiv.classList.add('recommendation');

            const placeIMG = document.createElement('img');
            placeIMG.src = recommendation.imageUrl;
            placeIMG.alt = recommendation.name;
            recommendationDiv.appendChild(placeIMG);

            const content = document.createElement('div');
            content.classList.add('card-content');

            const title = document.createElement('h3');
            title.textContent = recommendation.name;
            content.appendChild(title);

            const description = document.createElement('p');
            description.textContent = recommendation.description;
            content.appendChild(description);



            recommendationDiv.appendChild(content);
            gridContainer.appendChild(recommendationDiv);
        });
        searchOutput.appendChild(gridContainer);
        searchOutput.style.display = 'flex';
    } else {
        searchOutput.innerHTML = `<p>No recommendations found for your ${searchInput}. Focus on specific countries, cities, temples, or beaches.</p>`;
        searchOutput.style.display = 'block';
    }
}

document.getElementById("reset-button").addEventListener("click", clearSearch);

function clearSearch() {
    document.getElementById('search-bar').value = '';
    searchOutput.innerHTML = '';
    searchOutput.style.display = 'none';
    alert('Search results cleared.');
}