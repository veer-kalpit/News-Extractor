import { useEffect, useState } from "react";

const App = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voices, setVoices] = useState([]);
  const articlesPerPage = 10;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          "https://backend-news-extractor.vercel.app/"
        );
        const data = await response.json();
        setNews(data);
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

      // Voices might not be available immediately, so retry if empty
      if (availableVoices.length === 0) {
        // Retry after 100ms
        setTimeout(handleVoiceChange, 100);
        return;
      }

      setVoices(availableVoices);
    };

    handleVoiceChange();
    speechSynthesis.onvoiceschanged = handleVoiceChange; // Update voices when they change
  }, []);

  const handleVoiceSelect = (event) => {
    const selectedVoiceName = event.target.value;
    const voice = voices.find((v) => v.name === selectedVoiceName);
    setSelectedVoice(voice);
  };

  const readTitle = (title) => {
    if (!selectedVoice) return;
    const utterance = new SpeechSynthesisUtterance(title);
    utterance.voice = selectedVoice; // Set the selected voice
    window.speechSynthesis.speak(utterance);
  };

  const totalPages = Math.ceil(news.length / articlesPerPage);
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = news.slice(indexOfFirstArticle, indexOfLastArticle);

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
        <div>
          <label htmlFor="voiceSelect">Select Voice: </label>
          <select
            id="voiceSelect"
            onChange={handleVoiceSelect}
            value={selectedVoice?.name || ""}
          >
            <option value="">Select a voice</option>{" "}
            {/* Option for no voice selected */}
            {voices.map((voice, index) => (
              <option key={index} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>

        <ul>
          {currentArticles.map((article, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              <a href={article.link} target="_blank" rel="noopener noreferrer">
                {article.title}
              </a>
              <button
                onClick={() => readTitle(article.title)}
                style={{ marginLeft: "10px" }}
              >
                Read Title
              </button>
            </li>
          ))}
        </ul>
        <div>
          {Array.from({ length: totalPages }, (_, index) => (
            <button key={index + 1} onClick={() => handlePageChange(index + 1)}>
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
