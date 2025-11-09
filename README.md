🚀 Taboola Recommendations Widget - Front End Assignment by Hila Peled
This project implements a fully responsive, client-side recommendations widget using Vanilla JavaScript, HTML, and CSS to fetch and display content from the Taboola API.

🛠️ Setup and Running the Project

Installation
The main application does not require a backend, but the testing environment requires Node.js, npm, and Jest packages.

Open your terminal in the project root directory and run:

Bash

# Install development dependencies (Jest, JSDOM, http-server)

npm install Running the Widget (Front End)
You have two options for viewing the widget in a browser:

A. Recommended: Using npm start (Local Server)
This method launches a simple HTTP server to simulate a real web environment, which is essential for certain modern browser features.

Bash

npm start
The widget will be accessible at: http://localhost:8080

B. Direct File Opening
Alternatively, you can open the main file directly in your browser:

Open the file index.html in your browser (double-click the file).

Note: Using a tool like VS Code's Live Server extension is also highly recommended for development.

🧪 Unit Tests (Jest)
The project includes four comprehensive Unit Tests to ensure the stability and correctness of the renderWidget function, verifying data processing, link targets, and error handling.

How to Run Tests
Run the following command in your terminal:

Bash

npm test
