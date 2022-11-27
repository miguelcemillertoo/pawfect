const nameInput = document.querySelector("#name-input-js");
const breedInput = document.querySelector("#breed-input-js");
const coatColorInput = document.querySelector("#coat-color-input-js");
const genderSelect = document.querySelector("#gender-select-js");
const birthdayInput = document.querySelector("#birthday-input-js");

const backButton = document.querySelector(".back-button");
const createButton = document.querySelector("#create-button-js");

const photoContainer = document.querySelector("#photo-container-js");
const uploadImage = document.querySelector("#upload-image-js");

const predictBreedButton = document.querySelector("#predict-breed-button-js");
const predictCoatColorButton = document.querySelector("#predict-coat-color-button-js");

const loaderBreed = document.querySelector("#loader-breed-js");
const loaderCoatColor = document.querySelector("#loader-coat-color-js");

const data = {};

const username = document.querySelector(".container").getAttribute("data");

backButton.addEventListener("click", () => {
  //   window.location.href = `/home/${userData.username}`;
  window.location.href = `/home/${username}`;
});

// CHECK DATA
const checkData = () => {
  const hasImage = !photoContainer.classList.contains("hidden");
  if (hasImage) {
    predictBreedButton.classList.remove("hidden");
    predictCoatColorButton.classList.remove("hidden");
  } else {
    predictBreedButton.classList.add("hidden");
    predictCoatColorButton.classList.add("hidden");
  }

  if (hasImage && nameInput.value && breedInput.value && coatColorInput.value && genderSelect.value && birthdayInput.value) {
    createButton.classList.remove("disabled");
  } else {
    createButton.classList.add("disabled");
  }
};

// IMAGE UPLOAD
uploadImage.addEventListener("change", function () {
  photoContainer.classList.remove("hidden");

  const file = this.files[0];
  data.image = file;

  const reader = new FileReader();

  if (file.type.match("image.*")) {
    reader.readAsDataURL(file);
  } else {
    photoContainer.classList.add("hidden");
  }

  reader.onloadend = async function () {
    photoContainer.src = reader.result;
    checkData();
  };

  checkData();
});

// PREDICT BREED
predictBreedButton.addEventListener("click", async () => {
  breedInput.value = "";
  predictBreedButton.classList.add("hidden");
  loaderBreed.classList.remove("hidden");

  let formData = new FormData();
  formData.append("image", data.image);

  // PREDICT BREED
  await fetch("/predict-breed", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      // User has been saved, copy to userData
      let dataCopy = data;
      console.log(dataCopy);
      breedInput.value = dataCopy.breed;

      predictBreedButton.classList.remove("hidden");
      loaderBreed.classList.add("hidden");
    })
    .catch((error) => {
      console.log(error);
    });
});

// PREDICT COAT COLOR
predictCoatColorButton.addEventListener("click", () => {
  console.log("predict coat color");
});

// CREATE BUTTON
createButton.addEventListener("click", async () => {
  let formData = new FormData();
  formData.append("name", nameInput.value);
  formData.append("owner", username);
  formData.append("breed", breedInput.value);
  formData.append("coat_color", coatColorInput.value);
  formData.append("gender", genderSelect.value);
  formData.append("birthday", birthdayInput.value);
  formData.append("image", data.image);

  // SAVE PET
  await fetch(`/save-pet/${username}`, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      // Pet has been saved and added to user's pets
      window.location.href = `/home/${username}`;
    })
    .catch((error) => {
      console.log(error);
    });
});
