const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const lengthDisplay = document.querySelector("[data-lengthDisplay]");
const inputSlider = document.querySelector("[data-lengthSlider]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let checkCount = 1;
let passwordLength = 10;
lowercaseCheck.checked = true;
handleSlider();
// set strength using circle later
setIndicator("#9f9292");

// set password length
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerHTML = passwordLength;
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize = ((passwordLength-min)*100 / (max-min)) + "% 100%";

}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// genarate any random no. b/w min and max
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// generates any number b/w 0 - 9
function generateRandomNumber() {
  return getRndInteger(0, 9);
}

// generates any lowercase digit b/w a - z
function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}

// generates any uppercase digit b/w A - Z
function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

//generates any symbols
function generateSymbol() {
  //   const symbolArr = Array.from(symbols);
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNumber = false;
  let hasSymbol = false;

  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNumber = true;
  if (symbolsCheck.checked) hasSymbol = true;

  if (hasUpper && hasNumber && hasNumber && hasSymbol && passwordLength >= 8) {
    setIndicator("green");
  } else if (
    (hasUpper || hasLower) &&
    (hasNumber || hasSymbol) &&
    passwordLength >= 6
  ) {
    setIndicator("yellow");
  } else setIndicator("red");
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "Copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }
  // for make copy wala span active
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

copyBtn.addEventListener("click", () => {
  // if (passwordDisplay.value) {
  //   copyContent();
  // }
  if (passwordDisplay.value) copyContent();
});

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

function shufflePassword(array) {
  //fisher yates method -> shuffle algo
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  //special condition
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

generateBtn.addEventListener("click", () => {
  //none of the checkbox are selected
  if (checkCount == 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  //let's start journey of getting random pass

  password = "";

  //let's put stuff mentioned by checkboxes
  // if (uppercaseCheck.checked) {
  //   password = password + generateUpperCase();
  // }

  // if (lowercaseCheck.checked) {
  //   password = password + generateLowerCase();
  // }

  // if (numbersCheck.checked) {
  //   password = password + generateRandomNumber();
  // }

  // if (symbolsCheck.checked) {
  //   password = password + generateSymbol();
  // }

  let funcArr = [];
  if (uppercaseCheck.checked) funcArr.push(generateUpperCase);
  if (lowercaseCheck.checked) funcArr.push(generateLowerCase);
  if (numbersCheck.checked) funcArr.push(generateRandomNumber);
  if (symbolsCheck.checked) funcArr.push(generateSymbol);

  //compulsory addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  //remaining addition
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndx = getRndInteger(0, funcArr.length);
    password += funcArr[randIndx]();
  }

  //shuffling the password for get rand pass
  password = shufflePassword(Array.from(password));
  //shows in UI
  passwordDisplay.value = password;
  //calculate strength
  calcStrength();
});

