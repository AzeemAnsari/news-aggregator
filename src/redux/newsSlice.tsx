import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Article {
  title: string;
  description?: string;
  url: string;
  source: { name: string };
  author?: string;
  image?: string;
  publishTime?: string;
}

interface FetchNewsParams {
  query?: string;
  source?: string;
  category?: string;
  date?: string;
}

interface NewsState {
  articles: Article[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: NewsState = {
  articles: [],
  status: "idle",
};

export const fetchNews = createAsyncThunk(
  "news/fetchNews",
  async ({ query = "", source = "general", category = "", date = "" }: FetchNewsParams) => {
    // console.log("source",source);
    // console.log("category",category);
    
    const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
    const GUARDIAN_API_KEY = import.meta.env.VITE_GUARDIAN_API_KEY;
    const NYT_API_KEY = import.meta.env.VITE_NYT_API_KEY;

    // / Load saved preferences
    const savedSource = localStorage.getItem("preferred_source") || "general";
    const savedCategory = localStorage.getItem("preferred_category") || "";
    // console.log("Saved Category:", savedCategory);
    // console.log("Category:", category);
    
    let urls: Record<string, string> = {}; // Store API URLs
    const today = new Date().toISOString().split("T")[0];

    // NewsAPI Handling (Uncommented & Fixed)
    if (source === "general" && !category) {
      urls["newsapi"] = query
        ? `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${NEWS_API_KEY}`
        : `https://newsapi.org/v2/everything?q=all&apiKey=${NEWS_API_KEY}`;;
    }else if (!category) {
      urls["newsapi"] = `https://newsapi.org/v2/top-headlines?sources=${source || 'bbc-news'}&apiKey=${NEWS_API_KEY}`;
    }else{
      urls["newsapi"] = `https://newsapi.org/v2/top-headlines?category=${category || savedCategory}&apiKey=${NEWS_API_KEY}`;
    }

    // The Guardian API
    if (source === "general") {
      let guardianUrl = `https://content.guardianapis.com/search?api-key=${GUARDIAN_API_KEY}&show-fields=headline,trailText,byline,thumbnail&page-size=50`;
      if (query) guardianUrl += `&q=${encodeURIComponent(query)}`;
      if (date) guardianUrl += `&from-date=${date}`;
      if (category) guardianUrl += `&section=${category ?? savedCategory}`;
      urls["guardian"] = guardianUrl;
    }

    // NYTimes API
    if (source === "general") {
      if (query) {
        let nytUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${encodeURIComponent(query)}&api-key=${NYT_API_KEY}`;
    
        // Append Category if selected
        if (category ?? savedCategory) {
          nytUrl += `&fq=news_desk:("${category ?? savedCategory}")`; // Correct NYTimes format
        }
    
        // Append Date if selected
        if (date) {
          const formattedDate = date.replace(/-/g, ""); // Convert YYYY-MM-DD to YYYYMMDD
          nytUrl += `&begin_date=${formattedDate}`;
        }
    
        urls["nyt"] = nytUrl;
      } else {
        // Default to "top stories" if no query
        urls["nyt"] = `https://api.nytimes.com/svc/topstories/v2/${category || "home"}.json?api-key=${NYT_API_KEY}`;
      }
    }
    

    try {
      const responses = await Promise.allSettled(
        Object.values(urls).map((url) => axios.get(url))
      );

      const allArticles: Article[] = [];

      responses.forEach((response) => {
        if (response.status === "fulfilled") {
          const data = response.value.data;
          const responseUrl = response.value?.config?.url || "";
          console.log("data", data);
          
          if (responseUrl.includes("newsapi.org")) {
            allArticles.push(
              ...data.articles.map((article: any) => ({
                title: article.title,
                description: article.description,
                url: article.url,
                source: article.source?.name || "NewsAPI",
                author: article.author || "Unknown",
                image: article.urlToImage || null,
                publishTime: article.publishedAt,
                category: article.source?.category || "general",
              }))
            );
          }
           if (responseUrl.includes("content.guardianapis.com")) {
            // console.log("Guardian Data:", data);
            // console.log("Guardian Results:", data.response?.results);

            if (data.response?.results?.length) {
              allArticles.push(
                ...data.response.results.map((article: any) => ({
                  title: article.fields?.headline,
                  description: article.fields?.trailText || "",
                  url: article.webUrl,
                  source: "The Guardian",
                  author: article.fields?.byline || "Unknown",
                  image: article.fields?.thumbnail || null,
                  publishTime: article.webPublicationDate,
                  category: article.sectionId,
                }))
              );
              // console.log("after push", allArticles);
            } else {
              console.warn("⚠ Guardian API returned empty results!");
            }
          } else if (responseUrl.includes("api.nytimes.com")) {
            if (query) {
              allArticles.push(
                ...data.response?.docs?.map((article: any) => ({
                  title: article.headline?.main,
                  description: article.abstract,
                  url: article.web_url,
                  source: "New York Times",
                  author: article.byline?.original || "Unknown",
                  publishTime: article.pub_date,
                  image: article.multimedia?.length
                    ? `https://static01.nyt.com/${article.multimedia[0].url}`
                    : null,
                  category: article.news_desk?.toLowerCase(),
                })) || []
              );
            } else {
              allArticles.push(
                ...data.results?.map((article: any) => ({
                  title: article.title,
                  description: article.abstract,
                  url: article.url,
                  source: "New York Times",
                  author: article.byline,
                  publishTime: article.published_date,
                  image: article.multimedia?.length ? article.multimedia[0].url : null,
                  category: article.section,
                })) || []
              );
            }
          }
        }
      });

      // console.log("All Articles:", allArticles);
      return allArticles.length > 0 ? allArticles.filter((item) => item.title !== "") : [];

    } catch (error) {
      console.error("Error fetching news:", error);
      throw error;
    }
  }
);


const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.articles = action.payload;
      })
      .addCase(fetchNews.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default newsSlice.reducer;
