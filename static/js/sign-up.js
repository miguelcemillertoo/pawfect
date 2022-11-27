const backButton = document.querySelector(".back-button");

const photoContainer = document.querySelector("#photo-container-js");
const uploadImage = document.querySelector("#upload-image-js");

const signUpButton = document.querySelector("#sign-up-button-js");
const container = document.querySelector(".container");
const header = document.querySelector(".header");
const imageUploadContainer = document.querySelector(".image-upload-container");
const textInputsContainer = document.querySelector(".text-inputs-container");
const footer = document.querySelector(".footer");
const petProfileOptions = document.querySelector(".pet-profile-options");

const nameInput = document.querySelector("#name-input-js");
const usernameInput = document.querySelector("#username-input-js");
const passwordInput = document.querySelector("#password-input-js");
const addressInput = document.querySelector("#address-input-js");

const data = {};

let userData = {
  name: "",
  username: "",
  password: "",
  address: "",
  image_filename: "",
};

backButton.addEventListener("click", () => {
  window.location.href = "/";
});

const checkData = () => {
  const hasImage = !photoContainer.classList.contains("hidden");
  if (hasImage && nameInput.value && usernameInput.value && passwordInput.value && addressInput.value) {
    signUpButton.classList.remove("disabled");
  } else {
    signUpButton.classList.add("disabled");
  }
};

uploadImage.addEventListener("change", function () {
  photoContainer.classList.remove("hidden");

  const file = this.files[0];
  data.image = file;

  const reader = new FileReader();

  if (file.type.match("image.*")) {
    reader.readAsDataURL(file);
  } else {
    // hide image
    photoContainer.classList.add("hidden");
  }

  reader.onloadend = async function () {
    photoContainer.src = reader.result;

    checkData();
  };
});

signUpButton.addEventListener("click", async () => {
  // SAVE USER
  data.name = nameInput.value;
  data.username = usernameInput.value;
  data.password = passwordInput.value;
  data.address = addressInput.value;

  let formData = new FormData();
  formData.append("name", data.name);
  formData.append("username", data.username);
  formData.append("password", data.password);
  formData.append("address", data.address);
  formData.append("image", data.image);

  // SAVE USER
  await fetch("/save-user", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      // User has been saved, copy to userData
      let dataCopy = data;
      userData.name = dataCopy.name;
      userData.username = dataCopy.username;
      userData.password = dataCopy.password;
      userData.address = dataCopy.address;
      userData.image_filename = dataCopy.imageFilename;
    })
    .catch((error) => {
      console.log(error);
    });

  // SHOW OPTIONS
  container.style.backgroundImage = "url(/static/images/assets/background-pet.jpg)";
  header.classList.add("hidden");
  imageUploadContainer.classList.add("hidden");
  textInputsContainer.classList.add("hidden");
  footer.classList.add("hidden");
  petProfileOptions.classList.remove("hidden");
});

const createPetProfile = document.querySelector("#create-pet-profile-js");
const skip = document.querySelector("#skip-js");

// CREATE PET PROFILE
createPetProfile.addEventListener("click", () => {
  window.location.href = `/create-pet-profile/${userData.username}`;
});

// SKIP
skip.addEventListener("click", () => {
  window.location.href = `/home/${userData.username}`;
});
