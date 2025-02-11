interface ArticleProps {
  title: string;
  description?: string;
  url: string;
  source?: string | null;
  author?: string;
  image?: string;
  publishTime?: string;
}


const ArticleCard = ({ title, description, url, source, image, author, publishTime }: ArticleProps) => {
  return (
    <div className="border rounded-lg shadow-md bg-white dark:bg-gray-900 dark:text-white overflow-hidden">
      {/* Article Image */}
      {image ? (
        <img src={image} alt={title} className="w-full h-48 object-cover" loading="lazy" />
      ) : (
        <div className="w-full h-48 bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-500">
          No Image Available
        </div>
      )}

      {/* Article Content */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        {description && <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{description}</p>}
        
        {/* Metadata */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {source && <p><strong>Source:</strong> {source}</p>}
          {author && <p><strong>Author:</strong> {author}</p>}
          {publishTime && <p><strong>Published:</strong> {new Date(publishTime).toDateString()}</p>}
        </div>

        {/* Read More Link */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-3 text-blue-500 hover:underline"
        >
          Read More →
        </a>
      </div>
    </div>
  );
};

export default ArticleCard;
