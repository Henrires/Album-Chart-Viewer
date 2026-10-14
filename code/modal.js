let modalAlbumData

// for loading, text and button change into output
function renderOutput() {
  const tracks = [...modalTracks.querySelectorAll(".track-row")].map(row => {
    const rating = row.querySelector(".t.rating").value;
    return {
      position: Number(row.querySelector(".t.pos").value) || 0,
      name: row.querySelector(".t.name").value,
      rating: rating === "" ? null : Number(rating)
    };
  });

  const notes = [...modalNotes.querySelectorAll(".n-text")]
    .map(i => i.value) // pass i get i.value
    .filter(v => v.trim() !== "");

  const album = {
    type: "album",
    title: document.getElementById("modal-title").value,
    artist: document.getElementById("modal-artist").value,
    year: Number(document.getElementById("modal-year").value) || null,
    coverArt: document.getElementById("modal-coverArt").value || null,
    version: 1,
    tracks,
    notes
  };

  document.getElementById("modal-output").value = JSON.stringify(album, null, 2);
  modalAlbumData = album;
}

// when we create, to update modal
function updateModal(album) {
  document.getElementById("modal-title").value = album.title,
    document.getElementById("modal-artist").value = album.artist,
    document.getElementById("modal-year").value = album.year,
    document.getElementById("modal-coverArt").value = album.coverArt,
    version = album.version;

  for (const currentSong of album.tracks) {
    const position = currentSong.position
    const name = currentSong.name
    const rating = currentSong.rating

    addTrackRow(position, name, rating)
  }
  for (const noteText of album.notes) {
    addNoteRow(noteText)
  }
  renderOutput();
}

// when each change call renderOutput()
["modal-title", "modal-artist", "modal-year", "modal-coverArt"].forEach(id =>
  document.getElementById(id).addEventListener("input", renderOutput)
);

// to add track row, either on click or automatic
const modalTracks = document.getElementById("modal-tracks");
function addTrackRow(position, name, rating) {
  const row = document.createElement("div");
  row.className = "track-row";
  row.innerHTML = `
    <input class="t pos" type="number" placeholder="#" value="${position ?? modalTracks.children.length + 1}">
    <input class="t name" placeholder="Track name" value="${name ?? ""}">
    <input class="t rating" type="number" step="0.1" placeholder="Rating" value="${rating ?? ""}">
    <button class="remove-btn">✕</button>
  `;

  // when clicked remove
  row.querySelector(".remove-btn").addEventListener("click", () => { // () parameter
    row.remove();
    renderOutput();
  });

  // get all, then when connected send to renderotput
  row.querySelectorAll("input").forEach(i =>
    i.addEventListener("input", renderOutput)
  );

  modalTracks.appendChild(row);
}

// to add note, either on click or automatic
const modalNotes = document.getElementById("modal-notes");
function addNoteRow(text) {
  const row = document.createElement("div");
  row.className = "note-row";
  row.innerHTML = `
    <input class="n-text" placeholder="Note" value="${text ?? ""}">
    <button class="remove-btn">✕</button>
  `;

  row.querySelector(".remove-btn").addEventListener("click", () => {
    row.remove();
    renderOutput();
  });

  row.querySelector("input").addEventListener("input", renderOutput);
  modalNotes.appendChild(row);
}

// interactions / connections
document.getElementById("modal-add-note").addEventListener("click", () => {
  addNoteRow();
  renderOutput();
});

document.getElementById("modal-add-track").addEventListener("click", () => {
  addTrackRow();
  renderOutput();
});

// Save, and finally, call main.js renderAlbum
const modalSave = document.getElementById("modal-save-btn")
modalSave.addEventListener("click", () => {
  renderOutput();
  if (!isValidAlbum(modalAlbumData)) {
    alert("Your json is invalid.")
    return;
  }
  renderAlbum(modalAlbumData);
  document.querySelector(".editor-modal").classList.add("hidden");
});

// download
const createBtn = document.getElementById("create-btn")
const downloadBtn = document.getElementById("modal-download-btn")

downloadBtn.addEventListener("click", () => {
  if (!modalAlbumData) { // safe callback
    alert("No input detected. Please provide a valid JSON string.")
    return
  }

  const blob = new Blob([JSON.stringify(modalAlbumData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = (modalAlbumData.title || "album") + ".json";
  a.click();
  URL.revokeObjectURL(url);
});

// after ended
function updateCreateEditButton() {
  createBtn.textContent = curAlbum ? "Edit" : "Create";
}

// close and open, button.
const modalClose = document.getElementById("modal-close")

createBtn.addEventListener("click", () => {
  document.querySelector(".editor-modal").classList.remove("hidden");
  renderOutput() // leave output with something
});

modalClose.addEventListener("click", () =>
  document.querySelector(".editor-modal").classList.add("hidden")
);

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    alert("Something went wrong while trying to copy.")
  }
}

// copy
const copyBtn = document.getElementById("modal-copy-btn")
copyBtn.addEventListener("click", () => {
  copyToClipboard(document.getElementById("modal-output").value)

  document.getElementById("modal-copy-btn").textContent = "Copied!"
  // doesnt block
  setTimeout(() => {
    document.getElementById("modal-copy-btn").textContent = "Copy"
  }, 1000);
})