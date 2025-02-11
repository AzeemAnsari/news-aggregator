import Header from "./components/Header";
import SearchFilters from "./components/SearchFilters";
import ArticleList from "./components/ArticleList";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <SearchFilters />
      <ArticleList />
    </div>
  );
}

export default App;
