const signInButton = document.querySelector("#sign-in-button-js");
const signInButtonTwo = document.querySelector("#sign-in-button-two-js");
const signInContainer = document.querySelector("#sign-in-container-js");
const signInUpContainer = document.querySelector("#sign-in-up-container-js");
const backButton = document.querySelector("#back-button-js");

const usernameInput = document.querySelector("#username-input-js");
const passwordInput = document.querySelector("#password-input-js");

const errorMessageContainer = document.querySelector(".error-message-container");

signInButton.addEventListener("click", () => {
  signInUpContainer.classList.add("hidden");
  signInContainer.classList.remove("hidden");
  backButton.classList.remove("hidden");
});

signInButtonTwo.addEventListener("click", async () => {
  let formData = new FormData();
  formData.append("username", usernameInput.value);
  formData.append("password", passwordInput.value);

  // SIGN IN
  await fetch("/sign-in", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      const dataCopy = data;

      if (dataCopy.isValid == false) {
        errorMessageContainer.classList.remove("hidden");
      } else {
        errorMessageContainer.classList.add("hidden");
        window.location.href = `/home/${usernameInput.value}`;
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

backButton.addEventListener("click", () => {
  signInUpContainer.classList.remove("hidden");
  signInContainer.classList.add("hidden");
  backButton.classList.add("hidden");
});
