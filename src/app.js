const express = require('express');
const app = express();
const path = require('path');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

// Middleware to parse incoming JSON requests
app.use(express.json());

// Path to the SQLite database file
const db_path = path.join(__dirname, 'users.db');

// Variable to hold the database connection
let db = null;

// Exporting the Express app for use in other modules
module.exports = app;

// Function to initialize the database and start the server
const initializeDbAndServer = async () => {
  try {
    // Open a connection to the SQLite database
    db = await open({
      filename: db_path,
      driver: sqlite3.Database,
    });
    
    // Start the server on port 3000
    app.listen(3000, () => {
      console.log('Server is Running!');
    });
  } catch (error) {
    console.log(`Database Error ${error.message}`);
  }
};

// Initialize the database and start the server
initializeDbAndServer();


// API to add a new user

app.post('/users', async (req, res) => {
  try {
    const { name } = req.body;
    await db.run('INSERT INTO Users (name) VALUES (?)', [name]);
    res.json({
      message: 'User added successfully',
      id: this.lastID,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// API to get all users

app.get('/users', async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM Users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API to get a specific user by ID

app.get('/users/:userId', async (req, res) => {
  const userId = req.params.userId;  

  try {
    const user = await db.get('SELECT * FROM Users WHERE id = ?', [userId]);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
   
    res.status(500).json({ error: err.message });
  }
});


// API to add a new blog

app.post('/blogs', async (req, res) => {
  try {
    const { user_id, content } = req.body;
    await db.run('INSERT INTO Blogs (user_id, content) VALUES (?, ?)', [user_id, content]);
    res.json({
      message: 'Blog added successfully',
      id: this.lastID,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API to get all blogs

app.get('/blogs', async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM Blogs');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API to get a specific blog by ID

app.get('/blogs/:blogId', async (req, res) => {
  try {
    const { blogId } = req.params;
    const row = await db.get('SELECT * FROM Blogs WHERE id = ?', [blogId]);

    if (!row) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json(row);
  } catch (err) {
    console.error('Error retrieving blog:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API to add a new comment

app.post('/comments', async (req, res) => {
  try {
    const { blog_id, user_id, content } = req.body;
    await db.run('INSERT INTO Comments (blog_id, user_id, content) VALUES (?, ?, ?)', [blog_id, user_id, content]);
    res.json({
      message: 'Comment added successfully',
      id: this.lastID,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API to get all comments

app.get('/comments', async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM Comments');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API to get a specific comment by ID

app.get('/comments/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;
    const row = await db.get('SELECT * FROM Comments WHERE id = ?', [commentId]);

    if (!row) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json(row);
  } catch (err) {
    console.error('Error retrieving comment:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API to get n-th level friends of a given user
app.get('/users/:userId/level/:levelNo', async (req, res) => {
  const userId = req.params.userId;
  const levelNo = parseInt(req.params.levelNo, 10);

  if (isNaN(levelNo) || levelNo < 1) {
      return res.status(400).json({ error: 'Invalid level number. Level number should be a positive integer.' });
  }

  try {
      const query = `
          WITH RECURSIVE Friends AS (
              SELECT user_id AS friend_id, 1 AS level
              FROM Comments
              WHERE blog_id IN (SELECT blog_id FROM Comments WHERE user_id = ?)
              
              UNION ALL
              
              SELECT c.user_id, f.level + 1
              FROM Comments c
              JOIN Friends f ON c.blog_id = (SELECT blog_id FROM Comments WHERE user_id = f.friend_id)
              WHERE f.level < ? AND f.level + 1 = ?
          )
          SELECT DISTINCT friend_id, level
          FROM Friends
          WHERE level = ? AND friend_id != ?
      `;

      const rows = await db.all(query, [userId, levelNo, levelNo, levelNo, userId]);
      res.json(rows);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});


