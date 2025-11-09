// קובץ: widget.js

async function getMockData() {
  // השהייה קצרה לדמות זמן טעינה
  await new Promise((resolve) => setTimeout(resolve, 500));

  const data = {
    list: [
      {
        type: "video",
        thumbnail: [{ url: "https://d153vhm9x4bt63.cloudfront.net/test1.jpg" }],
        name: "Why the stock market is crashing after the holiday season",
        branding: "Financial Times",
        origin: "sponsored",
        url: "#",
      },

      {
        type: "article",
        thumbnail: [{ url: "https://d153vhm9x4bt63.cloudfront.net/test2.jpg" }],
        name: "How to make the perfect sourdough starter at home",
        branding: "Example Site",
        origin: "organic",
        url: "#",
      },

      {
        type: "article",
        thumbnail: [{ url: "https://d153vhm9x4bt63.cloudfront.net/test3.jpg" }],
        name: "The best gadgets for working from home in 2025",
        branding: "Tech Insider",
        origin: "sponsored",
        url: "#",
      },

      {
        type: "article",
        thumbnail: [{ url: "https://d153vhm9x4bt63.cloudfront.net/test4.jpg" }],
        name: "5 Simple exercises to improve your daily posture",
        branding: "Wellness Today",
        origin: "organic",
        url: "#",
      },

      {
        type: "article",
        thumbnail: [{ url: "https://d153vhm9x4bt63.cloudfront.net/test5.jpg" }],
        name: "Discovering hidden trails in the Swiss Alps",
        branding: "Travel Blog",
        origin: "sponsored",
        url: "#",
      },

      {
        type: "article",
        thumbnail: [{ url: "https://d153vhm9x4bt63.cloudfront.net/test6.jpg" }],
        name: "A deep dive into JavaScript's asynchronous nature",
        branding: "Coding School",
        origin: "organic",
        url: "#",
      },
    ],
  };
  return data;
}
