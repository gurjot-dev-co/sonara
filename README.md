# Sonara

Sonara is a responsive music discovery application built with **Node.js**, **Express.js**, **EJS**, **HTML**, **CSS**, and **JavaScript**. It uses the **iTunes Search API** to let users search for songs, albums, and artists, explore detailed music information, and listen to available song previews through a clean and responsive interface.

---

## Live Demo

**Live Website:** [https://sonara-8jua.onrender.com]

---

## Features

* Search for **songs, albums, and artists**
* Browse album tracklists with track durations
* Play available **30-second song previews**
* Custom audio player with play, pause, progress, and volume controls
* Dynamic artwork retrieved from the iTunes Search API
* Responsive design for desktop, tablet, and mobile
* Server-side rendering with EJS
* Clean and minimal dark-themed interface
* Dedicated About, Contact, and API pages

---

## Tech Stack

* **Node.js** — JavaScript runtime
* **Express.js** — Web application framework
* **EJS** — Server-side templating
* **JavaScript** — Application logic and audio controls
* **HTML** — Page structure
* **CSS** — Styling and responsive design
* **iTunes Search API** — Music data, artwork, and previews

---

## How It Works

Sonara uses the iTunes Search API to retrieve music information based on the user's search.

Depending on the selected search type, Sonara can retrieve:

* **Songs** — track information, artist, album, genre, artwork, duration, and preview
* **Albums** — album information, artist, artwork, release year, and tracklist
* **Artists** — artist information and associated songs

The application then uses **EJS** to dynamically render the retrieved data into the appropriate pages.

---

## Running Locally

1. Clone the repository.

2. Install the dependencies:

```bash
npm install
```

3. Start the application:

```bash
npm start
```

4. Open the application in your browser:

```text
http://localhost:3000
```

Sonara uses the iTunes Search API, so an internet connection is required for retrieving music data.

---

## API

Sonara uses Apple's **iTunes Search API** to retrieve music metadata, artwork, and available preview URLs.

The application does not host or distribute the music itself. Available song previews are provided through the iTunes Search API.

---

## Legal

Sonara uses promotional content provided through Apple's iTunes Search API. Any song or music-video preview content is used solely for the purpose of promoting the associated music content and is streamed rather than downloaded or stored by the application.

Promotional content provided by Apple is used **as-is** and remains subject to Apple's applicable terms and conditions.

---

## Author

**Gurjot Kaur**

GitHub: [@gurjot-dev-co](https://github.com/gurjot-dev-co)

---

## License

This project is intended for **learning and portfolio purposes**.

Sonara is not affiliated with or endorsed by Apple Inc. or the iTunes Store.