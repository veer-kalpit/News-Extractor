const express = require("express");
const cors = require("cors");
const getNews = require("./scraper");

const app = express();
const PORT = 5000;

app.use(cors());

// Route to get news data
app.get("/api/news", async (req, res) => {
  const articles = await getNews();
  res.json(articles);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port = ${PORT}`);
});
