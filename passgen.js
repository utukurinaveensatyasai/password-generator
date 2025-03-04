const sliderInput = document.querySelector("[data-lengthSlider]");
const lengthIndicator = document.querySelector("[data-lengthNumber]");
const passwordField = document.querySelector("[data-passwordDisplay]");
const copyButton = document.querySelector("[data-copy]");
const copyMessage = document.querySelector("[data-copyMsg]");
const upperCaseOption = document.querySelector("#uppercase");
const lowerCaseOption = document.querySelector("#lowercase");
const numberOption = document.querySelector("#numbers");
const symbolOption = document.querySelector("#symbols");
const strengthIndicator = document.querySelector("[data-indicator]");
const generateButton = document.querySelector(".generateButton");
const checkBoxes = document.querySelectorAll("input[type=checkbox]");
const specialCharacters = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let generatedPassword = "";
let passwordLength = 10;
let selectedOptionsCount = 0;

updateSlider();
setStrengthIndicator("#ccc");

function updateSlider() {
  sliderInput.value = passwordLength;
  lengthIndicator.innerText = passwordLength;

  const min = sliderInput.min;
  const max = sliderInput.max;
  sliderInput.style.backgroundSize = ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

function setStrengthIndicator(color) {
  strengthIndicator.style.backgroundColor = color;
  strengthIndicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// Generate random numbers and characters
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRandomInteger(0, 9);
}

function generateUpperCaseLetter() {
  return String.fromCharCode(getRandomInteger(65, 91));
}

function generateLowerCaseLetter() {
  return String.fromCharCode(getRandomInteger(97, 123));
}

function generateRandomSymbol() {
  return specialCharacters.charAt(getRandomInteger(0, specialCharacters.length));
}

// 🛠️ Fixed Strength Calculation Logic
function evaluateStrength() {
  let hasUpper = upperCaseOption.checked;
  let hasLower = lowerCaseOption.checked;
  let hasNumber = numberOption.checked;
  let hasSymbol = symbolOption.checked;

  if (hasUpper && hasLower && hasNumber && hasSymbol && passwordLength >= 12) {
    setStrengthIndicator("#0f0");  // Strong (Green)
  } else if ((hasUpper || hasLower) && (hasNumber || hasSymbol) && passwordLength >= 8) {
    setStrengthIndicator("#ff0");  // Medium (Yellow)
  } else {
    setStrengthIndicator("#f00");  // Weak (Red)
  }
}

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(passwordField.value);
    copyMessage.innerText = "Copied!";
  } catch (error) {
    copyMessage.innerText = "Failed!";
  }
  copyMessage.classList.add("active");
  setTimeout(() => copyMessage.classList.remove("active"), 2000);
}

function shuffleCharacters(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join("");
}

function updateCheckBoxCount() {
  selectedOptionsCount = Array.from(checkBoxes).filter(checkbox => checkbox.checked).length;
  if (passwordLength < selectedOptionsCount) {
    passwordLength = selectedOptionsCount;
    updateSlider();
  }
}

checkBoxes.forEach(checkbox => checkbox.addEventListener("change", updateCheckBoxCount));

sliderInput.addEventListener("input", (event) => {
  passwordLength = event.target.value;
  updateSlider();
  evaluateStrength();  // Update strength when changing length
});

copyButton.addEventListener("click", () => {
  if (passwordField.value) {
    copyToClipboard();
  }
});

generateButton.addEventListener("click", () => {
  if (selectedOptionsCount === 0) {
    return;
  }
  if (passwordLength < selectedOptionsCount) {
    passwordLength = selectedOptionsCount;
    updateSlider();
  }

  generatedPassword = "";
  let functionArray = [];

  if (upperCaseOption.checked) functionArray.push(generateUpperCaseLetter);
  if (lowerCaseOption.checked) functionArray.push(generateLowerCaseLetter);
  if (numberOption.checked) functionArray.push(generateRandomNumber);
  if (symbolOption.checked) functionArray.push(generateRandomSymbol);

  for (let i = 0; i < functionArray.length; i++) {
    generatedPassword += functionArray[i]();
  }

  for (let i = 0; i < passwordLength - functionArray.length; i++) {
    generatedPassword += functionArray[getRandomInteger(0, functionArray.length)]();
  }

  generatedPassword = shuffleCharacters(Array.from(generatedPassword));
  passwordField.value = generatedPassword;
  evaluateStrength();  // Update strength after generating password
});
