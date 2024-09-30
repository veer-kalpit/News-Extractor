const express = require("express");
const cors = require("cors");
const getNews = require("./scraper");

const app = express();
const PORT = 5000;

app.use(cors());

// Route to get news data at the root path
app.get("/", async (req, res) => {
  try {
    const articles = await getNews();
    if (articles.length === 0) {
      return res.status(404).json({ message: "No articles found" });
    }
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching articles", error });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port = ${PORT}`);
});
