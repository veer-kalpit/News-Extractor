const axios = require("axios");
const cheerio = require("cheerio");

const getNews = async () => {
  try {
    // Fetch the HTML from the Times of India website
    const { data } = await axios.get("https://www.thehindu.com/");
    const $ = cheerio.load(data);
    let articles = [];

    // Inspect the structure of the page to find the correct selector
    $("a[href*='/articleshow/']").each((index, element) => {
      const title = $(element).text();
      const link = $(element).attr("href");

      // Construct the full link if it's a relative URL
      const fullLink = link.startsWith("http")
        ? link
        : `https://www.thehindu.com/${link}`;

      // Only add valid entries (non-empty title)
      if (title) {
        articles.push({ title, link: fullLink });
      }
    });

    console.log("Extracted Articles:", articles);
    return articles;
  } catch (error) {
    console.error("Error scraping news:", error.message);
  }
};

module.exports = getNews;

// Example usage
getNews().then((articles) => {
  console.log("Full News Headlines:", articles);
});
