import { useEffect, useState } from "react";
import SearchBar from "./components/Searchbar";

const App = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voices, setVoices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const articlesPerPage = 10;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          "https://backend-news-extractor.vercel.app/"
        );
        const data = await response.json();
        setNews(data);
        setFilteredNews(data); // Initially show all news
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    const handleVoiceChange = () => {
      let availableVoices = speechSynthesis.getVoices();

      if (availableVoices.length === 0) {
        setTimeout(handleVoiceChange, 100);
        return;
      }

      setVoices(availableVoices);
    };

    handleVoiceChange();
    speechSynthesis.onvoiceschanged = handleVoiceChange;
  }, []);

  const handleVoiceSelect = (event) => {
    const selectedVoiceName = event.target.value;
    const voice = voices.find((v) => v.name === selectedVoiceName);
    setSelectedVoice(voice);
  };

  const readTitle = (title) => {
    if (!selectedVoice) return;
    const utterance = new SpeechSynthesisUtterance(title);
    utterance.voice = selectedVoice;
    window.speechSynthesis.speak(utterance);
  };

  const handleSearch = (filteredArticles) => {
    setFilteredNews(filteredArticles);
    setCurrentPage(1); // Reset to the first page on new search
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredNews(news);
    } else {
      const filtered = news.filter((article) => article.category === category);
      setFilteredNews(filtered);
    }
    setCurrentPage(1); // Reset to the first page on filter change
  };

  const totalPages = Math.ceil(filteredNews.length / articlesPerPage);
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredNews.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div>Loading news...</div>;
  }

  return (
    <div>
      <div style={{ padding: "20px" }}>
        <h1>Latest News</h1>

        {/* Voice selection dropdown */}
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="voiceSelect">Select Voice: </label>
          <select
            id="voiceSelect"
            onChange={handleVoiceSelect}
            value={selectedVoice?.name || ""}
            style={{
              padding: "5px",
              marginLeft: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Select a voice</option>
            {voices.map((voice, index) => (
              <option key={index} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>

        {/* Category filter */}
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="categorySelect">Filter by Category: </label>
          <select
            id="categorySelect"
            onChange={(e) => handleCategoryChange(e.target.value)}
            value={selectedCategory}
            style={{
              padding: "5px",
              marginLeft: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          >
            <option value="All">All</option>
            <option value="Technology">Technology</option>
            <option value="Sports">Sports</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Politics">Politics</option>
          </select>
        </div>

        <SearchBar
          placeholder="Search news..."
          data={news}
          onSearch={handleSearch}
        />

        <ul style={{ listStyleType: "none", padding: 0 }}>
          {currentArticles.map((article, index) => (
            <li
              key={index}
              style={{
                marginBottom: "10px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "#007bff" }}
              >
                {article.title}
              </a>
              <button
                onClick={() => readTitle(article.title)}
                disabled={!selectedVoice}
                style={{
                  marginLeft: "10px",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  border: "none",
                  backgroundColor: selectedVoice ? "#007bff" : "#ccc",
                  color: "white",
                  cursor: selectedVoice ? "pointer" : "not-allowed",
                }}
              >
                Read Title
              </button>
            </li>
          ))}
        </ul>

        <div style={{ marginTop: "20px" }}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              style={{
                padding: "5px 10px",
                margin: "0 5px",
                border: "1px solid #007bff",
                borderRadius: "5px",
                backgroundColor:
                  currentPage === index + 1 ? "#007bff" : "transparent",
                color: currentPage === index + 1 ? "white" : "#007bff",
                cursor: "pointer",
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
