import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface NewsState {
  news: any[];
  interval: NodeJS.Timeout | null;
  activeArticle: any | null;
  fetchNews: () => Promise<void>;
  getNewsIfEmpty: () => void;
  setupInterval: () => void;
  cleanupInterval: () => void;
  setActiveArticle: (article: any) => void;
}

const useNewsStore = create<NewsState>()(
  immer((set, get) => ({
    news: [],
    interval: null,
    activeArticle: null,

    fetchNews: async () => {
      try {
        const response = await fetch(
          "https://min-api.cryptocompare.com/data/v2/news/?lang=EN"
        );
        if (response.ok) {
          const json = await response.json();
          set((state) => {
            state.news = json["Data"];
          });
        } else {
          console.log("Fetch Error :-S", response.status);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    },

    getNewsIfEmpty: () => {
      const { news, fetchNews } = get();
      if (!news.length) {
        fetchNews();
      }
    },

    setupInterval: () => {
      const { interval, getNewsIfEmpty } = get();
      if (!interval) {
        getNewsIfEmpty();
        const newInterval = setInterval(() => {
          getNewsIfEmpty();
        }, 300000); // fetch news every 5 minutes
        set((state) => {
          state.interval = newInterval;
        });
      }
    },

    cleanupInterval: () => {
      set((state) => {
        if (state.interval) {
          clearInterval(state.interval);
          state.interval = null;
        }
      });
    },

    setActiveArticle: (article) => {
      set((state) => {
        state.activeArticle = article;
      });
    },
  }))
);

export default useNewsStore;
