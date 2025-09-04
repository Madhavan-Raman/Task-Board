// checkTasks.js
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");

// Fetch all tasks
db.all(
  `SELECT tasks.id, tasks.title, tasks.description, users.username
   FROM tasks
   JOIN users ON tasks.user_id = users.id`,
  [],
  (err, rows) => {
    if (err) {
      console.error("Error fetching tasks:", err.message);
      return;
    }
    console.log("Tasks:", rows);
  }
);

db.close();
