//search button
document.getElementById("search-button").addEventListener("click", travelSearch());


function travelSearch() {
    // Get the value of the input field
    const searchInput = document.getElementById("search-input").value;

    // Check if the input is empty
    if (searchInput.trim() === "") {
        alert("Please enter a destination.");
        return;
    }

    // Fetch travel recommendations from the API
    fetch('travel_recommendations_api.json')
        .then(response => response.json())
        .then(data => {
            displayRecommendations(data);
            console.log("Travel recommendations fetched successfully:", data);
        })
        .catch(error => {
            console.error("Error fetching travel recommendations:", error);
        });
}

//display recommendations
function displayRecommendations(data) {
    const recommendationQuery = document.getElementById("search-bar").value.toLowerCase().trim();
    recommendationQuery.innerHTML = ""; // Clear previous results

    if (data.length === 0) {
        recommendationQuery.innerHTML = "<p>No recommendations found.</p>";
        return;
    } else {
        data.forEach(recommendation => {
            const recommendationDiv = document.createElement("div");
            recommendationDiv.className = "recommendation";

            const title = document.createElement("h3");
            title.textContent = recommendation.title;

            const description = document.createElement("p");
            description.textContent = recommendation.description;

            recommendationDiv.appendChild(title);
            recommendationDiv.appendChild(description);
            recommendationQuery.appendChild(recommendationDiv);
        });
    }
}

//clear button
document.getElementById("reset-button").addEventListener("click", function () {
    document.getElementById("search-bar").value = "";
    document.getElementById("recommendations-container").innerHTML = "";
});

//create divs that pull info from API call using fetch

