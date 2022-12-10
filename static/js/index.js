/* Select - no option selected */
document.querySelectorAll("select").forEach((select) => (select.selectedIndex = -1));

/* Select change event listener */
document.querySelectorAll("select").forEach((select) => {
  select.addEventListener("change", async () => {
    // Get selected breed
    const selectedBreed = select.value;
    // Get ID of select
    const selectID = select.getAttribute("id");

    // Update height, weight input values
    await fetch("/static/json/breed-attributes.json")
      .then((res) => res.json())
      .then((data) => {
        breedAttributes = data;
        const breedAttribute = breedAttributes.filter((e) => e.breed == selectedBreed);
        // A or B
        if (selectID == "select-breed-a-js") {
          document.querySelector("#input-height-a-js").value = breedAttribute[0].height;
          document.querySelector("#input-weight-a-js").value = breedAttribute[0].weight;
          document.querySelector("#input-height-a-js").classList.remove("opaque");
          document.querySelector("#input-weight-a-js").classList.remove("opaque");
        } else {
          document.querySelector("#input-height-b-js").value = breedAttribute[0].height;
          document.querySelector("#input-weight-b-js").value = breedAttribute[0].weight;
          document.querySelector("#input-height-b-js").classList.remove("opaque");
          document.querySelector("#input-weight-b-js").classList.remove("opaque");
        }
      });

    // Check heart
    checkIfActivateHeart();
  });
});

/* Modal Thingz */

const modalOffspringContainer = document.querySelector(".modal-offspring-container");
const modalOffspringContent = document.querySelector(".modal-offspring-content");

/* Image Upload */
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const imageUploadContainerA = document.querySelector("#image-upload-container-A");
const imageUploadContainerB = document.querySelector("#image-upload-container-B");

const modalGalleryCameraContainer = document.querySelector(".modal-gallery-camera-container");
const modalGalleryCameraContent = document.querySelector(".modal-gallery-camera-content");

const cameraOption = document.querySelector("#camera-option");
const galleryOption = document.querySelector("#gallery-option");

let AorB = "";

// MOBAYLLLLL
if (isMobile) {
  // Show Options
  imageUploadContainerA.addEventListener("click", () => {
    document.body.style.overflow = "hidden"; // Disable scrolling of body
    AorB = "A";
    modalGalleryCameraContainer.classList.remove("hidden");
  });

  imageUploadContainerB.addEventListener("click", () => {
    document.body.style.overflow = "hidden"; // Disable scrolling of body
    AorB = "B";
    modalGalleryCameraContainer.classList.remove("hidden");
  });

  // Event Listeners for Camera or Gallery
  cameraOption.addEventListener("click", () => {
    if (AorB == "A") {
      document.getElementById("camera-upload-A").click();
      document.body.style.overflow = "auto"; // Enable scrolling of body
      modalGalleryCameraContainer.classList.add("hidden");
    } else {
      document.getElementById("camera-upload-B").click();
      document.body.style.overflow = "auto"; // Enable scrolling of body
      modalGalleryCameraContainer.classList.add("hidden");
    }
  });

  galleryOption.addEventListener("click", () => {
    if (AorB == "A") {
      document.getElementById("gallery-upload-A").click();
      document.body.style.overflow = "auto"; // Enable scrolling of body
      modalGalleryCameraContainer.classList.add("hidden");
    } else {
      document.getElementById("gallery-upload-B").click();
      document.body.style.overflow = "auto"; // Enable scrolling of body
      modalGalleryCameraContainer.classList.add("hidden");
    }
  });
} else {
  // DEKSTOPPPPPP
  imageUploadContainerA.addEventListener("click", () => {
    AorB = "A";
    document.getElementById("gallery-upload-A").click();
  });
  imageUploadContainerB.addEventListener("click", () => {
    AorB = "B";
    document.getElementById("gallery-upload-B").click();
  });
}

