function cleanNumber() {
    let phoneNumber = document.getElementById("phone").value;
    let originalNumber = phoneNumber;
    phoneNumber = phoneNumber.replace(/\D/g, "");  // remove all non-digit characters
  
    // Remove leading zeros if present
    let zerosRemoved = 0;
    while (phoneNumber.startsWith("0")) {
        phoneNumber = phoneNumber.substring(1);
        zerosRemoved++;
    }
  
    let countryCodeAdded = false;
    let countryCode = document.getElementById("country").value;
  
    // Check if the first two digits match the country code
    if (phoneNumber.startsWith(countryCode)) {
      countryCodeAdded = true;
    } else if (phoneNumber.length === 10) {
      // Prepend country code if it's not already present at the beginning
      phoneNumber = countryCode + phoneNumber;
      countryCodeAdded = true;
    } else if (phoneNumber.length === 12 && phoneNumber.startsWith("00" + countryCode)) {
      // Remove the first two digits and prepend country code
      phoneNumber = countryCode + phoneNumber.substring(2);
      countryCodeAdded = true;
    } else {
      // Throw an error if the entered number is neither 10 digits nor a 12-digit number with matching country code
      document.getElementById("error").innerHTML = "Invalid phone number";
      return;
    }
  
    let link = "https://wa.me/" + phoneNumber;
    document.getElementById("result").innerHTML = `<a href="${link}" id="waLink"  target="_blank">${link}</a> <button onclick="copyToClipboard()" class="btn btn-secondary"><img src="clipboard-removebg-preview.png" width="20" height="20" /></button>`;
    
    // let changes = "Original number: " + originalNumber + "<br>";
    // changes += "Non-digit characters removed: " + (originalNumber.length - phoneNumber.length + zerosRemoved) + "<br>";
    //changes += "Leading zeros removed: " + zerosRemoved + "<br>";
    // changes += "Country code " + countryCode + " " + (countryCodeAdded ? "added" : "already present");
    // document.getElementById("changes").innerHTML = changes;
    
    // document.getElementById("error").innerHTML = "";
  }
