const mysql = require("mysql");

const db = mysql.createConnection({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName,
});

module.exports = async (req, res) => {
  try {
    if (req.method === "GET") {
      const { params } = req.query;

      if (params === "listByTopic") {
        // Handle listByTopic request
        const { topic } = req.query;
        const sql = "SELECT * FROM articles WHERE topic = ?";
        db.query(sql, [topic], async (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            if (result.length > 0) {
              res.json(result);
            } else {
              res.status(404).json({ error: "Article not found" });
            }
          }
        });
      } else if (params === "listByTitle") {
        // Handle listByTitle request
        const { title } = req.query;
        const sql = "SELECT * FROM articles WHERE title LIKE ?";
        const searchTitle = `%${title}%`;
        db.query(sql, [searchTitle], async (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            if (result.length > 0) {
              res.json(result);
            } else {
              res.status(404).json({ error: "Article not found" });
            }
          }
        });
      } else if (params === "getArticle") {
        // Handle getArticle request
        const { articleId } = req.query;
        const sql = "SELECT * FROM articles WHERE id = ?";
        db.query(sql, [articleId], async (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            if (result.length > 0) {
              res.json(result[0]);
            } else {
              res
                .status(404)
                .json({ error: "No article found for the given ID" });
            }
          }
        });
      } else if (params === "showArticle") {
        const { title } = req.query;
        sql = "SELECT * FROM articles WHERE title = ?";
        errorMessage = "Article not found";
        db.query(sql, [title], async (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            if (result.length > 0) {
              res.json(result[0]);
            } else {
              res.status(404).json({ error: errorMessage });
            }
          }
        });
      } else if (params === "personalPage") {
        const { author } = req.query;
        sql = "SELECT * FROM articles WHERE author = ?";
        errorMessage = "No articles found for the author";
        db.query(sql, [author], async (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            if (result.length > 0) {
              res.json(result);
            } else {
              res.status(404).json({ error: errorMessage });
            }
          }
        });
      } else {
        res.status(400).json({ error: "Invalid request parameters" });
      }
    } else if (req.method === "POST") {
      // Handle POST requests
      const { title, topic, author, content } = req.body;

      if (!title || !topic || !author || !content) {
        res.status(400).json({ error: "All fields are required" });
        return;
      }

      const sql =
        "INSERT INTO articles (title, topic, author, content) VALUES (?, ?, ?, ?)";
      db.query(sql, [title, topic, author, content], (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          res.json({ code: 200, status: "Data inserted into the database" });
        }
      });
    } else if (req.method === "DELETE") {
      // Handle DELETE requests
      const { params } = req.query;

      if (params === "deleteArticle") {
        const { articleId } = req.query;
        const sqlDelete = "DELETE FROM articles WHERE id = ?";
        db.query(sqlDelete, [articleId], (error, result) => {
          if (error) {
            console.error("Error during article deletion:", error);
            res
              .status(500)
              .json({ success: false, message: "Error deleting the article" });
          } else {
            res.json({
              success: true,
              message: "Article deleted successfully",
            });
          }
        });
      } else {
        res.status(400).json({ error: "Invalid request parameters" });
      }
    } else {
      res.status(405).end(); // Method Not Allowed
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
