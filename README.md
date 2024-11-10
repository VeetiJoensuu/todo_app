# Todo Application

### Prerequisites

- Node.js installed
- PostgreSQL installed (I used pgAdmin 4 to manage)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository_url>

2. **Install node modules for the client:**
npm install

3. **Navigate to the server directory and install node modules:**
cd server
npm install

4. **Create a .env file in the server folder:**
JWT_SECRET_KEY=your_secret_key_here
DB_HOST=localhost
DB_USER=postgres (or whatever you have)
DB_PASSWORD=root (or whatever you have)
DBNAME=todo (create this on your database)
TEST_DB_NAME=test_todo (create this on your database)
DB_PORT=5432 (or whatever you have in your postgresql.conf file)
PORT=3001

5. **Create the PostgreSQL database 'todo' and paste the contents of database.sql into the query tool:**

### Running the Application

Click start.bat file in the directory

or open up terminal:
cd server
npm run devStart

open another terminal:
npm start