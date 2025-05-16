// lib/fetchNews.ts
import axios from "axios";

export const fetchCurrents = async () => {
    try {
      const res = await axios.get("https://api.currentsapi.services/v1/latest-news", {
        params: {
          apiKey: process.env.CURRENTS_API_KEY,
          language: "en",
          category: "technology", // optional
        },
      });
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const articles = res.data.news.map((article: any) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        imageUrl: article.image || "/placeholder.png",
        publishedAt: article.published,
      }));
  
      return articles;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to fetch from Currents API:", error.response?.data || error.message);
      return [];
    }
  };

  export const fetchMediastack = async () => {
    try {
      const res = await axios.get("http://api.mediastack.com/v1/news", {
        params: {
          access_key: process.env.MEDIASTACK_API_KEY,
          languages: "en",
          categories: "technology",
          limit: 10,
        },
      });
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const articles = res.data.data.map((article: any) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        imageUrl: article.image || "/placeholder.png",
        publishedAt: article.published_at,
      }));
  
      return articles;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response?.status === 429) {
        console.warn("⚠️ Mediastack rate limit reached (429). Returning empty fallback.");
      } else {
        console.error("❌ Mediastack fetch error:", error.message);
      }
  
      return [];
    }
  };
  
  export const fetchNewsAPI = async () => {
    try {
      const res = await axios.get("https://newsapi.org/v2/top-headlines", {
        params: {
          apiKey: process.env.NEWSAPI_API_KEY,
          category: "technology",
          language: "en",
          pageSize: 10,
        },
      });
  
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return res.data.articles.map((a: any) => ({
        title: a.title,
        description: a.description,
        url: a.url,
        imageUrl: a.urlToImage || "/placeholder.png",
     
      }));
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("NewsAPI error:", error.message);
      return [];
    }
  };


