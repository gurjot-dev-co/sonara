// all dropdown cards 
const dropdownCards = document.querySelectorAll(".genres-card, .countries-card");

// dropdown functionality 
dropdownCards.forEach(card => {
    const arrow = card.querySelector(".card-arrow");
    const options = card.querySelectorAll(".genre-option, .country-option");

    // open / close dropdown 
    arrow.addEventListener("click", (event) => {
        event.stopPropagation();
        // close every other dropdown 
        dropdownCards.forEach(otherCard => {
            if (otherCard !== card) {
                otherCard.classList.remove("dropdown-open");
            }
        });
        // toggle current dropdown 
        card.classList.toggle("dropdown-open");
    });

    // select an option 
    options.forEach(option => {
        option.addEventListener("click", async (event) => {
            event.stopPropagation();
            // remove all selected state
            options.forEach(item => {
                item.classList.remove("selected");
            });
            // select clicked option 
            option.classList.add("selected");
            // country 
            if (option.classList.contains("country-option")) {
                const countryCode = option.dataset.country;
                const countryName = option.textContent.trim();
                console.log("Selected country:", countryName, countryCode);
                searchMusic("country", countryName, countryCode);
            }
            // genre 
            else if (option.classList.contains("genre-option")) {
                const genre = option.textContent.trim();
                console.log("Selected genre:", genre);
                searchMusic("genre", genre);
            }
        });
    });
});

// close dropdown when clicking outside 
document.addEventListener("click", (event) => {
    dropdownCards.forEach(card => {
        if (!card.contains(event.target)) {    // the clicked element is NOT inside this card
            card.classList.remove("dropdown-open");
        }
    });
});

// music search func used by artists, albums, genres and countries 
function searchMusic(searchType, searchTerm, countryCode = "") {
    // build the request URL, encoding converts chars into a form that's safe to put in a URL (eg, " " to "%").
    let url = `/results?type=${encodeURIComponent(searchType)}&term=${encodeURIComponent(searchTerm)}`;

    // add country code only for country searches 
    if (searchType === "country") url += `&country=${encodeURIComponent(countryCode)}`;

    console.log("Opening results:", url);

    // fetch(url) = "Make req in the bg & give the res to JS. window.location.href = "Navigate the browser to this URL."        
    // send request to Node backend to navigate the current page to this url
    window.location.href = url;
}

// main search bar
const mainSearchInput = document.querySelector("#song-search");
const mainSearchButton = document.querySelector(".search-songs .arrow");

if (mainSearchInput && mainSearchButton) {
    // search when arrow is clicked
    mainSearchButton.addEventListener("click", () => {
        performMainSearch();
    });
    // search when enter is pressed
    mainSearchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter")  performMainSearch();
    });
    function performMainSearch() {
        const searchTerm = mainSearchInput.value.trim();
        // if input is empty , don't search 
        if (!searchTerm) return;
        console.log("Searching for song : " , searchTerm);
        // search songs
        searchMusic("song", searchTerm); 
    }
}


// search cards 
const searchCards = document.querySelectorAll(".search-card");

searchCards.forEach(card => {
    const arrow = card.querySelector(".card-arrow");
    const searchInput = card.querySelector(".card-search-input");
    const searchButton = card.querySelector(".card-search-button");
    const searchType = card.dataset.searchType;

    // open / close search bar from cards
    arrow.addEventListener("click", (event) => {
        event.stopPropagation();
        // close other search cards
        searchCards.forEach(otherCard => {
            if (otherCard !== card) {
                otherCard.classList.remove("search-open");
            }
        });
        // toggle current card
        card.classList.toggle("search-open");
        // focus input when opened
        if (card.classList.contains("search-open")) {
            setTimeout(() => {
                searchInput.focus();
            }, 100);
        }
    });

    // search button
    searchButton.addEventListener("click", (event) => {
        event.stopPropagation();
        performSearch();
    });

    // enter key 
    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") performSearch();
    });

    function performSearch() {
        const searchTerm = searchInput.value.trim();

        // don't search an empty input 
        if (!searchTerm) return;

        console.log("Search type:", searchType);
        console.log("Search term:", searchTerm);

        // send search request to backend 
        searchMusic(searchType, searchTerm);
    }
});

// close search when clicking outside
document.addEventListener("click", (event) => {
    searchCards.forEach(card => {
        if (!card.contains(event.target)) {
            card.classList.remove("search-open");
        }
    });
});


// navigation cards 
const navigationCards = document.querySelectorAll(".navigation-card");

navigationCards.forEach(card => {
    const arrow = card.querySelector(".card-arrow");
    const cardType = card.dataset.type;

    arrow.addEventListener("click", () => {
        window.location.href = `/results?type=${encodeURIComponent(cardType)}`;
    });
});


function openMusic(type, id) {
    if (!id) {
        console.error("No iTunes ID found.");
        return;
    }
    if (type === "album") {   // album page
        window.location.href = `/music?type=album&id=${encodeURIComponent(id)}`;     
    } else if (type === "artist") {   // artist page
        window.location.href = `/music?type=artist&id=${encodeURIComponent(id)}`;   
    } else {        // song page
        window.location.href = `/music?type=song&id=${encodeURIComponent(id)}`;
    }
}


// small music preview player
let previewAudio = null;
let currentPlayButton = null;

