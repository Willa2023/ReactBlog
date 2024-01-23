const mysql = require("mysql");
const bcrypt = require("bcrypt");

const db = mysql.createConnection({
  host: "reactblogdatabase.cf8sld5urrxi.ap-southeast-2.rds.amazonaws.com",
  user: "admin",
  password: "willawilla",
  database: "message",
});

module.exports = async (req, res) => {
  try {
    if (req.method === "POST") {
      // Handle POST requests
      const { action } = req.body;

      if (action === "createAccount") {
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;

        if (!username || !password || !email) {
          res.status(400).json({ error: "All fields are required" });
          return;
        }

        try {
          const hashPassword = await bcrypt.hash(password, 10);
          const sql =
            "INSERT INTO accounts (username, password, email) VALUES (?, ?, ?)";
          db.query(sql, [username, hashPassword, email], (error, result) => {
            if (error) {
              res.json(error);
            } else {
              res.json({
                code: 200,
                status: "Data inserted into the database",
              });
            }
          });
        } catch (error) {
          console.error(error);
          res.sendStatus(500);
        }
      } else if (action === "login") {
        // Handle login action
        const username = req.body.username;
        const password = req.body.password;

        if (!username || !password) {
          res.status(400).json({ error: "Username and password are required" });
          return;
        }

        const sql = "SELECT * FROM accounts WHERE username = ?";
        db.query(sql, [username], async (error, result) => {
          if (error) {
            console.error(error);
            res.json(error);
          } else {
            if (result.length > 0) {
              const storeHashPassword = result[0].password;

              try {
                const passwordMatch = await bcrypt.compare(
                  password,
                  storeHashPassword
                );
                if (passwordMatch) {
                  res.json({ code: 200, status: "Login successful" });
                } else {
                  res.json({
                    code: 401,
                    status: "Invalid username or password",
                  });
                }
              } catch (compareError) {
                console.error(compareError);
                res.sendStatus(500);
              }
            } else {
              res.json({ code: 401, status: "Invalid username or password" });
            }
          }
        });
      } else {
        res.status(400).json({ error: "Invalid action" });
      }
    } else {
      res.status(405).end(); // Method Not Allowed
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
