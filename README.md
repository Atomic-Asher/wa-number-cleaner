# WhatsApp Link Cleaner

WhatsApp Link Cleaner is an Electron-based desktop application that helps you to clean phone numbers and generate WhatsApp message links.

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
