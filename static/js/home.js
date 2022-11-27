const menuButton = document.querySelector(".menu-button-js");
const sideNavContainer = document.querySelector(".side-nav-container");
const sideNavBackButton = document.querySelector(".side-nav-back-button");

const profileHeader = document.querySelector(".profile-header");

const logOut = document.querySelector("#log-out-js");

/* Menu Button clicked */
menuButton.addEventListener("click", () => {
  sideNavContainer.classList.remove("hidden");
  sideNavContainer.classList.remove("slide-out");
  sideNavContainer.classList.add("slide-in");

  // HIDE HEADER
  profileHeader.classList.add("hidden");
});

/* Side Nav Back Button clicked */
sideNavBackButton.addEventListener("click", () => {
  sideNavContainer.classList.remove("slide-in");
  sideNavContainer.classList.add("slide-out");

  // SHOW HEADER
  profileHeader.classList.remove("hidden");
});

// LOGOUT
logOut.addEventListener("click", () => {
  window.location.href = "/";
});
