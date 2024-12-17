# My Shopify App

This project is a simple Shopify application built to manage products using the Shopify GraphQL Admin API.
The application allows you to create, read, and update products and their single variant.

The project is a NPM monorepo divided into two packages:
- `packages/frontend`: The frontend is a React application using framework features of React Router V7 (from the Remix team).
- `packages/backend`: The backend is a GraphQL server running on Express. It is a wrapper around the Shopify Admin API.

## Getting Started

### Prerequisites

- Node.js
- Shopify partner account

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/gabiseabra/my-shopify-app.git
   cd my-shopify-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add your Shopify credentials. Use `.env.example` for reference.

### Development server

To start the development server, run:

```bash
npm run dev
```

This will start both the frontend and backend servers.
By default the frontend server will run on `http://localhost:8080` and the backend server on `http://localhost:3000`.

### Running the Application

To create a production build, run:

```bash
npm run build
```

To start the application, run:

```bash
npm start
```

This will start both the frontend and backend servers.
