function cleanNumber() {
  const phoneNumberInput = document.getElementById("phone");
  const countryCodeInput = document.getElementById("country");
  const messageInput = document.getElementById("message");
  let phoneNumber = phoneNumberInput.value.replace(/\D/g, "");
  
  let countryCode = countryCodeInput.dataset.countryCode;
  
  const message = messageInput.value.trim();
  const originalNumber = phoneNumberInput.value;

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
    formattedNumber = phoneNumber.substring(2);
  } else {
    if (phoneNumber.length === 9 || phoneNumber.length === 10) {
      formattedNumber = countryCode + phoneNumber;
    } else if (phoneNumber.length === 12) {
      if (phoneNumber.startsWith("00")) {
        formattedNumber = countryCode + phoneNumber.substring(2 + countryCode.length);
      } else {
        formattedNumber = countryCode + phoneNumber.substring(countryCode.length);
      }
    }
  }

  const link = "https://wa.me/" + formattedNumber + (message ? "?text=" + encodeURIComponent(message) : "");
  const displayLink = link.length > 60 ? link.substring(0, 60) + "..." : link;
  
  // console.log("Debug info:", {
  //   original: originalNumber,
  //   cleaned: phoneNumber,
  //   countryCode: countryCode,
  //   formatted: formattedNumber,
  //   link: link
  // });
  
  document.getElementById("modal-number").textContent = `+${formattedNumber}`;
  document.getElementById("modal-link").href = link;
  document.getElementById("modal-link").textContent = displayLink;
  
  // Show the modal
  document.getElementById("results-modal").classList.add("show");
  
  document.getElementById("result").innerHTML = "";
  document.getElementById("phone").value = "";

  phoneNumberInput.classList.add("success-animation");

  // Clear error message
  setTimeout(() => {
    document.getElementById("error").textContent = "";
    phoneNumberInput.classList.remove("error-animation");
    phoneNumberInput.classList.remove("success-animation");
  }, 2000);
}

function copyToClipboard() {
  const modalLink = document.getElementById("modal-link");
  const waLink = modalLink ? modalLink.getAttribute("href") : document.getElementById("waLink")?.getAttribute("href");
  
  if (waLink) {
    navigator.clipboard.writeText(waLink).then(() => {
      console.log("WhatsApp link copied to clipboard!");
      showCopyFeedback("WhatsApp link copied!");
    }).catch(err => {
      console.error("Failed to copy: ", err);
      showCopyFeedback("Failed to copy link", true);
    });
  }
}

function closeResultsModal() {
  document.getElementById("results-modal").classList.remove("show");
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById("results-modal");
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeResultsModal();
    }
  });
});

function clearForm() {
  document.getElementById("phone").value = "";
  document.getElementById("message").value = "";
  document.getElementById("result").innerHTML = "";
  document.getElementById("error").textContent = "";
  closeResultsModal(); // Also close modal when clearing
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
  const qrModalOverlay = document.querySelector("#qr-modal-overlay");
  const qrCodeContainer = document.querySelector("#qrcode-container");

  if (!qrCodeGenerated) {
    const shareUrl = "https://wa.me/?text=" + encodeURIComponent("Check out this app: https://whatsapp-number-cleaner.netlify.com");
    new QRCode(document.getElementById("qrcode-image"), {
      text: shareUrl,
      width: 200,
      height: 200,
    });
    qrCodeGenerated = true;
  }

  // Show the QR modal
  qrModalOverlay.classList.add("show");
  qrCodeContainer.classList.add("showQr");
  qrCodeContainer.classList.remove("hideQr");
}

function closeQRModal() {
  const qrModalOverlay = document.querySelector("#qr-modal-overlay");
  const qrCodeContainer = document.querySelector("#qrcode-container");
  
  qrModalOverlay.classList.remove("show");
  qrCodeContainer.classList.remove("showQr");
  qrCodeContainer.classList.add("hideQr");
}

const qrExit = document.querySelector(".exit-svg");
qrExit.addEventListener("click", closeQRModal);

// Close QR modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
  const qrModal = document.getElementById("qr-modal-overlay");
  qrModal.addEventListener('click', function(e) {
    if (e.target === qrModal) {
      closeQRModal();
    }
  });
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
  const countryInput = document.getElementById("country");
  
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
  setCountryDefault(countryInput, detectedCountryCode || '91');
}

