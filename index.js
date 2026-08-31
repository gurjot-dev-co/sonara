import express from "express";
import bodyParser from "body-parser";
import env from "dotenv";

env.config();
const app = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", async (req, res) => {
    res.render("index.ejs");
});

app.get("/signUp", async (req, res) => {
    res.render("sign_up.ejs");
});

app.get("/logIn", async (req, res) => {
    res.render("log_in.ejs");
});

app.get("/about", async (req, res) => {
    res.render("about.ejs");
});

app.get("/contact", async (req, res) => {
    res.render("contact.ejs");
});

app.get("/api", async (req, res) => {
    res.render("api.ejs");
});

// results page
app.get("/results", async (req, res) => {
    const resultType = req.query.type;
    const searchTerm = req.query.term;
    const countryCode = req.query.country;

    console.log("Results type:", resultType);
    console.log("Search term:", searchTerm);
    console.log("Country code:", countryCode);

    try {
        let iTunesUrl;

        // artist search
        if (resultType === "artist") {
            iTunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&entity=musicArtist&limit=13`;
        }
        // album search 
        else if (resultType === "album") {
            iTunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&entity=album&limit=13`;
        }
        // genre search 
        else if (resultType === "genre") {
            iTunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&entity=song&limit=13`;
        }
        // song search 
        else if (resultType === "song") {
            iTunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&entity=song&limit=13`;
        }
        // country search 
        else if (resultType === "country") {
            iTunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&country=${encodeURIComponent(countryCode)}&entity=song&limit=13`;
        }
        // popular 
        else if (resultType === "popular") {
            iTunesUrl = null;
        }
        // new releases 
        else if (resultType === "new-release") {
            iTunesUrl = null;
        }
        // K-Pop 
        else if (resultType === "kpop") {
            iTunesUrl = `https://itunes.apple.com/search?term=k-pop&entity=song`;
        }
        // unknown type 
        else {
            return res.status(400).send("Unknown result type.");
        }
        console.log("iTunes URL:", iTunesUrl);

        // request data from iTunes 
        let data;

        // 50 internationally famous artists
        const artists = [
            "Taylor Swift",
            "The Weeknd",
            "Billie Eilish",
            "Dua Lipa",
            "Bruno Mars",
            "Ariana Grande",
            "Ed Sheeran",
            "Lady Gaga",
            "Justin Bieber",
            "Beyoncé",
            "Lana Del Rey",

            "Bad Bunny",
            "Drake",
            "Rihanna",
            "Kendrick Lamar",
            "Katy Perry",
            "Sabrina Carpenter",
            "Post Malone",
            "Travis Scott",
            "Olivia Rodrigo",
            "Eminem",

            "BLACKPINK",
            "BTS",
            "Stray Kids",
            "TWICE",
            "SEVENTEEN",
            "NewJeans",
            "Jungkook",
            "ROSÉ",
            "JENNIE",
            "aespa",

            "Arijit Singh",
            "Shreya Ghoshal",
            "Diljit Dosanjh",
            "A.R. Rahman",
            "Neha Kakkar",
            "Pritam",
            "King",
            "Karan Aujla",
            "Anuv Jain",
            "AP Dhillon",

            "Shakira",
            "Karol G",
            "J Balvin",
            "Peso Pluma",
            "Rauw Alejandro",
            "Feid",
            "Anitta",
            "Sia",
            "Coldplay",
            "Adele"
        ];

        if (resultType === "popular") {
        let allSongs = [];

        for (const artistName of artists) {
            try {
                // find artist 
                const artistUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(artistName)}&entity=musicArtist&limit=5`;
                const artistResponse = await fetch(artistUrl);
                const artistData = await artistResponse.json();

                if (!artistData.results || artistData.results.length === 0) {
                    console.log(`Artist not found: ${artistName}`);
                    continue;
                }

                const exactArtist = artistData.results.find(artist => artist.artistName.toLowerCase() === artistName.toLowerCase());
                const artist = exactArtist || artistData.results[0];
                const artistId = artist.artistId;

                console.log(`Popular artist: ${artist.artistName} | iTunes ID: ${artistId}`);

                // get songs from this artist 
                const songsUrl = `https://itunes.apple.com/lookup?id=${artistId}&entity=song&limit=10`;
                const songsResponse = await fetch(songsUrl);
                const songsData = await songsResponse.json();

                const songs = songsData.results.filter(
                    result =>
                        result.wrapperType === "track" &&
                        result.kind === "song"
                );

                allSongs.push(...songs);

            } catch (error) {
                console.error(`Error getting popular songs for ${artistName}:`, error.message);
            }
        }

        // remove duplicates
        const uniqueSongs = allSongs.filter(
            (song, index, array) =>
                index === array.findIndex(item => item.trackId === song.trackId)
        );

        // iTunes doesn't give the actual no. of listeners, so we use the no. of ratings to decide popular songs.
        uniqueSongs.sort((a, b) => {
            const aScore = (a.trackRatingCount || 0) + (a.collectionRatingCount || 0);
            const bScore = (b.trackRatingCount || 0) + (b.collectionRatingCount || 0);
            return bScore - aScore;
        });
        const finalSongs = uniqueSongs;

        data = {
            resultCount: finalSongs.length,
            results: finalSongs
        }
        } else if (resultType === "new-release") {
            let allSongs = [];

            // get each artist's iTunes ID and then their recent songs
            for (const artistName of artists) {
                try {
                    // find artist 
                    const artistUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(artistName)}&entity=musicArtist&limit=5`;
                    const artistResponse = await fetch(artistUrl);
                    const artistData = await artistResponse.json();

                    if (!artistData.results || artistData.results.length === 0) {
                        console.log(`Artist not found: ${artistName}`);
                        continue;
                    }

                    // find the closest artist result. first try an exact name match.
                    const exactArtist = artistData.results.find(artist => artist.artistName.toLowerCase() === artistName.toLowerCase());
                    const artist = exactArtist || artistData.results[0];
                    const artistId = artist.artistId;

                    console.log(`Artist: ${artist.artistName} | iTunes ID: ${artistId}`);

                    // get artist's recent songs 
                    const songsUrl = `https://itunes.apple.com/lookup?id=${artistId}&entity=song&limit=20&sort=recent`;
                    const songsResponse = await fetch(songsUrl);
                    const songsData = await songsResponse.json();

                    // keep only actual songs 
                    const songs = songsData.results
                        .filter(
                            result =>
                                result.wrapperType === "track" &&
                                result.kind === "song"
                        )
                        .slice(0, 3);

                    console.log(`${artist.artistName}: ${songs.length} recent songs`);
                    allSongs.push(...songs);

                } catch (error) {
                    console.error(`Error getting songs for ${artistName}:`, error.message);
                }
            }
            // remove duplicate songs 
            const uniqueSongs = allSongs.filter((song, index, array) =>
                index === array.findIndex(
                    item => item.trackId === song.trackId
                )
            );

            // sort newest → oldest 
            uniqueSongs.sort((a, b) =>
                new Date(b.releaseDate) - new Date(a.releaseDate)
            );

            const finalSongs = uniqueSongs;

            // create the same structure returned by the normal iTunes Search API.
            data = {
                resultCount: finalSongs.length,
                results: finalSongs
            };

        } else {
            // normal iTunes request
            const response = await fetch(iTunesUrl);
            data = await response.json();
        }

        // log iTunes response in terminal 
        console.log("iTunes result count:", data.resultCount);
        console.log("iTunes data:", data);

        // render results page 
        res.render("results.ejs", {
            type: resultType,
            term: searchTerm,
            country: countryCode,
            results: data.results
        });
    } catch (error) {
        console.error("iTunes API error:", error);
        res.status(500).send("Something went wrong while getting music data.");
    }
});
// the flow is :
// Browser
//    ↓  /results?type=artist&term=Adele
// Node backend
//    ↓ fetch(iTunesUrl) 
// iTunes API
//    ↓ JSON
// Node
//    ↓ res.render(...)
// results.ejs


