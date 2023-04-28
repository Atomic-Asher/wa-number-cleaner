function cleanNumber() {
  let phoneNumber = document.getElementById("phone").value;
  phoneNumber = phoneNumber.replace(/\D/g, ""); // remove all non-digit characters
  phoneNumber = '91' + phoneNumber; // prepend with country code
  let link = 'https://wa.me/' + phoneNumber;
  document.getElementById("result").innerHTML = `<a href="${link}" target="_blank">${link}</a>`;
}
