import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchNews } from "../redux/newsSlice";
import { AppDispatch } from "../redux/store";
import { fetchSources } from "../utils/getSources";

const SearchFilters = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const [query, setQuery] = useState("");
  const [source, setSource] = useState("general");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [savedSource, setSavedSource] = useState("");
  const [savedCategory, setSavedCategory] = useState("");
  const [sources, setSources] = useState<{ value: string; label: string }[]>([]);


  useEffect(() => {
    const loadSources = async () => {
      const sourceData = await fetchSources();
      setSources(sourceData);
    };
    loadSources();
  }, []);

  //Load User Preferences on Mount
  useEffect(() => {
    const storedSource = localStorage.getItem("preferred_source");
    const storedCategory = localStorage.getItem("preferred_category");

    if (storedSource) setSavedSource(storedSource);
    if (storedCategory) setSavedCategory(storedCategory);

    if (storedSource) setSource(storedSource);
    if (storedCategory) setCategory(storedCategory);

    dispatch(fetchNews({ query: "", source: storedSource || "general", category: storedCategory || "", date: "" }));
  }, [dispatch]);

  // Save User Preferences
  const handleSavePreferences = () => {
    localStorage.setItem("preferred_source", source);
    localStorage.setItem("preferred_category", category);
    setSavedSource(source);
    setSavedCategory(category);
    alert("Preferences saved successfully!");
  };

  useEffect(() => {
    // console.log(category);
    
    dispatch(fetchNews({ query, source, category, date }));
  }, [source, category, date, dispatch]);

  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSource(e.target.value);
    setCategory("");
  }
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setSource("");
  }

  const handleSearch = () => {
    if (!query.trim()) return;
    setSource("general");
    setCategory("");
    setDate("");
    dispatch(fetchNews({ query, source, category, date }));
  };

  const handleReset = () => {
    setQuery("");
    setSource("general");
    setCategory("");
    setDate("");
    setSavedSource("general");
    setSavedCategory("");
    localStorage.removeItem("preferred_source");
    localStorage.removeItem("preferred_category");
    dispatch(fetchNews({ query: "", source: "general", category: "", date: "" }));
  };

  const categories = [
    { value: "business", label: "Business" },
    { value: "technology", label: "Technology" },
    { value: "sports", label: "Sports" },
    { value: "health", label: "Health" },
    { value: "entertainment", label: "Entertainment" },
    { value: "science", label: "Science" },
    { value: "politics", label: "Politics" }
  ];

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 flex flex-wrap gap-4">
      <input type="text" placeholder="Search articles..." value={query} onChange={(e) => setQuery(e.target.value)}
        className="p-2 border rounded w-full md:w-1/3" />

      <button onClick={handleSearch} className="p-2 bg-blue-500 text-white rounded">Search</button>

      {/* Sources Dropdown */}
      <select value={source} onChange={handleSourceChange} className="p-2 border rounded">
        <option value="general">General</option>
        {sources.map((src) => (
          <option key={src.value} value={src.value}>{src.label}</option>
        ))}
      </select>

      {/* Categories Dropdown */}
      <select value={category} onChange={handleCategoryChange} className="p-2 border rounded">
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.value} value={cat.value}>{cat.label}</option>
        ))}
      </select>

      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="p-2 border rounded" />

      <button onClick={handleReset} className="p-2 bg-red-500 text-white rounded">Reset</button>

      {/* Save Preferences Button */}
      <button onClick={handleSavePreferences} className="p-2 bg-green-500 text-white rounded">Save Preferences</button>
      
      {/* Show Saved Preferences */}
      {/* {(savedSource !== "all" || savedCategory) && (
        <div className="mt-2 p-2 bg-gray-200 dark:bg-gray-700 rounded">
          <p className="text-sm">Saved Preferences:</p>
          {savedSource !== "all" && <p className="text-sm">Source: {savedSource}</p>}
          {savedCategory && <p className="text-sm">Category: {savedCategory}</p>}
        </div>
      )} */}
    </div>
  );
};

export default SearchFilters;
