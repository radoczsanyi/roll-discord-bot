import { db } from "../app.js";

function getBalance(username) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT amount FROM bank WHERE name = ?"; // Use parameterized query with ?

    db.get(sql, [username], (err, row) => {
      if (err) {
        reject(new Error("Error fetching data: " + err.message));
      } else if (row) {
        resolve(row.amount);
      } else {
        reject(new Error("use /register to roll"));
      }
    });
  });
}

function updateBalance(username, amountChange) {
    return new Promise(async (resolve, reject) => {
      try {
        const currentAmount = await getBalance(username);

        const newAmount = currentAmount + amountChange;
  
        const sql = 'UPDATE bank SET amount = ? WHERE name = ?';
        db.run(sql, [newAmount, username], (err) => {
          if (err) {
            reject(new Error('Error updating data: ' + err.message));
          } else {
            resolve(`Updated amount for ${username} to ${newAmount}`);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
}

export { getBalance, updateBalance };