document.querySelector("#gallery-upload-A").addEventListener("change", previewImage);
document.querySelector("#gallery-upload-B").addEventListener("change", previewImage);
document.querySelector("#camera-upload-A").addEventListener("change", previewImage);
document.querySelector("#camera-upload-B").addEventListener("change", previewImage);

const imagePlaceholderA = document.querySelector(".image-placeholder.a");
const imagePlaceholderB = document.querySelector(".image-placeholder.b");

const imageUploadA = document.querySelector(".image-upload.a");
const imageUploadB = document.querySelector(".image-upload.b");

const imageUploadLoaderA = document.querySelector(".image-upload-loader.a");
const imageUploadLoaderB = document.querySelector(".image-upload-loader.b");

function previewImage() {
  const file = this.files[0];
  const reader = new FileReader();

  reader.onloadend = async function () {
    if (AorB == "A") {
      // AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

      // Reset values to empty
      document.querySelector("#select-breed-a-js").selectedIndex = -1;
      document.querySelector("#input-color-a-js").value = "";
      document.querySelector("#input-height-a-js").value = "";
      document.querySelector("#input-weight-a-js").value = "";

      // Reset error message
      document.querySelector(".error-message.a").classList.add("hidden");

      console.log("To A");
      imagePlaceholderA.classList.add("hidden");
      imageUploadA.src = reader.result;
      imageUploadA.classList.remove("hidden");

      // Show image upload loader
      imageUploadLoaderA.classList.remove("hidden");

      // Form data
      let formData = new FormData();
      formData.append("image", file);

      // Face detector
      let isFace = "";
      await fetch("/face-detector", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          isFace = data.isFace;
        });

      console.log("isFace: ", isFace);

      if (isFace) {
        imagePlaceholderA.classList.remove("hidden");
        imageUploadA.src = "";
        imageUploadA.classList.add("hidden");

        // Hide image upload loader
        imageUploadLoaderA.classList.add("hidden");

        document.querySelector(".error-message.a").innerHTML = "Hooman detected!";
        document.querySelector(".error-message.a").classList.remove("hidden");
        return;
      }

      // If isFace == false, continue

      // Predict Breed
      document.querySelector("#select-breed-a-js").classList.remove("input-disabled", "opaque");
      document.querySelector("#select-breed-a-js").classList.add("input-loader");
      await fetch("/predict-breed", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          const dataTemp = data;
          formData.append("imageFilename", dataTemp.imageFilename);
          document.querySelector("#select-breed-a-js").value = dataTemp.breed;
          document.querySelector("#select-breed-a-js").classList.remove("input-loader");
        })
        .catch((error) => {
          console.log(error);
        });

      // Predict Coat Color
      document.querySelector("#input-color-a-js").classList.remove("input-disabled", "opaque");
      document.querySelector("#input-color-a-js").classList.add("input-loader");
      await fetch("/predict-coat-color", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          const dataTemp = data;
          document.querySelector("#input-color-a-js").value = dataTemp.color;
          document.querySelector("#input-color-a-js").classList.remove("input-loader");
        })
        .catch((error) => {
          console.log(error);
        });

      // Update Height and Weight
      const selectedBreed = document.querySelector("#select-breed-a-js").value;
      await fetch("/static/json/breed-attributes.json")
        .then((res) => res.json())
        .then((data) => {
          breedAttributes = data;
          const breedAttribute = breedAttributes.filter((e) => e.breed == selectedBreed);
          document.querySelector("#input-height-a-js").value = breedAttribute[0].height;
          document.querySelector("#input-weight-a-js").value = breedAttribute[0].weight;
          document.querySelector("#input-height-a-js").classList.remove("opaque");
          document.querySelector("#input-weight-a-js").classList.remove("opaque");
        });

      // Hide image upload loader
      imageUploadLoaderA.classList.add("hidden");

      // Check heart
      checkIfActivateHeart();
    } else {
      // BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBb

      // Reset values to empty
      document.querySelector("#select-breed-b-js").selectedIndex = -1;
      document.querySelector("#input-color-b-js").value = "";
      document.querySelector("#input-height-b-js").value = "";
      document.querySelector("#input-weight-b-js").value = "";

      // Reset error message
      document.querySelector(".error-message.b").classList.add("hidden");

      console.log("To B");
      imagePlaceholderB.classList.add("hidden");
      imageUploadB.src = reader.result;
      imageUploadB.classList.remove("hidden");

      // Show image upload loader
      imageUploadLoaderB.classList.remove("hidden");

      // Form data
      let formData = new FormData();
      formData.append("image", file);

      // Face detector
      let isFace = "";
      await fetch("/face-detector", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          isFace = data.isFace;
        });

      console.log("isFace: ", isFace);

      if (isFace) {
        imagePlaceholderB.classList.remove("hidden");
        imageUploadB.src = "";
        imageUploadB.classList.add("hidden");

        // Hide image upload loader
        imageUploadLoaderB.classList.add("hidden");

        document.querySelector(".error-message.b").innerHTML = "Hooman detected!";
        document.querySelector(".error-message.b").classList.remove("hidden");
        return;
      }

      // If isFace == false, continue

      // Predict Breed
      document.querySelector("#select-breed-b-js").classList.remove("input-disabled", "opaque");
      document.querySelector("#select-breed-b-js").classList.add("input-loader");
      await fetch("/predict-breed", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          const dataTemp = data;
          formData.append("imageFilename", dataTemp.imageFilename);
          document.querySelector("#select-breed-b-js").value = dataTemp.breed;
          document.querySelector("#select-breed-b-js").classList.remove("input-loader");
        })
        .catch((error) => {
          console.log(error);
        });

      // Predict Coat Color
      document.querySelector("#input-color-b-js").classList.remove("input-disabled", "opaque");
      document.querySelector("#input-color-b-js").classList.add("input-loader");
      await fetch("/predict-coat-color", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          const dataTemp = data;
          document.querySelector("#input-color-b-js").value = dataTemp.color;
          document.querySelector("#input-color-b-js").classList.remove("input-loader");
        })
        .catch((error) => {
          console.log(error);
        });

      // Update Height and Weight
      const selectedBreed = document.querySelector("#select-breed-b-js").value;
      await fetch("/static/json/breed-attributes.json")
        .then((res) => res.json())
        .then((data) => {
          breedAttributes = data;
          const breedAttribute = breedAttributes.filter((e) => e.breed == selectedBreed);
          document.querySelector("#input-height-b-js").value = breedAttribute[0].height;
          document.querySelector("#input-weight-b-js").value = breedAttribute[0].weight;
          document.querySelector("#input-height-b-js").classList.remove("opaque");
          document.querySelector("#input-weight-b-js").classList.remove("opaque");
        });

      // Hide image upload loader
      imageUploadLoaderB.classList.add("hidden");

      // Check heart
      checkIfActivateHeart();
    }
  };

  if (file.type.match("image.*")) {
    reader.readAsDataURL(file);
  } else {
    if (AorB == "A") {
      imagePlaceholderA.classList.remove("hidden");
      imageUploadA.src = "";
      imageUploadA.classList.add("hidden");
    } else {
      imagePlaceholderB.classList.remove("hidden");
      imageUploadB.src = "";
      imageUploadB.classList.add("hidden");
    }
  }
}

