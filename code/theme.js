let curTheme = "dark-theme"
let transitionAdded = false; // track

document.getElementById("dark-or-light-btn").addEventListener("click", () => {

  if (curTheme === "dark-theme") {
    curTheme = "light-theme";
  } else if (curTheme === "light-theme") {
    curTheme = "dark-theme";
  }

  document.documentElement.className = curTheme;

  // ONLY add to stylesheet if it hasn't been added yet
  if (!transitionAdded) {
    document.styleSheets[0].insertRule("html, body { transition: background-color 0.25s ease, color 0.25s ease; }", 0);
    transitionAdded = true;
  }
});


// set first theme
document.documentElement.className = curTheme;