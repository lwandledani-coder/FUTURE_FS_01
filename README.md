# Portfolio Website

A full-stack portfolio website featuring a modern React frontend, Node.js/Express backend, and MySQL database.

## Features

- Responsive design with dark mode toggle
- Contact form with backend validation
- Admin panel for managing contacts
- Skills, projects, and about sections

## Tech Stack

- **Frontend:** React, React Router, Formik, Yup, React Hot Toast
- **Backend:** Node.js, Express.js, MySQL, JWT
- **Styling:** CSS

## Getting Started

### Prerequisites

- Node.js
- MySQL

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd backend && npm install
   cd ../client && npm install
   ```
3. Set up the database using `database/portfolio_db.sql`
4. Configure environment variables in `.env` and `backend/backend.env`
5. Start the backend: `cd backend && npm start`
6. Start the frontend: `cd client && npm start`
7. Serve the static files: `npm run serve`

## License

MIT