const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();
const db = new sqlite3.Database("./database.db");

app.use(cors());
app.use(bodyParser.json());

// Create users table
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )
`);

// Create tasks table
db.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    user_id INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )
`);

// User registration
app.post("/api/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Username and password required" });

  db.run(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, password],
    function (err) {
      if (err) {
        if (err.message.includes("UNIQUE"))
          return res.status(400).json({ error: "Username exists" });
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, username });
    }
  );
});

// User login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  db.get(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(400).json({ error: "Invalid credentials" });
      res.json({ id: row.id, username: row.username });
    }
  );
});

// Add task
app.post("/api/tasks", (req, res) => {
  const { title, description, user_id } = req.body;
  if (!title || !user_id)
    return res.status(400).json({ error: "Title and user_id required" });

  db.run(
    "INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)",
    [title, description, user_id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, title, description, user_id });
    }
  );
});

// Get tasks by user
app.get("/api/tasks/:userId", (req, res) => {
  const userId = req.params.userId;
  db.all("SELECT * FROM tasks WHERE user_id = ?", [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get all tasks (admin/dashboard)
app.get("/api/tasks", (req, res) => {
  db.all(
    `SELECT tasks.id, tasks.title, tasks.description, users.username
     FROM tasks JOIN users ON tasks.user_id = users.id`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Delete a task by ID
app.delete("/api/tasks/:id", (req, res) => {
  const taskId = req.params.id;

  // Run delete query
  db.run("DELETE FROM tasks WHERE id = ?", [taskId], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // If no rows were deleted, task didn't exist
    if (this.changes === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Success
    res.json({ message: "Task deleted successfully", id: taskId });
  });
});


app.listen(5000, () => console.log("Server running on http://localhost:5000"));
