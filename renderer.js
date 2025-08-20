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
  
  // Check if number already starts with country code
  if (phoneNumber.startsWith(countryCode)) {
    formattedNumber = phoneNumber;
  } else if (phoneNumber.startsWith("00" + countryCode)) {
    // Remove "00" prefix and keep country code
    formattedNumber = phoneNumber.substring(2);
  } else {
    // Add country code to numbers that don't have it
    if (phoneNumber.length === 9 || phoneNumber.length === 10) {
      formattedNumber = countryCode + phoneNumber;
    } else if (phoneNumber.length === 12) {
      // Assume it's international format, try to extract local number
      if (phoneNumber.startsWith("00")) {
        formattedNumber = countryCode + phoneNumber.substring(2 + countryCode.length);
      } else {
        formattedNumber = countryCode + phoneNumber.substring(countryCode.length);
      }
    }
  }

  const link = "https://wa.me/" + formattedNumber + (message ? "?text=" + encodeURIComponent(message) : "");
  const displayLink = link.length > 60 ? link.substring(0, 60) + "..." : link;
  
  // Add debug info for development
  console.log("Debug info:", {
    original: originalNumber,
    cleaned: phoneNumber,
    countryCode: countryCode,
    formatted: formattedNumber,
    link: link
  });
  
  document.getElementById("result").innerHTML = `
    <div style="margin-bottom: 10px; font-size: 1.4rem; color: #007aff;">
      <strong>Formatted Number:</strong> +${formattedNumber}
    </div>
    <a href="${link}" id="waLink" target="_blank">${displayLink}</a>
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
    showCopyFeedback("WhatsApp link copied!");
  }).catch(err => {
    console.error("Failed to copy: ", err);
    // Fallback for older browsers
    fallbackCopyTextToClipboard(waLink);
  });
}

function copyAppUrlToClipboard() {
  const currentUrl = window.location.href;
  navigator.clipboard.writeText(currentUrl).then(() => {
    console.log("App URL copied to clipboard!");
    showCopyFeedback("App URL copied!");
  }).catch(err => {
    console.error("Failed to copy: ", err);
    // Fallback for older browsers
    fallbackCopyTextToClipboard(currentUrl);
  });
}

function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  
  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    const msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
    if (successful) {
      showCopyFeedback("Copied!");
    }
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}

function showCopyFeedback(message) {
  // Create or update feedback element
  let feedback = document.getElementById("copy-feedback");
  if (!feedback) {
    feedback = document.createElement("div");
    feedback.id = "copy-feedback";
    feedback.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 10px 15px;
      border-radius: 5px;
      z-index: 1000;
      font-size: 14px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(feedback);
  }
  
  feedback.textContent = message;
  feedback.style.opacity = "1";
  
  // Hide after 2 seconds
  setTimeout(() => {
    feedback.style.opacity = "0";
  }, 2000);
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

function detectAndSetCountry() {
  const countrySelect = document.getElementById("country");
  
  const language = navigator.language || navigator.userLanguage;
  const locale = language.toLowerCase();
  
  // Debug logging
  console.log("Browser language:", language);
  console.log("Processed locale:", locale);
  
  // Country code mapping based on common locales
  const localeToCountryCode = {
    // English variants
    'en-us': '1',    // United States
    'en-gb': '44',   // United Kingdom
    'en-au': '61',   // Australia
    'en-ca': '1',    // Canada
    'en-in': '91',   // India (English)
    'en-za': '27',   // South Africa
    'en-nz': '64',   // New Zealand
    'en-ie': '353',  // Ireland
    
    // Spanish variants
    'es-es': '34',   // Spain
    'es-mx': '52',   // Mexico
    'es-ar': '54',   // Argentina
    'es-co': '57',   // Colombia
    'es-cl': '56',   // Chile
    'es-pe': '51',   // Peru
    'es-ve': '58',   // Venezuela
    
    // French variants
    'fr-fr': '33',   // France
    'fr-ca': '1',    // Canada (French)
    'fr-be': '32',   // Belgium (French)
    'fr-ch': '41',   // Switzerland (French)
    
    // German variants
    'de-de': '49',   // Germany
    'de-at': '43',   // Austria
    'de-ch': '41',   // Switzerland (German)
    
    // Other European languages
    'it-it': '39',   // Italy
    'pt-pt': '351',  // Portugal
    'pt-br': '55',   // Brazil
    'ru-ru': '7',    // Russia
    'nl-nl': '31',   // Netherlands
    'pl-pl': '48',   // Poland
    'sv-se': '46',   // Sweden
    'no-no': '47',   // Norway
    'da-dk': '45',   // Denmark
    'fi-fi': '358',  // Finland
    
    // Asian languages
    'hi-in': '91',   // India (Hindi)
    'ja-jp': '81',   // Japan
    'ko-kr': '82',   // South Korea
    'zh-cn': '86',   // China
    'zh-tw': '886',  // Taiwan
    'th-th': '66',   // Thailand
    'vi-vn': '84',   // Vietnam
    'id-id': '62',   // Indonesia
    'ms-my': '60',   // Malaysia
    'tl-ph': '63',   // Philippines
    'ur-pk': '92',   // Pakistan
    'bn-bd': '880',  // Bangladesh
    'ta-lk': '94',   // Sri Lanka
    'ne-np': '977',  // Nepal
    
    // Arabic variants
    'ar-sa': '966',  // Saudi Arabia
    'ar-ae': '971',  // UAE
    'ar-eg': '20',   // Egypt
    'ar-ma': '212',  // Morocco
    
    // Generic fallbacks (language without region)
    'en': '1',       // English -> US
    'es': '34',      // Spanish -> Spain
    'fr': '33',      // French -> France
    'de': '49',      // German -> Germany
    'it': '39',      // Italian -> Italy
    'pt': '351',     // Portuguese -> Portugal
    'ru': '7',       // Russian -> Russia
    'ja': '81',      // Japanese -> Japan
    'ko': '82',      // Korean -> South Korea
    'zh': '86',      // Chinese -> China
    'hi': '91',      // Hindi -> India
    'ar': '966',     // Arabic -> Saudi Arabia
  };

  let detectedCountryCode = localeToCountryCode[locale];
  console.log("Direct lookup result:", detectedCountryCode);
  
  if (!detectedCountryCode) {
    console.log("No direct match found, trying partial matches...");
    for (const [localeKey, countryCode] of Object.entries(localeToCountryCode)) {
      if (locale.startsWith(localeKey)) {
        detectedCountryCode = countryCode;
        console.log("Partial match found:", localeKey, "->", countryCode);
        break;
      }
    }
  }

  console.log("Final detected country code:", detectedCountryCode);
  console.log("Will set to:", detectedCountryCode || '91');

  // Set country default (fallback to India if not detected)
  setCountryDefault(countrySelect, detectedCountryCode || '91');
}

function setCountryDefault(countrySelect, countryCode) {
  const option = countrySelect.querySelector(`option[value="${countryCode}"]`);
  if (option) {
    countrySelect.value = countryCode;
    console.log(`Country set to: ${option.textContent}`);
  } else {
    // Fallback to India if the detected country code is not in our list
    countrySelect.value = '91';
    console.log('Country set to default: India (+91)');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  parseURLParams();
  detectAndSetCountry();
});