// music detail page
app.get("/music", async (req, res) => {
    const type = req.query.type;
    const id = req.query.id;

    console.log("Music type:", type);
    console.log("Music ID:", id);

    if (!type || !id) return res.status(400).send("Missing music information.");

    try {
        let iTunesUrl;
        if (type === "song") {
            iTunesUrl = `https://itunes.apple.com/lookup?id=${encodeURIComponent(id)}`;
        }
        else if (type === "album") {
            iTunesUrl = `https://itunes.apple.com/lookup?id=${encodeURIComponent(id)}` + `&entity=song`;
        }
        else if (type === "artist") {
            iTunesUrl = `https://itunes.apple.com/lookup?id=${encodeURIComponent(id)}` + `&entity=song`;
        }
        else {
            return res.status(400).send("Unknown music type.");
        }
        console.log("iTunes URL:", iTunesUrl);

        // ask iTunes for the music info 
        const response = await fetch(iTunesUrl);
        const data = await response.json();
        console.log("iTunes result count:", data.resultCount);

        if (!data.results || data.results.length === 0) {
            return res.status(404).send("Music not found.");
        }
        // render the music page 
        res.render("music.ejs", {
            type: type,
            results: data.results
        });
    } catch (error) {
        console.error("Music API error:", error);
        res.status(500).send("Something went wrong while getting the music.");
    }
});

app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}...`);
});