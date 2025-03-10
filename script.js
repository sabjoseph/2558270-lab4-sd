document.getElementById("searchBtn").addEventListener("click", fetchCountryDetails);

async function fetchCountryDetails() {
    const userInput = document.getElementById("countryInput").value.trim();
    if (userInput === "") {
        alert("Enter a country name to proceed.");
        return;
    }

    const countrySection = document.getElementById("country-info");
    const neighborsSection = document.getElementById("bordering-countries");

    // Clear previous data
    countrySection.innerHTML = "";
    neighborsSection.innerHTML = "";

    try {
        const apiResponse = await fetch(`https://restcountries.com/v3.1/name/${userInput}`);
        if (!apiResponse.ok) throw new Error("No matching country found.");

        const countryData = await apiResponse.json();
        const selectedCountry = countryData[0];

        // Extract relevant details
        const capitalCity = selectedCountry.capital ? selectedCountry.capital[0] : "N/A";
        const totalPopulation = selectedCountry.population.toLocaleString();
        const continent = selectedCountry.region;
        const countryFlag = selectedCountry.flags.svg;
        const borderingNations = selectedCountry.borders || [];

        // Insert country details into the page
        countrySection.innerHTML = `
            <h2>${selectedCountry.name.common}</h2>
            <p><strong>Capital:</strong> ${capitalCity}</p>
            <p><strong>Population:</strong> ${totalPopulation}</p>
            <p><strong>Region:</strong> ${continent}</p>
            <img src="${countryFlag}" alt="Flag of ${selectedCountry.name.common}">
        `;

        // If the country has neighbors, retrieve and display them
        if (borderingNations.length > 0) {
            neighborsSection.innerHTML = "<h3>Neighboring Countries:</h3>";
            const neighborRequests = borderingNations.map(async (code) => {
                const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const neighborData = await response.json();
                return neighborData[0];
            });

            const neighboringCountries = await Promise.all(neighborRequests);
            neighboringCountries.forEach((nation) => {
                const nationFlag = nation.flags.svg;
                neighborsSection.innerHTML += `
                    <p><strong>${nation.name.common}</strong></p>
                    <img src="${nationFlag}" alt="Flag of ${nation.name.common}">
                `;
            });
        } else {
            neighborsSection.innerHTML = "<p>No neighboring countries.</p>";
        }

    } catch (err) {
        alert(err.message);
    }
}
