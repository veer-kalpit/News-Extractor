import { useState } from "react";
import PropTypes from "prop-types";

const SearchBar = ({ placeholder, data, onSearch }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
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
        style={{
          width: "100%",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />
    </div>
  );
};

SearchBar.propTypes = {
  placeholder: PropTypes.string, // Optional string
  data: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired, // Each item must have a title (required)
    })
  ).isRequired,
  onSearch: PropTypes.func.isRequired, // Function is required
};

export default SearchBar;
