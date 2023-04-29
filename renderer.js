function cleanNumber() {
    let phoneNumber = document.getElementById("phone").value;
    phoneNumber = phoneNumber.replace(/\D/g, "");  // remove all non-digit characters

    // Remove leading zeros if present
    while (phoneNumber.startsWith("0")) {
        phoneNumber = phoneNumber.substring(1);
    }

    // Prepend 91 only if it's not already present at the beginning
    if (!phoneNumber.startsWith("91")) {
        phoneNumber = "91" + phoneNumber;
    }

    let link = "https://wa.me/" + phoneNumber;
    document.getElementById("result").innerHTML = `<a href="${link}" target="_blank">${link}</a>`;
}

function copyToClipboard() {
    let link = document.getElementById("waLink").href;
    navigator.clipboard.writeText(link);
}
