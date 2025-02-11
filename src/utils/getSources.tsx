export const fetchSources = async () => {
  const CACHE_KEY = "news_sources";
  const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const { sources, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        console.log("Using cached sources");
        return sources;
      }
    }
  } catch (error) {
    console.warn("⚠ Failed to load cached sources. Fetching fresh data...");
  }

  try {
    const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
    const res = await fetch(`https://newsapi.org/v2/top-headlines/sources?apiKey=${NEWS_API_KEY}`);
    const data = await res.json();

    if (data.sources) {
      const sources = data.sources.map((source: any) => ({
        value: source.id, // ✅ Uses correct source ID
        label: source.name,
      }));

      localStorage.setItem(CACHE_KEY, JSON.stringify({ sources, timestamp: Date.now() }));
      console.log("Updated sources cache");
      return sources;
    }
  } catch (error) {
    console.error("Error fetching sources:", error);
  }

  return []; // ✅ Always return an empty array if fetching fails
};
