# Setup Instructions for Local Development

To set up the project locally, follow these steps:

1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/orderwithchat.git
    cd orderwithchat
    ```

2. **Install dependencies:**
    Make sure you have [Node.js](https://nodejs.org/) installed. Then run:
    ```bash
    npm install
    ```

3. **Create a `.env` file:**
    Create a `.env` file in the root directory and add any necessary environment variables. For example:
    ```env
    MONGODB_URI=xyz
    ```

4. **Run the development server:**
    Start the development server by running:
    ```bash
    npm run dev
    ```

5. **Open the application:**
    Open your browser and navigate to `http://localhost:3000` to see the application in action.

6. **Load initial data
    run  npx ts-node scripts/insertData.ts in terminal

