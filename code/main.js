let curAlbum = null

function tier(v) {
  if (typeof v !== "number" || !Number.isFinite(v)) return "empty";
  if (v >= 9.7) return "cinema";
  if (v >= 9.0) return "awesome";
  if (v >= 8.0) return "great";
  if (v >= 7.0) return "good";
  if (v >= 5.0) return "regular";
  if (v >= 3.0) return "bad";
  return "garbage";
}

function sanitizeAlbum(album) {
  const src = album && typeof album === "object" ? album : {};

  const str = (v, fallback) => (typeof v === "string" ? v : fallback);

  const tracks = (Array.isArray(src.tracks) ? src.tracks : []).map((t, i) => {
    const track = t && typeof t === "object" ? t : {};
    const raw = typeof track.rating === "string"
      ? parseFloat(track.rating)
      : track.rating;

    return {
      position: typeof track.position === "number" ? track.position : i + 1,
      name: typeof track.name === "string" && track.name.length > 0
        ? track.name
        : "Unknown Track",
      rating: Number.isFinite(raw) ? raw : null,
    };
  });

  const notes = Array.isArray(src.notes)
    ? src.notes.filter(n => typeof n === "string")
    : [];

  return {
    type: str(src.type, "Album"),
    title: str(src.title, "Unknown Title"),
    artist: str(src.artist, "Unknown Artist"),
    year: Number.isInteger(src.year) ? src.year : 0,
    ratedOn: typeof src.ratedOn === "string" && !isNaN(Date.parse(src.ratedOn))
      ? src.ratedOn
      : "",
    ratedBy: str(src.ratedBy, ""),
    coverArt: str(src.coverArt, ""),
    schemaVersion: Number.isInteger(src.schemaVersion) ? src.schemaVersion : 1,
    tracks,
    notes,
  };
}

function renderAlbum(receivedAlbum) {
  const album = sanitizeAlbum(receivedAlbum);

  document.getElementById("empty-state").style.display = "none";
  document.querySelector(".poster").classList.remove("hidden");

  // meta
  document.getElementById("cover-img").src =
    album.coverArt ||
    `https://placehold.co/500x500/1a1c1e/f2f0ea?text=${encodeURIComponent(
      album.title || "Album"
    )}`;

  document.getElementById("album-title").textContent =
    album.title || "Untitled Album";

  document.getElementById("album-artist").textContent =
    album.artist || "";

  document.getElementById("album-year").textContent =
    album.year || "";

  document.getElementById("album-ratedOn").textContent =
    album.ratedOn || "";

  document.getElementById("album-ratedBy").textContent =
    album.ratedBy || "";

  // overall score
  // ONLY actual numbers are included
  const rated = (album.tracks || []).filter(
    t => typeof t.rating === "number" && Number.isFinite(t.rating)
  );

  const overall = rated.length
    ? rated.reduce((sum, t) => sum + t.rating, 0) / rated.length
    : null;

  document.getElementById("overall-score").textContent =
    overall !== null ? overall.toFixed(2) : "–";

  // tracklist
  const list = document.getElementById("tracklist");
  list.innerHTML = ""; // ! clear everything first

  (album.tracks || []).forEach(t => {
    const row = document.createElement("div");
    row.className = "track";

    const num = document.createElement("div");
    num.className = "num";
    num.textContent = t.position;

    const trackName = document.createElement("div");
    trackName.className = "name";
    trackName.textContent = t.name;

    const ratingBox = document.createElement("div");

    // Color/tier
    ratingBox.className = `rating ${tier(t.rating)}`;

    // Text
    if (typeof t.rating === "number" && Number.isFinite(t.rating)) {
      ratingBox.textContent = t.rating.toFixed(1);
    } else {
      ratingBox.textContent = "?";
    }

    row.appendChild(num);
    row.appendChild(trackName);
    row.appendChild(ratingBox);

    list.appendChild(row);
  });

  curAlbum = album
  updateCreateEditButton()
  updateModal(curAlbum)

  // notes
  const notesList = document.getElementById("notes-list");
  notesList.innerHTML = "";

  if (album.notes && album.notes.length) {
    document.querySelector(".notes").style.display = "";

    album.notes.forEach(n => {
      const li = document.createElement("li");
      li.textContent = n;
      notesList.appendChild(li);
    });
  } else {
    document.querySelector(".notes").style.display = "none";
  }
}

const fileInput = document.getElementById("file-input");
const loadBtn = document.getElementById("load-btn");

function loadJsonFile(file) {
  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.readAsText(file);
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      renderAlbum(data);
    } catch (err) {
      alert(
        "Couldn't read that file, make sure it's valid JSON matching the album schema."
      );
      console.error(err);
    }
  };
}

loadBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () =>
  loadJsonFile(fileInput.files[0])
);


