const axios = require("axios");
const cheerio = require("cheerio");

const getNews = async () => {
  try {
    const { data } = await axios.get("https://timesofindia.indiatimes.com/");
    const $ = cheerio.load(data);
    let articles = [];

    // Scrape news articles
    $("a[href*='/articleshow/']").each((index, element) => {
      const title = $(element).text().trim();
      const link = $(element).attr("href");
      const fullLink = link.startsWith("http")
        ? link
        : `https://timesofindia.indiatimes.com${link}`;

      // Locate the image tag related to this article
      const image = $(element).find("img").attr("data-src") || $(element).find("img").attr("src") || ""; // Check for lazy-loaded images

      if (title && link) {
        articles.push({ title, link: fullLink, image });
      }
    });

    // Filter out articles with no title or duplicate titles
    const uniqueArticles = articles.filter(
      (article, index, self) =>
        article.title &&
        self.findIndex((a) => a.title === article.title) === index
    );

    console.log("Extracted Articles with Images:", uniqueArticles);
    return uniqueArticles;
  } catch (error) {
    console.error("Error scraping news:", error.message);
  }
};

module.exports = getNews;

// Example usage
getNews().then((articles) => {
  console.log(articles);
});
