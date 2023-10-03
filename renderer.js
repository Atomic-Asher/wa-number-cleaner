// Utility function to remove all non-digit characters
const sanitizeNumber = (number) => number.replace(/\D/g, "");

// Function to validate phone number length based on country code
const isValidNumber = (number, countryCode) => {
  const numberLength = {
    '91': 10,
    '1': 10,
    '44': 10,
    '81': 10,
  };
  return number.length === numberLength[countryCode];
};

// Function to format phone number with country code
const formatNumber = (number, countryCode) => {
  let formattedNumber = number;
  if (!number.startsWith(countryCode)) {
    formattedNumber = countryCode + number;
  }
  return formattedNumber;
};

// Main function to clean and process the phone number
async function cleanNumber() {
  const phoneNumberInput = document.getElementById("phone");
  const countryCodeInput = document.getElementById("country");
  const phoneNumber = sanitizeNumber(phoneNumberInput.value);
  const countryCode = countryCodeInput.value;

  if (!isValidNumber(phoneNumber, countryCode)) {
    displayError("Invalid phone number");
    return;
  }

  const formattedNumber = formatNumber(phoneNumber, countryCode);
  const link = "https://wa.me/" + formattedNumber;
  displayResult(link);

  clearInput();
}

// Function to display the result
const displayResult = (link) => {
  document.getElementById("result").innerHTML = `<a href="${link}" id="waLink" target="_blank">${link}</a> <button onclick="copyToClipboard()" class="btn btn-secondary">Copy link</button><button onclick="clearForm()" class="btn btn-secondary">Clear</button>`;
};

// Function to display errors
const displayError = (errorMessage) => {
  document.getElementById("error").textContent = errorMessage;
};

// Function to clear the phone input
const clearInput = () => {
  document.getElementById("phone").value = "";
};

// Function to copy link to clipboard
async function copyToClipboard() {
  const waLink = document.getElementById("waLink").getAttribute("href");
  try {
    await navigator.clipboard.writeText(waLink);
    console.log("WhatsApp link copied to clipboard!");
  } catch (err) {
    console.error("Could not copy text: ", err);
  }
}

// Initialize
function initialize() {
  document.getElementById("phone").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("button-addon2").click();
    }
  });

  document.getElementById("button-addon2").addEventListener("mousedown", function () {
    this.style.backgroundColor = "#227ad1";
  });

  document.getElementById("button-addon2").addEventListener("mouseup", function () {
    this.style.backgroundColor = "";
  });
}

initialize();
