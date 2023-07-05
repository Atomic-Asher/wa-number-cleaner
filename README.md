# WhatsApp Number Cleaner

WhatsApp Link Cleaner is an Electron-based desktop application that helps you to clean phone numbers and generate WhatsApp message links.

Demo: https://whatsapp-number-cleaner.netlify.app/
[![Netlify Status](https://api.netlify.com/api/v1/badges/1f573488-6c4f-4d48-8de4-98e5536e7203/deploy-status)](https://app.netlify.com/sites/whatsapp-number-cleaner/deploys)
## Features

- Cleans phone numbers, removing spaces, brackets, and other non-numeric characters.
- Prepends 91 as the country code to the phone number.
- Generates a WhatsApp message link (wa.me link) that opens in a browser when clicked.

## Installation

To install and run this application locally for development:

1. Clone the repository or download the ZIP file and extract it.

    ```bash
    git clone https://github.com/<your-github-username>/whatsapp-number-cleaner.git
    ```

2. Navigate to the project directory.

    ```bash
    cd whatsapp-number-cleaner
    ```

3. Install dependencies.

    ```bash
    npm install
    ```

4. Run the application.

    ```bash
    npm start
    ```

## Building the App for macOS

To build a macOS Menubar application, you can use the following command:

```bash
npm run dist
