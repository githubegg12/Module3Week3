README - Training – Module 3 Week 3

CRUD

Project Description

This project is a web-based CRUD application designed to manage a list of products using JavaScript, HTML/CSS, and a local JSON Server as a simulated APIs. The app provides a simple, user-friendly interface where users can:

- Add new products with fields like ID, name, price, and category.
- Read the inventory in a dynamic table format.
- Update product information with inline editing.
- Delete products with confirmation prompts.

The system validates inputs to ensure clean data: only letters are allowed in names and categories, and only numbers in IDs and prices. It also prevents duplicate entries by checking existing IDs and product names (case-insensitive).

The goal is to practice and apply concepts of API interaction, data validation, and modular JavaScript, while maintaining a responsive and organized UI. This project reinforces key frontend development skills and simulates real-world data management using only local resources and the Fetch API.


Requirements

- Node.js installed including Node Package Manager
- JSON server installed
- Any code editor (e.g., VS Code)
- Internet connection for installing packages

How to use it

1. Clone the project
git clone https://github.com/githubegg12/Module3Week3.git

2. Install dependencies
npm i
npm install json-server
npm install swal
npm install sweetalert2


3. Start the development servers

You will need two terminals:

Terminal 1 – Start frontend with Vite
npm run dev
Visit: http://localhost:5173

Terminal 2 – Start backend with JSON Server
npm run server
Visit: http://localhost:3000/products


Project structure


/Entrenamiento3
├── db.json #JSON Server database
├── index.html #Main HTML UI
├── package.json
├── vite.config.js
├── /src
│   ├── /CSS
│   │   └── styles.css  #Styling for the application
│   └── /JavaScript
│       ├── gestión_api.js #Main logic for CRUD functionality

│       └── alerts.js #Toast notification helpers (SweetAlert2)




Coder information

Nombre: David Felipe Vargas Varela	

Clan: Sierra

Correo: davidvargas1224@gmail.com


 
