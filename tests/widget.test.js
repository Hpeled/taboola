const { renderWidget } = require("../widget");

const mockApiData = {
  list: [
    {
      url: "http://sponsored.link/1",
      thumbnail: [{ url: "http://image.com/sponsored1.jpg" }],
      name: "Sponsored Article",
      description: "This is a sponsored article description.",
      origin: "sponsored",
      branding: "Sponsored By Acme Inc.",
    },

    {
      url: "http://organic.link/2",
      thumbnail: [{ url: "http://image.com/organic2.jpg" }],
      name: "Organic Content",
      description: "This is an organic article description.",
      origin: "organic", // Origin 'organic'
      branding: "My Site",
    },

    {
      url: "http://noimage.link/3",
      thumbnail: [], // מערך תמונות ריק
      name: "Article with Missing Image",
      description: "Testing fallback image.",
      origin: "sponsored",
      branding: "Backup Test",
    },
  ],
};

describe("renderWidget", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="recommendations-widget"></div>';

    global.PLACEHOLDER_IMAGES = [
      "img/placeholder-1.jpg",
      "img/placeholder-2.jpg",
      "img/placeholder-3.jpg",
      "img/placeholder-4.jpg",
    ];
  });

  test("Should render all recommendations with the correct structure", () => {
    renderWidget(mockApiData);

    const container = document.getElementById("recommendations-widget");
    const cards = container.querySelectorAll(".recommendation-card");

    expect(cards.length).toBe(3);

    expect(container.querySelector(".recommendations-grid")).not.toBeNull();
  });

  test("Sponsored card should open in a new tab (_blank) and show branding", () => {
    renderWidget(mockApiData);

    const sponsoredCard = document.querySelectorAll(".recommendation-card")[0];

    expect(sponsoredCard.target).toBe("_blank");

    expect(sponsoredCard.querySelector(".card-type").textContent).toBe("מודעה");

    expect(sponsoredCard.querySelector(".card-source").textContent).toBe(
      "Sponsored By Acme Inc."
    );
  });

  test("Organic card should open in the same tab (_self) and hide branding", () => {
    renderWidget(mockApiData);

    const organicCard = document.querySelectorAll(".recommendation-card")[1];

    expect(organicCard.target).toBe("_self");

    expect(organicCard.querySelector(".card-type").textContent).toBe(
      "תוכן אורגני"
    );

    expect(organicCard.querySelector(".card-source")).toBeNull();
  });

  test("Card with missing image should use the correct fallback image in onerror", () => {
    renderWidget(mockApiData);

    const missingImageCard = document.querySelectorAll(
      ".recommendation-card"
    )[2];
    const imageElement = missingImageCard.querySelector("img");

    const expectedFallback = global.PLACEHOLDER_IMAGES[2];

    expect(imageElement.getAttribute("onerror")).toContain(
      `this.src='${expectedFallback}'`
    );
  });
});