// Check if image inputs are all present so we can activate heart and predict offsprings
const checkIfActivateHeart = async () => {
  // Get value of inputs
  const selectBreedA = document.querySelector("#select-breed-a-js").value;
  const selectBreedB = document.querySelector("#select-breed-b-js").value;
  const inputColorA = document.querySelector("#input-color-a-js").value;
  const inputColorB = document.querySelector("#input-color-b-js").value;
  const inputHeightA = document.querySelector("#input-height-a-js").value;
  const inputHeightB = document.querySelector("#input-height-b-js").value;
  const inputWeightA = document.querySelector("#input-weight-a-js").value;
  const inputWeightB = document.querySelector("#input-weight-b-js").value;

  // If all is not empty, activate heart, show offsprings
  if (selectBreedA && selectBreedB && inputColorA && inputColorB && inputHeightA && inputHeightB && inputWeightA && inputWeightB) {
    document.querySelector(".heart-container > img").src = "/static/images/assets/heart.gif";

    // Get folder name
    let breedAArr = selectBreedA.split(" ");
    let breedAArrLength = breedAArr.length;
    let breedA = selectBreedA;
    if (breedAArrLength > 1) {
      breedA = breedAArr[0] + "-";
      for (let x = 1; x < breedAArrLength; x++) {
        if (x + 1 == breedAArrLength) {
          breedA = breedA + breedAArr[x];
        } else {
          breedA = breedA + breedAArr[x] + "-";
        }
      }
    }
    breedA = breedA.toLowerCase();

    let breedBArr = selectBreedB.split(" ");
    let breedBArrLength = breedBArr.length;
    let breedB = selectBreedB;
    if (breedBArrLength > 1) {
      breedB = breedBArr[0] + "-";
      for (let x = 1; x < breedBArrLength; x++) {
        if (x + 1 == breedBArrLength) {
          breedB = breedB + breedBArr[x];
        } else {
          breedB = breedB + breedBArr[x] + "-";
        }
      }
    }
    breedB = breedB.toLowerCase();

    const folder = breedA + "-" + inputColorA.toLowerCase() + "-" + breedB + "-" + inputColorB.toLowerCase();
    const folderAlt = breedB + "-" + inputColorB.toLowerCase() + "-" + breedA + "-" + inputColorA.toLowerCase();
    console.log("Offsprings folder: ", folder);
    console.log("Offsprings folder alt: ", folderAlt);

    // Retrieve offsprings images from folder / folderAlt
    let offspringsImagesPaths = [];
    await fetch(`/offsprings-filepaths/${folder}/${folderAlt}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        offspringsImagesPaths = data.offspringsFilepaths;
      });
    console.log(offspringsImagesPaths);

    // If no images
    if (offspringsImagesPaths.length == 0) {
      // remove images
      document.querySelectorAll(".offspring-image-container").forEach((el) => el.remove());
      document.querySelector(".no-offsprings-message").classList.remove("hidden");
    } else {
      // remove images
      document.querySelectorAll(".offspring-image-container").forEach((el) => el.remove());
      // If there are images, show
      document.querySelector(".no-offsprings-message").classList.add("hidden");
      offspringsImagesPaths.forEach((imagePath) => {
        document.querySelector(".offsprings-container").innerHTML += `
          <div class="offspring-image-container">
            <img src="${imagePath}" draggable="false">
          </div>
        `;
      });

      // Add event listeners for modal
      const offspringImageContainers = document.querySelectorAll(".offspring-image-container");

      offspringImageContainers.forEach((offspringImageContainer) => {
        offspringImageContainer.addEventListener("click", () => {
          modalOffspringContent.querySelector("div > img").src = offspringImageContainer.querySelector("img").src;
          document.body.style.overflow = "hidden"; // Disable scrolling of body
          modalOffspringContainer.classList.remove("hidden");
        });
      });
    }
  } else {
    document.querySelector(".heart-container > img").src = "/static/images/assets/heart.svg";
  }
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modalGalleryCameraContent) {
    document.body.style.overflow = "auto"; // Enable scrolling of body
    modalGalleryCameraContainer.classList.add("hidden");
  }
  if (event.target == modalOffspringContent) {
    document.body.style.overflow = "auto"; // Enable scrolling of body
    modalOffspringContainer.classList.add("hidden");
  }
};
