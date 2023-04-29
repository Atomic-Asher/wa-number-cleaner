document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("button-addon2").addEventListener("click", cleanNumber);
});

function cleanNumber() {
  let phoneNumber = document.getElementById("phone").value;
  phoneNumber = phoneNumber.replace(/\D/g, ""); // remove all non-digit characters

  if (phoneNumber.length > 10) {
    showError("Invalid mobile number. Please enter a 10-digit number.");
    return;
  }

  if (!/^\d+$/.test(phoneNumber)) {
    showError("Invalid input. Please enter only numbers.");
    return;
  }

 

  phoneNumber = countryCode + phoneNumber; // prepend with selected country code
  let link = 'https://wa.me/' + phoneNumber;
  document.getElementById("result").innerHTML = `<a href="${link}" target="_blank">${link}</a>`;
}

function showError(message) {
  let errorElement = document.createElement("div");
  errorElement.classList.add("alert", "alert-danger");
  errorElement.innerText = message;

  let container = document.querySelector(".container");
  container.insertBefore(errorElement, container.firstChild);
}

