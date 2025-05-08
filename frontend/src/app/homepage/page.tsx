"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import SearchBar from "../components/Searchbar";
import Footer from "../components/footer";
// import Image from "next/image";

import { Article } from "../../types/Articles";

const App: React.FC = () => {
  const [news, setNews] = useState<Article[]>([]);
  const [filteredNews, setFilteredNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");

  const articlesPerPage = 9; // Limit news cards to 9 per page

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

    // Load available voices for speech synthesis
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].name);
      }
    };

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();
    }
  }, []);

  const handleSearchToggle = () => {
    setIsSearchVisible((prev) => !prev);
  };

  const handleSearch = (filteredArticles: Article[]) => {
    setFilteredNews(filteredArticles); // Update filtered news
    setCurrentPage(1); // Reset to the first page on new search
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setFilteredNews(
      category === "all"
        ? news
        : news.filter((article) => article.category.toLowerCase() === category)
    );
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredNews.length / articlesPerPage);
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredNews.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  const handlePageChange = (direction: "prev" | "next") => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handleReadAloud = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = voices.find((v) => v.name === selectedVoice);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (loading) {
    return <div className="text-center">Loading news...</div>;
  }

  return (
    <div>
      <Navbar onSearchToggle={handleSearchToggle} />
      <div className="p-5 w-full max-w-6xl mx-auto">
        {isSearchVisible && (
          <div className="mb-5">
            <SearchBar
              placeholder="Search news..."
              data={news} 
              onSearch={handleSearch} 
            />
          </div>
        )}

        {/* Voice Selection */}
        <div className="mb-5">
          <p className="font-medium text-lg text-center mb-3">Select Voice:</p>
          <label htmlFor="voice-select" className="sr-only">
            Select a voice
          </label>
          <select
            id="voice-select"
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="block mx-auto border border-gray-300 p-2 rounded"
          >
            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>

        {/* Category filter as a Navbar */}
        <div className="mb-5">
          <p className="font-medium text-lg text-center mb-3">
            Filter News by Category:
          </p>
          <div className="flex justify-center space-x-4">
            {[
              { label: "All", value: "all" },
              { label: "Entertainment", value: "entertainment" },
              { label: "Sports", value: "sports" },
              { label: "Technology", value: "technology" },
              { label: "Education", value: "education" },
              { label: "Astrology", value: "astrology" },
              { label: "Life-style", value: "life-style" },
            ].map((category) => (
              <button
                key={category.value}
                onClick={() => handleCategoryChange(category.value)}
                className={`px-4 py-2 rounded ${selectedCategory === category.value
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white"
                  }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* News Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentArticles.map((article, index) => (
            <div
              key={index}
              className="p-4 border flex flex-col justify-between items-center border-gray-200 rounded shadow-md transition-transform duration-200 hover:scale-105 hover:shadow-lg"
            >
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-blue-600 hover:underline"
              >
                {article.title}
              </a>
              <p className="text-sm text-gray-500 mt-2">
                Category: {article.category}
              </p>
              {/* <img
                src={article.image?.startsWith("http") ? article.image : "/news-default.jpg"}
                alt="News Thumbnail"
                className="w-full h-40 object-cover mt-3 rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/news-default.jpg"; // Fallback to a default image
                }}
              /> */}

              <button
                onClick={() => handleReadAloud(article.title)}
                className="mt-3 px-3 py-1 rounded bg-green-500 text-white hover:bg-green-700 w-full"
              >
                Read Aloud
              </button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-5 flex justify-between">
          <button
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${currentPage === 1
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-700"
              }`}
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange("next")}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded ${currentPage === totalPages
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-700"
              }`}
          >
            Next
          </button>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default App;
