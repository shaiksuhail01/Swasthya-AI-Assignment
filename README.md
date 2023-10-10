---

# User-Blog-Comment API

This Express.js application provides APIs to manage users, blogs, and comments using an SQLite database. It also includes an API to retrieve nth-level friends of a given user based on blog comments.

## Approach

The API is built using Express.js, a popular Node.js web application framework. SQLite is used as the database to store user information, blogs, and comments.

### Project Structure

The project follows a structured approach with separate modules for users, blogs, comments, and handling the database connection.

- **Users:** Manages user-related endpoints such as adding a user, getting all users, and getting a specific user by ID.
- **Blogs:** Handles endpoints for adding a blog, getting all blogs, and getting a specific blog by ID.
- **Comments:** Manages comment-related endpoints like adding a comment, getting all comments, and getting a specific comment by ID.
- **Database Initialization:** Initializes the SQLite database and starts the server.
- **Middleware:** Utilizes middleware to parse incoming JSON requests.

### API Endpoints

The API exposes several endpoints to interact with the database and perform various actions:

- **Users:**
  - `POST /users`: Add a new user.
  - `GET /users`: Get all users.
  - `GET /users/:userId`: Get a specific user by ID.

- **Blogs:**
  - `POST /blogs`: Add a new blog.
  - `GET /blogs`: Get all blogs.
  - `GET /blogs/:blogId`: Get a specific blog by ID.

- **Comments:**
  - `POST /comments`: Add a new comment.
  - `GET /comments`: Get all comments.
  - `GET /comments/:commentId`: Get a specific comment by ID.

- **Friends:**
  - `GET /users/:userId/level/:levelNo`: Get nth-level friends of a given user.

### Error Handling

Proper error handling is implemented throughout the application. In case of any errors, appropriate HTTP status codes and error messages are returned to the client.

### Database Interaction

The application uses SQLite as the database. It connects to the SQLite database using the `sqlite` package and interacts with it to perform necessary operations such as adding users, blogs, comments, and retrieving data.

### How to Run

1. Clone the repository and navigate to the project directory.
2. Install dependencies using `npm install`.
3. Run the server using `node app.js`.
4. Access the APIs using the provided endpoints (e.g., via `http://localhost:3000`).
5. You can see the live response in the .http file also.

---