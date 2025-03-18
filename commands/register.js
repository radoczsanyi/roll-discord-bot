import { db } from "../app.js";

function register(username, amount) {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO bank (name, amount) VALUES (?, ?)";

    db.run(sql, [username, amount], function (err) {
      if (err) {
        reject(new Error("Error inserting data: " + err.message));
      } else {
        resolve(this.lastID);
      }
    });
  });
}

export { register };
