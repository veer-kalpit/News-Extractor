"use client";

import { useState } from "react";
import { Article } from "../../types/Articles";

interface SearchBarProps {
  placeholder?: string;
  data: Article[];
  onSearch: (filteredData: Article[]) => void;
}

interface SearchBarProps {
  placeholder?: string;
  data: Article[];
  onSearch: (filteredData: Article[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  data,
  onSearch,
}) => {
  const [query, setQuery] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Filter articles based on query
    const filteredData = data.filter((item) =>
      item.title.toLowerCase().includes(value.toLowerCase())
    );

    // Pass filtered articles to parent component
    onSearch(filteredData);
  };

  return (
    <div style={{ margin: "20px 0" }}>
      <input
        type="text"
        placeholder={placeholder || "Search..."}
        value={query}
        onChange={handleInputChange}
        className="w-full p-3 border-2 border-[#ccc] rounded-md"
      />
    </div>
  );
};

export default SearchBar;
