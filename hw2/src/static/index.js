const searchInput = document.getElementById('searchInput');
const clearIcon = document.querySelector('.clear-icon');

// Clear the input when clicking the clear icon
function clearSearch() {
    console.log("searchInput: ", searchInput);
    searchInput.value = '';
}


// submit search
// Handle clicking the search icon
document.getElementById("searchForm").addEventListener("submit", (event) => {
    event.preventDefault();  // Prevents default form submission
    submitSearch();
});

// Handle Enter key in input field
document.getElementById("searchInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        submitSearch();
    }
});

function submitSearch() {
    const searchInput = document.getElementById("searchInput");
    
    if (!searchInput.value.trim()) {
        searchInput.reportValidity();  // Triggers the popup alert
        return;
    }

    fetchSearchResults(searchInput.value.trim());
}

function fetchSearchResults(query) {
    const bioContainer = document.getElementById("bio-container");
    bioContainer.innerHTML = "";   // clear prev results

    const loading = document.getElementById("loading-container");
    loading.style.display = "block";    // show loading gif

    // fetch(`/search?query=${encodeURIComponent(query)}`)
    fetch(`/search/${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(data => {
        loading.style.display = "none"; // hide loading gif

        // console.log("Search results:", data);

        // const resultsDisplayContainer = document.getElementById("results-displayer");
        // resultsDisplayContainer.innerHTML = "";   // clear prev results
        // // Why is this giving error?
        
        const cardContainer = document.getElementById("card-container");
        // console.log("container is: ", container);
        cardContainer.innerHTML = "";   // clear prev results

        // if no results
        if (!data || data.artists.length == 0) {
            cardContainer.innerHTML = '<div class="no-results">No results found.</div>';
        }

        // rendering search results
        for (let i = 0; i < data.artists.length; i++) {
            // Note!!!!! In the above and following lines, use "let" instead of "var", so that when calling `fetchArtistBio`, each card gets its own scoped `bioUrl`. This is because `var` is function-scoped (not block-scoped), but if we want to assign different `bioUrl` value to each card differently, we want it to be block-scoped!
            
            // organize info
            // let imageUrl = data._embedded.results[i]._links.thumbnail.href;
            let imageUrl = data.artists[i].imgUrl;
            // console.log("Search results (imageUrl):", imageUrl);
            // let title = data._embedded.results[i].title;
            let title = data.artists[i].title;
            // console.log("Search results (title):", title);
            let bioUrl = data.artists[i].bioUrl;
            // console.log("Search results (bioUrl):", bioUrl);

            // the Card
            const Card = document.createElement("div");
            Card.classList.add("card");
            Card.addEventListener("click", function() {
                // manage active-card class
                const Cards = document.querySelectorAll(".card");
                Cards.forEach(element => {
                    element.classList.remove('active-card');
                });
                Card.classList.add("active-card");
                fetchArtistBio(bioUrl)
            });

            // the thumbnail image on Card
            const img = document.createElement("img");
            // console.log("img is: ", img);
            img.src = imageUrl;
            console.log()
            img.classList.add("thumb-pics");
            // if no thumbnail pic, display artsy logo instead
            img.alt = "Image Not Found";
            img.onerror= function () {
                this.src='./images/artsy_logo.svg';
            };
            img.style.backgroundImage = "./images/artsy_logo.svg";
            
            // the artist name on Card
            const titleLable = document.createElement("p");
            titleLable.textContent = title;
            titleLable.classList.add("title-label");
            
            Card.appendChild(img);
            Card.appendChild(titleLable);
            cardContainer.appendChild(Card);
        }
    })
    .catch(error => console.error("Error fetching search results:", error))
    // .finally(() => {     // moved to front
    //     loading.style.display = "none"; // hide loading gif
    // });
}

function fetchArtistBio(bioUrl) {
    // show loading gif
    const loading = document.getElementById("loading-container");
    loading.style.display = "block";

    const bioContainer = document.getElementById("bio-container");
    // console.log("container is: ", container);
    bioContainer.innerHTML = "";   // clear prev results

    // get artist id
    const parts = bioUrl.split("/");
    const id = parts[parts.length - 1];  // "4d8b928b4eb68a1b2c0001f2";
    // console.log((id));

    fetch(`/artist/${encodeURIComponent(id)}`)
    .then(response => response.json())
    .then(data => {
        // console.log("Search results:", data);

        // rendering biography
        const bioTitle = document.createElement("p");
        bioTitle.textContent = `${data.name} (${data.birthday} - ${data.deathday})`;
        bioTitle.classList.add("bio-title");
        const bioNation = document.createElement("p");
        bioNation.textContent = `${data.nationality}`;
        bioNation.classList.add("bio-nation");
        const bio = document.createElement("p");
        bio.textContent = data.biography;
        bio.classList.add("bio");
        
        bioContainer.appendChild(bioTitle);
        bioContainer.appendChild(bioNation);
        bioContainer.appendChild(bio);
    })
    .catch(error => console.error("Error fetching search results:", error))
    .finally(() => {
        loading.style.display = "none"; // hide loading gif
    });
}