const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");

db.all("SELECT * FROM users", (err, rows) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Users:", rows);
  }
  db.close();
});
