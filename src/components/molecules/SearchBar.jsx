import { useState } from "react";
import { motion } from "framer-motion";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search...", 
  className = "",
  showFilterButton = false,
  onFilter 
}) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    // Real-time search
    onSearch(value);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSearch}
      className={`flex items-center space-x-4 ${className}`}
    >
      <div className="flex-1">
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          icon="Search"
          className="bg-white"
        />
      </div>
      
      {showFilterButton && (
        <Button
          type="button"
          variant="outline"
          icon="Filter"
          onClick={onFilter}
        >
          Filter
        </Button>
      )}
    </motion.form>
  );
};

export default SearchBar;