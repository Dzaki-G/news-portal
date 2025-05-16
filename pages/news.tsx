import { getSession, signOut } from "next-auth/react";
import {
  fetchCurrents,
  fetchMediastack,
  fetchNewsAPI,
} from "@/lib/fetchNews";
import { GetServerSideProps } from "next";
import styles from './news.module.css';
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { reportPerformanceMetrics } from "../lib/metrics";



type Article = {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  publishedAt?: string;
  source?: string;
};



export default function NewsPage({
  currents,
  mediastack,
  newsapi,
}: {
  currents: Article[];
  mediastack: Article[];
  newsapi: Article[];
}) {
  const router = useRouter();
  const [activeSource, setActiveSource] = useState<string>("all");
  const [cIndex, setCIndex] = useState(0);
  const [mIndex, setMIndex] = useState(0);
  const [nIndex, setNIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    reportPerformanceMetrics();
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") {
        setIsDarkMode(true);
      }
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
    router.push('/');
  };

  const sources = [
    { name: "Currents", data: currents, index: cIndex, setIndex: setCIndex },
    { name: "Mediastack", data: mediastack, index: mIndex, setIndex: setMIndex },
    { name: "NewsAPI", data: newsapi, index: nIndex, setIndex: setNIndex },
  ];

  const filterArticles = (articles: Article[]) => {
    if (!searchTerm) return articles;
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.description &&
          article.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const allArticles = [...currents, ...mediastack, ...newsapi].sort((a, b) => {
    if (a.publishedAt && b.publishedAt) {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    }
    return 0;
  });

  // Format date for display
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  return (
    <>
      <Head>
        <title>Dzaki Ge NEWS</title>
        <meta name="description" content="Berita terupdate dari berbagai sumber terpercaya." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Berita Terbaru" />
        <meta property="og:description" content="Berita terupdate dari berbagai sumber terpercaya." />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="/images/berita.jpg" />
        <link rel="canonical" href="https://news-portal.vercel.app/news" />

        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": "Judul Berita Terbaru",
            "image": ["https://news-portal.vercel.app/images/berita.jpg"],
            "datePublished": "2025-05-16T09:00:00+07:00",
            "dateModified": "2025-05-16T10:00:00+07:00",
            "author": {
              "@type": "Person",
              "name": "Admin Portal"
            },
            "publisher": {
              "@type": "Organization",
              "name": "News Portal",
              "logo": {
                "@type": "ImageObject",
                "url": "https://news-portal.vercel.app/logo.png"
              }
            },
            "description": "Artikel berita terbaru dan terverifikasi dari News Portal"
          })
          }
        } />
      </Head>

      <div className={`${styles.container} ${isDarkMode ? styles.darkMode : ""}`}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.logo}>Dzaki <span>Ge NEWS</span></h1>
            <div className={styles.buttonsContainer}>
              <div className={styles.themeToggle}>
                <button onClick={toggleTheme} className={styles.themeButton}>
                  {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                </button>
              </div>
              <button 
                onClick={handleSignOut}
                className={styles.signOutButton}
              >
                Sign Out
              </button>
            </div>
          </div>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <nav className={styles.sourceNav}>
            <button 
              className={`${styles.sourceButton} ${activeSource === "all" ? styles.active : ""}`}
              onClick={() => setActiveSource("all")}
            >
              All Sources
            </button>
            {sources.map(({ name }) => (
              <button
                key={name}
                className={`${styles.sourceButton} ${activeSource === name ? styles.active : ""}`}
                onClick={() => setActiveSource(name)}
              >
                {name}
              </button>
            ))}
          </nav>
        </header>

        <main>
          {activeSource === "all" ? (
            <div className={styles.allArticlesGrid}>
            {filterArticles(allArticles).map((article, index) => (
              <div key={index} className={styles.articleCard}>
                <div className={styles.cardImageContainer}>
                  {article.imageUrl ? (
                    <div
                      className={styles.cardImage}
                      style={{
                        backgroundImage: `url(${article.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    ></div>
                  ) : (
                    <div className={styles.placeholderImage}>News</div>
                  )}
                  {article.source && (
                    <span className={styles.sourceTag}>{article.source}</span>
                  )}
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{article.title}</h3>
                  {article.publishedAt && (
                    <p className={styles.publishDate}>{formatDate(article.publishedAt)}</p>
                  )}
                  <p className={styles.cardDescription}>
                    {article.description || "No description available"}
                  </p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.readMoreLink}
                  >
                    Read full article
                  </a>
                </div>
              </div>
            ))}
          </div>
          ) : (
            <div className={styles.featuredColumns}>
              {sources
                .filter(({ name }) => activeSource === "all" || name === activeSource)
                .map(({ name, data, index, setIndex }) => {
                  const filteredData = filterArticles(data);
                  const article = filteredData[index];
                  
                  if (!article) return null;
                  
                  return (
                    <div key={name} className={styles.featuredColumn}>
                      <h2 className={styles.sourceTitle}>{name}</h2>
                      <div className={styles.featuredArticle}>
                        {article.imageUrl ? (
                          <div className={styles.featuredImage} style={{
                            backgroundImage: `url(${article.imageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}></div>
                        ) : (
                          <div className={styles.placeholderImage}>News</div>
                        )}
                        <h3 className={styles.featuredTitle}>{article.title}</h3>
                        {article.publishedAt && (
                          <p className={styles.publishDate}>{formatDate(article.publishedAt)}</p>
                        )}
                        <p className={styles.featuredDescription}>
                          {article.description || "No description available"}
                        </p>
                        <div className={styles.articleActions}>
                        <div className={styles.articleLinkContainer}>
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.readMoreLink}
                          >
                            Read full article
                          </a>
                        </div>
                          <button
                            onClick={() => setIndex((prev) => (prev + 1) % filteredData.length)}
                            className={styles.nextButton}
                            disabled={filteredData.length <= 1}
                          >
                            Next article
                          </button>
                        </div>
                      </div>

                      <div className={styles.miniArticles}>
                        {filteredData
                          .filter((_, i) => i !== index)
                          .slice(0, 3)
                          .map((miniArticle, i) => (
                            <div key={i} className={styles.miniArticle}>
                              <h4 className={styles.miniTitle}>{miniArticle.title}</h4>
                              <button
                                onClick={() => setIndex(
                                  filteredData.findIndex(
                                    (a) => a.title === miniArticle.title
                                  )
                                )}
                                className={styles.viewButton}
                              >
                                View
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </main>

        <footer className={styles.footer}>
          <p>
            &copy; {new Date().getFullYear()} Dzaki Ge NEWS | API yang digunakan Currents, Mediastack, and NewsAPI
          </p>
        </footer>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/?authMessage=Login required to access news.",
        permanent: false,
      },
    };
  }

  try {
    const [currentsData, mediastackData, newsapiData] = await Promise.all([
      fetchCurrents(),
      fetchMediastack(),
      fetchNewsAPI(),
    ]);

    // Add source information to each article
    const currents = currentsData.map((article: Article) => ({
      ...article,
      source: "Currents"
    }));
    
    const mediastack = mediastackData.map((article: Article) => ({
      ...article,
      source: "Mediastack"
    }));
    
    const newsapi = newsapiData.map((article: Article) => ({
      ...article,
      source: "NewsAPI"
    }));

    return {
      props: {
        currents,
        mediastack,
        newsapi,
      },
    };
  } catch (error) {
    console.error("Error fetching news:", error);
    return {
      props: {
        currents: [],
        mediastack: [],
        newsapi: [],
        error: "Failed to fetch news data"
      },
    };
  }
};
