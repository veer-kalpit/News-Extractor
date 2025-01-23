"use client";
import { useEffect, useState, useMemo } from "react";
import SearchBar from "../components/Searchbar";

interface Article {
  title: string;
  link: string;
  category: string;
}

const App: React.FC = () => {
  const [news, setNews] = useState<Article[]>([]);
  const [filteredNews, setFilteredNews] = useState<Article[]>([]); // Filtered by search
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const articlesPerPage = 10;

  const extractCategoryFromUrl = (url: string) => {
    const urlParts = new URL(url).pathname.split("/").filter((part) => part);
    return urlParts[0];
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          "https://backend-news-extractor.vercel.app/"
        );
        const data: Article[] = await response.json();

        const articlesWithCategory = data.map((article) => ({
          ...article,
          category: extractCategoryFromUrl(article.link),
        }));

        setNews(articlesWithCategory);
        setFilteredNews(articlesWithCategory); // Initialize with all articles
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
      const availableVoices = speechSynthesis.getVoices();
      if (availableVoices.length === 0) {
        setTimeout(handleVoiceChange, 100);
        return;
      }
      setVoices(availableVoices);
    };

    handleVoiceChange();
    speechSynthesis.onvoiceschanged = handleVoiceChange;
  }, []);

  const handleVoiceSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVoiceName = event.target.value;
    const voice = voices.find((v) => v.name === selectedVoiceName);
    setSelectedVoice(voice || null);
  };

  const readTitle = (title: string) => {
    if (!selectedVoice) return;
    const utterance = new SpeechSynthesisUtterance(title);
    utterance.voice = selectedVoice;
    window.speechSynthesis.speak(utterance);
  };

  const handleSearch = (filteredArticles: Article[]) => {
    setFilteredNews(filteredArticles); // Update filtered news
    setCurrentPage(1); // Reset to the first page on new search
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const filteredArticles = useMemo(() => {
    const categoryFiltered =
      selectedCategory === "All"
        ? news
        : news.filter((article) => article.category === selectedCategory);

    return filteredNews.length > 0
      ? categoryFiltered.filter((article) =>
          filteredNews.some((filtered) => filtered.title === article.title)
        )
      : categoryFiltered;
  }, [selectedCategory, news, filteredNews]);

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div className="text-center">Loading news...</div>;
  }

  return (
    <div className="p-5 w-full max-w-6xl mx-auto">
     

      {/* Voice selection dropdown */}
      <div className="mb-5">
        <label htmlFor="voiceSelect" className="font-medium">
          Select Voice:{" "}
        </label>
        <select
          id="voiceSelect"
          onChange={handleVoiceSelect}
          value={selectedVoice?.name || ""}
          className="ml-3 p-2 rounded border border-gray-300 w-full sm:w-auto"
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
      <div className="mb-5">
        <label htmlFor="categorySelect" className="font-medium">
          Filter by Category:{" "}
        </label>
        <select
          id="categorySelect"
          onChange={(e) => handleCategoryChange(e.target.value)}
          value={selectedCategory}
          className="ml-3 p-2 rounded border border-gray-300 w-full sm:w-auto"
        >
          <option value="All">All</option>
          <option value="entertainment">Entertainment</option>
          <option value="sports">Sports</option>
          <option value="technology">Technology</option>
          <option value="education">Education</option>
          <option value="astrology">Astrology</option>
          <option value="life-style">Life-style</option>
        </select>
      </div>

      <SearchBar
        placeholder="Search news..."
        data={news} 
        onSearch={handleSearch} 
      />

      <ul className="list-none p-0">
        {currentArticles.map((article, index) => (
          <li
            key={index}
            className="mb-3 p-3 border border-gray-200 rounded flex justify-between items-center"
          >
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {article.title}
            </a>
            <button
              onClick={() => readTitle(article.title)}
              disabled={!selectedVoice}
              className={`ml-3 px-3 py-1 rounded text-white ${
                selectedVoice
                  ? "bg-blue-500 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Read Title
            </button>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="mt-5 flex justify-center">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 mx-1 border rounded ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
