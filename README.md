# Auth users

This project provides a streamlined back-end user authentication system built with NestJS, TypeScript, and Dockerized MongoDB.

**Prerequisites:**

- Docker installed on your system

## Running the Project

**1. Clone the Repository:**

```bash
git clone https://github.com/fernandoG494/auth-users.git
```

**2. Start the Containers:**

- Navigate to the project root directory.
- Ensure Docker Engine is running.
- Execute the following command to initiate the containers for the database and application:

```bash
docker-compose up -d
```

- Wait until the processes finish.

**3. Set Up Environment Variables:**

- Create a copy of `.env.template` and rename it to `.env.`
- Edit `.env` to define the required environment variables according to the instructions provided in the file.

**4. Install Dependencies:**

```bash
npm install
```

**5. Run the Application:**

```bash
npm run start:dev
```

**Optional**
You can review Swagger on this URL `http://localhost:3000/api`

**Database Verification**

We recommend using [TablePlus](https://tableplus.com/) to visually inspect and manage your database content.

**Making API Requests**

Utilize [Postman](https://www.postman.com/) to conveniently send HTTP requests to your API endpoints and test their functionality.

**Contact**

Connect with me on:

- GitHub: https://github.com/fernandoG494
- LinkedIn: https://www.linkedin.com/in/lfgc/
