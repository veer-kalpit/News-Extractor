const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());

// Scraper function
const getNews = async () => {
  try {
    const { data } = await axios.get("https://timesofindia.indiatimes.com/");
    const $ = cheerio.load(data);
    const articles = [];

    $("a[href*='/articleshow/']").each((_, element) => {
      const title = $(element).text().trim();
      const link = $(element).attr("href");
      const fullLink = link.startsWith("http")
        ? link
        : `https://timesofindia.indiatimes.com${link}`;
      const category =
        $(element).closest("div.some-category-class").text().trim() ||
        "General"; // Update selector

      if (title) {
        articles.push({ title, link: fullLink, category });
      }
    });

    return articles;
  } catch (error) {
    console.error("Error scraping news:", error.message);
    throw error;
  }
};

// Route to fetch news
app.get("/", async (req, res) => {
  try {
    const news = await getNews();
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
