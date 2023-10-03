function cleanNumber() {
  const phoneNumberInput = document.getElementById("phone");
  const countryCodeInput = document.getElementById("country");
  let phoneNumber = phoneNumberInput.value.replace(/\D/g, ""); // remove all non-digit characters
  
  // Remove leading '0' if present
  if (phoneNumber.startsWith("0")) {
    phoneNumber = phoneNumber.substring(1);
  }
  
  const countryCode = countryCodeInput.value;

  // Check if the phone number is valid
  if (phoneNumber.length !== 10 && phoneNumber.length !== 12) {
    document.getElementById("error").textContent = "Invalid phone number";
    phoneNumberInput.classList.add("error-animation");
    return;
  }

  // Prepend the country code if necessary
  let formattedNumber = phoneNumber;
  if (phoneNumber.length === 10 && !phoneNumber.startsWith(countryCode)) {
    formattedNumber = countryCode + phoneNumber;
  } else if (phoneNumber.length === 12 && !phoneNumber.startsWith("00" + countryCode)) {
    formattedNumber = "00" + countryCode + phoneNumber.substring(2);
  }

  const link = "https://wa.me/" + formattedNumber;
  document.getElementById("result").innerHTML = `<a href="${link}" id="waLink" target="_blank">${link}</a> <button onclick="copyToClipboard()" class="btn btn-secondary">Copy link</button><button onclick="clearForm()" class="btn btn-secondary">Clear</button>`;
  document.getElementById("phone").value = ""; // Clear the phone number input field

  // Apply animation to indicate a new number was processed
  phoneNumberInput.classList.add("success-animation");

  // Clear any error message and animation after a delay
  setTimeout(() => {
    document.getElementById("error").textContent = "";
    phoneNumberInput.classList.remove("error-animation");
    phoneNumberInput.classList.remove("success-animation");
  }, 2000);
}

function clearForm() {
  document.getElementById("phone").value = "";
  document.getElementById("result").innerHTML = "";
  document.getElementById("error").textContent = "";
}

function copyToClipboard() {
  const waLink = document.getElementById("waLink").getAttribute("href");
  navigator.clipboard.writeText(waLink).then(() => {
    console.log("WhatsApp link copied to clipboard!");
  });
}

document.getElementById("phone").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent the default Enter key behavior (e.g., form submission)
    document.getElementById("button-addon2").click(); // Simulate a click on the button
  }
});

document.getElementById("button-addon2").addEventListener("mousedown", function () {
  this.style.backgroundColor = "#227ad1";
});

document.getElementById("button-addon2").addEventListener("mouseup", function () {
  this.style.backgroundColor = "";
});
