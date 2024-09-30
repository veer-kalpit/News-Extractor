const axios = require("axios");
const cheerio = require("cheerio");

const getNews = async () => {
  try {
    // Fetch the HTML from the Times of India website
    const { data } = await axios.get("https://navbharattimes.indiatimes.com/");
    const $ = cheerio.load(data);
    let articles = [];

    // Correct selector for the headlines and links
    $("a[href*='/articleshow/']").each((index, element) => {
      const title = $(element).text().trim();
      const link = $(element).attr("href");

      // Construct the full link if it's a relative URL
      const fullLink = link.startsWith("http")
        ? link
        : `https://timesofindia.indiatimes.com${link}`;

      // Only add valid entries (non-empty title)
      if (title) {
        articles.push({ title, link: fullLink });
      }
    });

    console.log(articles); // Log the scraped articles to verify
    return articles;
  } catch (error) {
    console.error("Error scraping news:", error);
  }
};

module.exports = getNews;
