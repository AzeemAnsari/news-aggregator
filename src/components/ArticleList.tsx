import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import ArticleCard from "./ArticleCard";

const ArticleList = () => {
  const { articles, status } = useSelector((state: RootState) => state.news);
  console.log(articles);
  
  if (status === "loading") return <p>Loading articles...</p>;
  if (status === "failed") return <p>Failed to fetch news.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {articles.map((article, index) => (
        <ArticleCard key={index} {...article} /> // ✅ Spread the article object as props
      ))}
    </div>
  );
};

export default ArticleList;
