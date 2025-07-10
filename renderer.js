function cleanNumber() {
  const phoneNumberInput = document.getElementById("phone");
  const countryCodeInput = document.getElementById("country");
  const messageInput = document.getElementById("message");
  let phoneNumber = phoneNumberInput.value.replace(/\D/g, ""); // remove all non-digit characters
  const countryCode = countryCodeInput.value;
  const message = messageInput.value.trim();
  const originalNumber = phoneNumberInput.value;

  // Remove leading zeros, but keep at least one digit
  phoneNumber = phoneNumber.replace(/^0+/, '');

  // Check if country code is selected
  if (!countryCode) {
    document.getElementById("error").textContent = "Please select a country code";
    countryCodeInput.focus();
    return;
  }

  // Check if the phone number is valid
  if (phoneNumber.length !== 9 && phoneNumber.length !== 10 && phoneNumber.length !== 12) {
    document.getElementById("error").textContent = "Please enter a valid phone number (9-12 digits)";
    phoneNumberInput.classList.add("error-animation");
    return;
  }

  // Prepend the country code if necessary
  let formattedNumber = phoneNumber;
  if (phoneNumber.length === 10 && !phoneNumber.startsWith(countryCode)) {
    formattedNumber = countryCode + phoneNumber;
  } else if (phoneNumber.length === 12 && !phoneNumber.startsWith("00" + countryCode)) {
    formattedNumber = countryCode + phoneNumber.substring(2);
  }

  const link = "https://wa.me/" + formattedNumber + (message ? "?text=" + encodeURIComponent(message) : "");
  const displayLink = link.length > 60 ? link.substring(0, 60) + "..." : link;
  document.getElementById("result").innerHTML = `<a href="${link}" id="waLink" target="_blank">${displayLink}</a>
  <div class="result-buttons-wrapper">
  <button onclick="copyToClipboard()" class="btn btn-secondary">Copy link</button><button onclick="clearForm()" class="btn btn-secondary">Clear</button></div>`;
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
  document.getElementById("message").value = "";
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

// Clear errors when user starts typing
document.getElementById("phone").addEventListener("input", function () {
  document.getElementById("error").textContent = "";
  this.classList.remove("error-animation");
});

document.getElementById("message").addEventListener("keydown", function (event) {
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

// document.getElementById("share-button").addEventListener("click", function () {
//   // Construct the WhatsApp URL with the message to share
//   const shareUrl = "https://wa.me/?text=" + encodeURIComponent("Check out this app: https://whatsapp-number-cleaner.netlify.com");

//   // If the Web Share API is available (on mobile), use it
//   if (navigator.share) {
//     navigator.share({
//       title: "WhatsApp Number Cleaner",
//       url: shareUrl
//     }).then(() => {
//       console.log("Thanks for sharing!");
//     })
//     .catch(console.error);
//   } else {
//     // If the Web Share API is not available, open the WhatsApp URL in a new tab
//     window.open(shareUrl, "_blank");
//   }
// });

let qrCodeGenerated = false; 

function generateQRCode() {
  const qrCodeImage = document.querySelector("#qrcode-container");

  if (!qrCodeGenerated) {
    const shareUrl = "https://wa.me/?text=" + encodeURIComponent("Check out this app: https://whatsapp-number-cleaner.netlify.com");
    new QRCode(document.getElementById("qrcode-image"), {
      text: shareUrl,
      width: 200, // Adjust this size as needed
      height: 200, // Adjust this size as needed
    });
    qrCodeGenerated = true; // Set the flag to indicate QR code generation
  }

  // Always show the QR code when the share button is pressed
  qrCodeImage.classList.add("showQr");
  qrCodeImage.classList.remove("hideQr");
}

const qrExit = document.querySelector(".exit-svg");
qrExit.addEventListener("click", () => {
  const qrCodeImage = document.querySelector("#qrcode-container");
  qrCodeImage.classList.remove("showQr");
  qrCodeImage.classList.add("hideQr");
});

// Parse URL parameters and prefill message field
function parseURLParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const textParam = urlParams.get('text');
  if (textParam) {
    const messageInput = document.getElementById("message");
    if (messageInput) {
      messageInput.value = decodeURIComponent(textParam);
    }
  }
}

// Initialize URL parameter parsing when page loads
document.addEventListener('DOMContentLoaded', parseURLParams);



