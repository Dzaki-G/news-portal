export function reportPerformanceMetrics() {
    if (typeof window === 'undefined') return;
  
    if (document.readyState === "complete") {
        const [nav] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        console.log("⏱️ Load Time:", nav.loadEventEnd - nav.startTime, "ms");
      } else {
        window.addEventListener('load', () => {
          const [nav] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
          console.log("⏱️ Load Time:", nav.loadEventEnd - nav.startTime, "ms");
        });
      }
  
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === "first-contentful-paint") {
          console.log("🎨 FCP:", entry.startTime.toFixed(2), "ms");
        }
      }
    }).observe({ type: "paint", buffered: true });
  
    let readCount = sessionStorage.getItem("readCount") || "0";
    readCount = (parseInt(readCount) + 1).toString();
    sessionStorage.setItem("readCount", readCount);
    console.log("📚 Artikel dibaca:", readCount);
  
    window.addEventListener("scroll", () => {
      const scrollTop = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = (scrollTop / height) * 100;
      if (scrollPercent > 90) {
        console.log("📈 Scroll depth > 90%");
      }
    });
  
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "BUTTON") {
        console.log("🖱️ Tombol diklik:", target.innerText);
      }
    });
  }
  