function setCountryDefault(countryInput, countryCode) {
  // Find the country in our countries array
  const country = countries.find(c => c.code === countryCode);
  if (country) {
    countryInput.value = country.name;
    countryInput.dataset.countryCode = countryCode;
    console.log(`Country set to: ${country.name} (+${countryCode})`);
  } else {
    // Fallback to India if the detected country code is not in our list
    const india = countries.find(c => c.code === '91');
    if (india) {
      countryInput.value = india.name;
      countryInput.dataset.countryCode = '91';
      console.log('Country set to default: India (+91)');
    }
  }
}

// Countries data array
const countries = [
  { code: '93', name: 'Afghanistan (+93)' },
  { code: '355', name: 'Albania (+355)' },
  { code: '213', name: 'Algeria (+213)' },
  { code: '1', name: 'American Samoa (+1)' },
  { code: '376', name: 'Andorra (+376)' },
  { code: '244', name: 'Angola (+244)' },
  { code: '1', name: 'Anguilla (+1)' },
  { code: '1', name: 'Antigua and Barbuda (+1)' },
  { code: '54', name: 'Argentina (+54)' },
  { code: '374', name: 'Armenia (+374)' },
  { code: '297', name: 'Aruba (+297)' },
  { code: '61', name: 'Australia (+61)' },
  { code: '43', name: 'Austria (+43)' },
  { code: '994', name: 'Azerbaijan (+994)' },
  { code: '1', name: 'Bahamas (+1)' },
  { code: '973', name: 'Bahrain (+973)' },
  { code: '880', name: 'Bangladesh (+880)' },
  { code: '1', name: 'Barbados (+1)' },
  { code: '375', name: 'Belarus (+375)' },
  { code: '32', name: 'Belgium (+32)' },
  { code: '501', name: 'Belize (+501)' },
  { code: '229', name: 'Benin (+229)' },
  { code: '1', name: 'Bermuda (+1)' },
  { code: '975', name: 'Bhutan (+975)' },
  { code: '591', name: 'Bolivia (+591)' },
  { code: '387', name: 'Bosnia and Herzegovina (+387)' },
  { code: '267', name: 'Botswana (+267)' },
  { code: '55', name: 'Brazil (+55)' },
  { code: '1', name: 'British Virgin Islands (+1)' },
  { code: '673', name: 'Brunei (+673)' },
  { code: '359', name: 'Bulgaria (+359)' },
  { code: '226', name: 'Burkina Faso (+226)' },
  { code: '257', name: 'Burundi (+257)' },
  { code: '855', name: 'Cambodia (+855)' },
  { code: '237', name: 'Cameroon (+237)' },
  { code: '1', name: 'Canada (+1)' },
  { code: '238', name: 'Cape Verde (+238)' },
  { code: '1', name: 'Cayman Islands (+1)' },
  { code: '236', name: 'Central African Republic (+236)' },
  { code: '235', name: 'Chad (+235)' },
  { code: '56', name: 'Chile (+56)' },
  { code: '86', name: 'China (+86)' },
  { code: '57', name: 'Colombia (+57)' },
  { code: '269', name: 'Comoros (+269)' },
  { code: '242', name: 'Congo (+242)' },
  { code: '682', name: 'Cook Islands (+682)' },
  { code: '506', name: 'Costa Rica (+506)' },
  { code: '225', name: 'Côte d\'Ivoire (+225)' },
  { code: '385', name: 'Croatia (+385)' },
  { code: '53', name: 'Cuba (+53)' },
  { code: '357', name: 'Cyprus (+357)' },
  { code: '420', name: 'Czech Republic (+420)' },
  { code: '243', name: 'Democratic Republic of Congo (+243)' },
  { code: '45', name: 'Denmark (+45)' },
  { code: '253', name: 'Djibouti (+253)' },
  { code: '1', name: 'Dominica (+1)' },
  { code: '1', name: 'Dominican Republic (+1)' },
  { code: '593', name: 'Ecuador (+593)' },
  { code: '20', name: 'Egypt (+20)' },
  { code: '503', name: 'El Salvador (+503)' },
  { code: '240', name: 'Equatorial Guinea (+240)' },
  { code: '291', name: 'Eritrea (+291)' },
  { code: '372', name: 'Estonia (+372)' },
  { code: '251', name: 'Ethiopia (+251)' },
  { code: '500', name: 'Falkland Islands (+500)' },
  { code: '298', name: 'Faroe Islands (+298)' },
  { code: '679', name: 'Fiji (+679)' },
  { code: '358', name: 'Finland (+358)' },
  { code: '33', name: 'France (+33)' },
  { code: '594', name: 'French Guiana (+594)' },
  { code: '689', name: 'French Polynesia (+689)' },
  { code: '241', name: 'Gabon (+241)' },
  { code: '220', name: 'Gambia (+220)' },
  { code: '995', name: 'Georgia (+995)' },
  { code: '49', name: 'Germany (+49)' },
  { code: '233', name: 'Ghana (+233)' },
  { code: '350', name: 'Gibraltar (+350)' },
  { code: '30', name: 'Greece (+30)' },
  { code: '299', name: 'Greenland (+299)' },
  { code: '1', name: 'Grenada (+1)' },
  { code: '590', name: 'Guadeloupe (+590)' },
  { code: '1', name: 'Guam (+1)' },
  { code: '502', name: 'Guatemala (+502)' },
  { code: '44', name: 'Guernsey (+44)' },
  { code: '224', name: 'Guinea (+224)' },
  { code: '245', name: 'Guinea-Bissau (+245)' },
  { code: '592', name: 'Guyana (+592)' },
  { code: '509', name: 'Haiti (+509)' },
  { code: '504', name: 'Honduras (+504)' },
  { code: '852', name: 'Hong Kong (+852)' },
  { code: '36', name: 'Hungary (+36)' },
  { code: '354', name: 'Iceland (+354)' },
  { code: '91', name: 'India (+91)' },
  { code: '62', name: 'Indonesia (+62)' },
  { code: '98', name: 'Iran (+98)' },
  { code: '964', name: 'Iraq (+964)' },
  { code: '353', name: 'Ireland (+353)' },
  { code: '44', name: 'Isle of Man (+44)' },
  { code: '972', name: 'Israel (+972)' },
  { code: '39', name: 'Italy (+39)' },
  { code: '1', name: 'Jamaica (+1)' },
  { code: '81', name: 'Japan (+81)' },
  { code: '44', name: 'Jersey (+44)' },
  { code: '962', name: 'Jordan (+962)' },
  { code: '7', name: 'Kazakhstan (+7)' },
  { code: '254', name: 'Kenya (+254)' },
  { code: '686', name: 'Kiribati (+686)' },
  { code: '383', name: 'Kosovo (+383)' },
  { code: '965', name: 'Kuwait (+965)' },
  { code: '996', name: 'Kyrgyzstan (+996)' },
  { code: '856', name: 'Laos (+856)' },
  { code: '371', name: 'Latvia (+371)' },
  { code: '961', name: 'Lebanon (+961)' },
  { code: '266', name: 'Lesotho (+266)' },
  { code: '231', name: 'Liberia (+231)' },
  { code: '218', name: 'Libya (+218)' },
  { code: '423', name: 'Liechtenstein (+423)' },
  { code: '370', name: 'Lithuania (+370)' },
  { code: '352', name: 'Luxembourg (+352)' },
  { code: '853', name: 'Macao (+853)' },
  { code: '389', name: 'Macedonia (+389)' },
  { code: '261', name: 'Madagascar (+261)' },
  { code: '265', name: 'Malawi (+265)' },
  { code: '60', name: 'Malaysia (+60)' },
  { code: '960', name: 'Maldives (+960)' },
  { code: '223', name: 'Mali (+223)' },
  { code: '356', name: 'Malta (+356)' },
  { code: '692', name: 'Marshall Islands (+692)' },
  { code: '596', name: 'Martinique (+596)' },
  { code: '222', name: 'Mauritania (+222)' },
  { code: '230', name: 'Mauritius (+230)' },
  { code: '262', name: 'Mayotte (+262)' },
  { code: '52', name: 'Mexico (+52)' },
  { code: '691', name: 'Micronesia (+691)' },
  { code: '373', name: 'Moldova (+373)' },
  { code: '377', name: 'Monaco (+377)' },
  { code: '976', name: 'Mongolia (+976)' },
  { code: '382', name: 'Montenegro (+382)' },
  { code: '1', name: 'Montserrat (+1)' },
  { code: '212', name: 'Morocco (+212)' },
  { code: '258', name: 'Mozambique (+258)' },
  { code: '95', name: 'Myanmar (+95)' },
  { code: '264', name: 'Namibia (+264)' },
  { code: '674', name: 'Nauru (+674)' },
  { code: '977', name: 'Nepal (+977)' },
  { code: '31', name: 'Netherlands (+31)' },
  { code: '599', name: 'Netherlands Antilles (+599)' },
  { code: '687', name: 'New Caledonia (+687)' },
  { code: '64', name: 'New Zealand (+64)' },
  { code: '505', name: 'Nicaragua (+505)' },
  { code: '227', name: 'Niger (+227)' },
  { code: '234', name: 'Nigeria (+234)' },
  { code: '683', name: 'Niue (+683)' },
  { code: '672', name: 'Norfolk Island (+672)' },
  { code: '850', name: 'North Korea (+850)' },
  { code: '1', name: 'Northern Mariana Islands (+1)' },
  { code: '47', name: 'Norway (+47)' },
  { code: '968', name: 'Oman (+968)' },
  { code: '92', name: 'Pakistan (+92)' },
  { code: '680', name: 'Palau (+680)' },
  { code: '970', name: 'Palestinian Territory (+970)' },
  { code: '507', name: 'Panama (+507)' },
  { code: '675', name: 'Papua New Guinea (+675)' },
  { code: '595', name: 'Paraguay (+595)' },
  { code: '51', name: 'Peru (+51)' },
  { code: '63', name: 'Philippines (+63)' },
  { code: '48', name: 'Poland (+48)' },
  { code: '351', name: 'Portugal (+351)' },
  { code: '1', name: 'Puerto Rico (+1)' },
  { code: '974', name: 'Qatar (+974)' },
  { code: '262', name: 'Réunion (+262)' },
  { code: '40', name: 'Romania (+40)' },
  { code: '7', name: 'Russia (+7)' },
  { code: '250', name: 'Rwanda (+250)' },
  { code: '590', name: 'Saint Barthélemy (+590)' },
  { code: '290', name: 'Saint Helena (+290)' },
  { code: '1', name: 'Saint Kitts and Nevis (+1)' },
  { code: '1', name: 'Saint Lucia (+1)' },
  { code: '590', name: 'Saint Martin (+590)' },
  { code: '508', name: 'Saint Pierre and Miquelon (+508)' },
  { code: '1', name: 'Saint Vincent and the Grenadines (+1)' },
  { code: '685', name: 'Samoa (+685)' },
  { code: '378', name: 'San Marino (+378)' },
  { code: '239', name: 'São Tomé and Príncipe (+239)' },
  { code: '966', name: 'Saudi Arabia (+966)' },
  { code: '221', name: 'Senegal (+221)' },
  { code: '381', name: 'Serbia (+381)' },
  { code: '248', name: 'Seychelles (+248)' },
  { code: '232', name: 'Sierra Leone (+232)' },
  { code: '65', name: 'Singapore (+65)' },
  { code: '421', name: 'Slovakia (+421)' },
  { code: '386', name: 'Slovenia (+386)' },
  { code: '677', name: 'Solomon Islands (+677)' },
  { code: '252', name: 'Somalia (+252)' },
  { code: '27', name: 'South Africa (+27)' },
  { code: '82', name: 'South Korea (+82)' },
  { code: '211', name: 'South Sudan (+211)' },
  { code: '34', name: 'Spain (+34)' },
  { code: '94', name: 'Sri Lanka (+94)' },
  { code: '249', name: 'Sudan (+249)' },
  { code: '597', name: 'Suriname (+597)' },
  { code: '268', name: 'Swaziland (+268)' },
  { code: '46', name: 'Sweden (+46)' },
  { code: '41', name: 'Switzerland (+41)' },
  { code: '963', name: 'Syria (+963)' },
  { code: '886', name: 'Taiwan (+886)' },
  { code: '992', name: 'Tajikistan (+992)' },
  { code: '255', name: 'Tanzania (+255)' },
  { code: '66', name: 'Thailand (+66)' },
  { code: '670', name: 'Timor-Leste (+670)' },
  { code: '228', name: 'Togo (+228)' },
  { code: '690', name: 'Tokelau (+690)' },
  { code: '676', name: 'Tonga (+676)' },
  { code: '1', name: 'Trinidad and Tobago (+1)' },
  { code: '216', name: 'Tunisia (+216)' },
  { code: '90', name: 'Turkey (+90)' },
  { code: '993', name: 'Turkmenistan (+993)' },
  { code: '1', name: 'Turks and Caicos Islands (+1)' },
  { code: '688', name: 'Tuvalu (+688)' },
  { code: '256', name: 'Uganda (+256)' },
  { code: '380', name: 'Ukraine (+380)' },
  { code: '971', name: 'United Arab Emirates (+971)' },
  { code: '44', name: 'United Kingdom (+44)' },
  { code: '1', name: 'United States (+1)' },
  { code: '598', name: 'Uruguay (+598)' },
  { code: '998', name: 'Uzbekistan (+998)' },
  { code: '678', name: 'Vanuatu (+678)' },
  { code: '379', name: 'Vatican City (+379)' },
  { code: '58', name: 'Venezuela (+58)' },
  { code: '84', name: 'Vietnam (+84)' },
  { code: '1', name: 'Virgin Islands (+1)' },
  { code: '681', name: 'Wallis and Futuna (+681)' },
  { code: '212', name: 'Western Sahara (+212)' },
  { code: '967', name: 'Yemen (+967)' },
  { code: '260', name: 'Zambia (+260)' },
  { code: '263', name: 'Zimbabwe (+263)' }
];

