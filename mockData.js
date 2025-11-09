const mockData = {
  Session: "...",
  id: "...",
  ui: "rest-api",
  list: [
    {
      type: "video",
      thumbnail: [{ url: "https://d153vhm9x4bt63.cloudfront.net/test1.jpg" }],
      name: "Movie Ticket? What Minimum Wage Buys You: Then and Now",
      branding: "The New York Times",
      origin: "sponsored",
      url: "http://sponsored.example.com/item1",
    },

    {
      type: "article",
      thumbnail: [{ url: "https://d153vhm9x4bt63.cloudfront.net/test2.jpg" }],
      name: "How to make the perfect coffee",
      branding: "Example Site",
      origin: "organic",
      url: "http://organic.example.com/item2",
    },
  ],
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { mockData };
}