function playPreview(button, previewUrl) {   // button i.e, play button
    // no preview available 
    if (!previewUrl) return console.log("No preview available for this song.");

    // if another song is currently playing (audio player is already created & clicked button is different from current button)
    if (previewAudio && currentPlayButton !== button) {
        previewAudio.pause();    // stop it 
        previewAudio.currentTime = 0;   // reset time then change the button to play icon

        if (currentPlayButton) {
            currentPlayButton.classList.remove("playing");
            currentPlayButton.innerHTML = `
                <svg class="play-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M8 5L19 12L8 19V5Z" fill="currentColor"/>
                </svg>
            `;
        }
    }

    // if clicking the 'currently playing' song 
    if (previewAudio && currentPlayButton === button) {
        if (!previewAudio.paused) {
            previewAudio.pause();
            button.classList.remove("playing");
            button.innerHTML = `
                <svg class="play-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M8 5L19 12L8 19V5Z" fill="currentColor"/>
                </svg>
            `;
            return;
        }
    }

    // create the audio object if it doesn't exist 
    if (!previewAudio) previewAudio = new Audio();

    // set the new preview 
    previewAudio.src = previewUrl;
    currentPlayButton = button;

    // change button to pause icon 
    button.classList.add("playing");
    button.innerHTML = `
        <svg class="pause-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="7" y="5" width="4" height="14" rx="1" fill="currentColor"/>
            <rect x="13" y="5" width="4" height="14" rx="1"fill="currentColor"/>
        </svg>
    `;

    // start playing 
    previewAudio.play().catch(error => {
        console.error("Could not play preview:", error);
        button.classList.remove("playing");
        currentPlayButton = null;
    });

    // when the 30 sec preview finishes 
    previewAudio.onended = () => {
        button.classList.remove("playing");
        button.innerHTML = `
            <svg class="play-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M8 5L19 12L8 19V5Z" fill="currentColor"/>
            </svg>
        `;
        currentPlayButton = null;
    };
}


// single song player
let songPlayerAudio = null;
const songPlayer = document.querySelector(".song-player");

if (songPlayer) {   // if the page has it
    const previewUrl = songPlayer.dataset.previewUrl;
    if (previewUrl) {
        songPlayerAudio = new Audio(previewUrl);
        const playButton = songPlayer.querySelector(".song-play-button");
        const progressContainer = songPlayer.querySelector(".song-progress-container");
        const progressFill = songPlayer.querySelector(".song-progress-fill");

        const currentTimeElement = songPlayer.querySelector(".song-current-time");
        const totalTimeElement = songPlayer.querySelector(".song-total-time");

        // play (if paused, on the click) and pause (if it's playing)
        window.toggleSongPreview = function () {    // attach the func toggleSongPreview to window
            if (songPlayerAudio.paused) {
                songPlayerAudio.play();
                songPlayer.classList.add("playing");
                playButton.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <rect x="7" y="5" width="4" height="14" rx="1" fill="currentColor"/>
                        <rect x="13" y="5" width="4" height="14" rx="1" fill="currentColor"/>
                    </svg>`;
            } else {
                songPlayerAudio.pause();
                songPlayer.classList.remove("playing");
                playButton.innerHTML = `
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <path d="M8 5L19 12L8 19V5Z" fill="currentColor"/>
                    </svg>`;
            }
        };

        // update progress (timeupdate fires repeatedly while the audio position changes.)
        songPlayerAudio.addEventListener("timeupdate", () => {
            if (!songPlayerAudio.duration) return;
            // (15(sec) / 30(Sec)) × 100 = 50% (the progress bar should be filled 50%)
            const percentage = (songPlayerAudio.currentTime / songPlayerAudio.duration) * 100;
            progressFill.style.width = `${percentage}%`;
            // audio has built in currentTime and duration properties
            currentTimeElement.textContent = formatSongTime(songPlayerAudio.currentTime); 
            totalTimeElement.textContent = formatSongTime(songPlayerAudio.duration);
        });

        // click progress bar
        progressContainer.addEventListener("click", (event) => {
            if (!songPlayerAudio.duration) return;
            const rect = progressContainer.getBoundingClientRect();  // gets position & size of progress bar on screen.
            // - rect.left = how far from the left edge of the progress bar did one click?
            const clickPosition = event.clientX - rect.left;
            const percentage = clickPosition / rect.width;  // convert the position to fraction
            songPlayerAudio.currentTime = percentage * songPlayerAudio.duration;   // moves audio to that position.  eg, clicked in middle = 0.5% audio jumps to halfway
        });

        // when song finishes
        songPlayerAudio.addEventListener("ended", () => {
            songPlayer.classList.remove("playing");
            progressFill.style.width = "0%";
            currentTimeElement.textContent = "0:00";
            playButton.innerHTML = `
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M8 5L19 12L8 19V5Z" fill="currentColor"/>
                </svg>`;
        });

        // mute func. put it on window to access it via onclick
        window.toggleSongMute = function () {
            // if muted = false then !false = true so it bcms muted, and vice-versa (!true = false)
            songPlayerAudio.muted = !songPlayerAudio.muted;
            const volumeButton = songPlayer.querySelector(".song-volume-button");
            if (songPlayerAudio.muted) {
                volumeButton.innerHTML = `
                    <svg width="19" ="19" viewBox="0 0 24 24" fill="none">
                        <path d="M4 9V15H8L13 19V5L8 9H4Z" fill="currentColor"/>
                        <path d="M18 9L22 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M22 9L18 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>`;
            } else {
                volumeButton.innerHTML = `
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                        <path d="M4 9V15H8L13 19V5L8 9H4Z" fill="currentColor"/>
                        <path d="M16 9C17.2 10.2 17.2 13.8 16 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M19 6.5C21.8 9.3 21.8 14.7 19 17.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>`;
            }
        };
    }
}

// format time , converts just seconds to minutes:seconds
function formatSongTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";  // no. isn't valid
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);  // gives remainder eg, for 125 % 60 = 5 sec
    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}