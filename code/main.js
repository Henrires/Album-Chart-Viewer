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

function isValidAlbum(album) {
  if (!album || typeof album !== "object") return false;
  if (typeof album.type !== "string") return false;
  if (!Array.isArray(album.tracks)) return false;
  if (typeof album.title !== "string") return false;
  if (typeof album.artist !== "string") return false;
  if (!Number.isInteger(album.year)) return false;

  const tracksValid = album.tracks.every(t =>
    (typeof t.rating === "number" || typeof t.rating === "string") &&
    typeof t.position === "number" &&
    typeof t.name === "string" &&
    t.name.length > 0
  );

  // notes can be omitted, null, or an array of strings
  const notesValid =
    !album.notes ||
    (Array.isArray(album.notes) &&
      album.notes.every(note => typeof note === "string"));

  return tracksValid && notesValid;
}

function renderAlbum(album) {
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
  list.innerHTML = "";

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

  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (!isValidAlbum(data)) {
        alert("Invalid Json");
        return;
      }

      renderAlbum(data);
    } catch (err) {
      alert(
        "Couldn't read that file, make sure it's valid JSON matching the album schema."
      );
      console.error(err);
    }
  };
  reader.readAsText(file);
}

loadBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () =>
  loadJsonFile(fileInput.files[0])
);