document.addEventListener('DOMContentLoaded', function() {
  parseURLParams();
  detectAndSetCountry();
  initCustomDropdown();
});

function initCustomDropdown() {
  const countryInput = document.getElementById("country");
  const dropdown = document.getElementById("country-dropdown");
  const searchInput = document.getElementById("country-search");
  const dropdownList = document.getElementById("dropdown-list");
  
  let focusedIndex = -1;
  let filteredCountries = countries;
  
  // Populate dropdown list
  function populateDropdown(countriesToShow = countries) {
    dropdownList.innerHTML = '';
    filteredCountries = countriesToShow;
    focusedIndex = -1;
    
    countriesToShow.forEach((country, index) => {
      const item = document.createElement('button');
      item.className = 'dropdown-item';
      item.textContent = country.name;
      item.dataset.code = country.code;
      item.addEventListener('click', () => selectCountry(country));
      dropdownList.appendChild(item);
    });
  }
  
  // Select a country
  function selectCountry(country) {
    countryInput.value = country.name;
    countryInput.dataset.countryCode = country.code;
    hideDropdown();
    countryInput.focus();
  }
  
  // Show dropdown
  function showDropdown() {
    dropdown.classList.add('show');
    populateDropdown();
    searchInput.value = '';
    searchInput.focus();
  }
  
  // Hide dropdown
  function hideDropdown() {
    dropdown.classList.remove('show');
    focusedIndex = -1;
  }
  
  // Update focused item
  function updateFocused() {
    const items = dropdownList.querySelectorAll('.dropdown-item');
    items.forEach((item, index) => {
      item.classList.toggle('focused', index === focusedIndex);
    });
    
    if (focusedIndex >= 0 && items[focusedIndex]) {
      items[focusedIndex].scrollIntoView({ block: 'nearest' });
    }
  }
  
  // Event listeners
  countryInput.addEventListener('click', showDropdown);
  countryInput.addEventListener('focus', showDropdown);
  
  // Search functionality
  searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const filtered = countries.filter(country => 
      country.name.toLowerCase().includes(query)
    );
    populateDropdown(filtered);
  });
  
  // Keyboard navigation in search
  searchInput.addEventListener('keydown', function(e) {
    const items = dropdownList.querySelectorAll('.dropdown-item');
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusedIndex = Math.min(focusedIndex + 1, items.length - 1);
      updateFocused();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusedIndex = Math.max(focusedIndex - 1, 0);
      updateFocused();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedIndex >= 0 && items[focusedIndex]) {
        const code = items[focusedIndex].dataset.code;
        const country = filteredCountries.find(c => c.code === code);
        selectCountry(country);
      }
    } else if (e.key === 'Escape') {
      hideDropdown();
      countryInput.focus();
    }
  });
  
  // Set India as default when input loses focus and is empty
  countryInput.addEventListener('blur', function(e) {
    // Small delay to allow dropdown clicks to register
    setTimeout(() => {
      if (!dropdown.contains(document.activeElement) && !this.value.trim()) {
        const india = countries.find(c => c.code === '91');
        if (india) {
          selectCountry(india);
        }
      }
    }, 150);
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!countryInput.contains(e.target) && !dropdown.contains(e.target)) {
      hideDropdown();
    }
  });
  
  // Initial population
  populateDropdown();
}



