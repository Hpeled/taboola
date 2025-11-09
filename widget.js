const WIDGET_CONTAINER_ID = "recommendations-widget";

const BASE_API_URL =
  "http://api.taboola.com/1.0/json/taboola-templates/recommendations.get?app.type=desktop&app.apikey=f9040ab1b9c802857aa783c469d0e0ff7e7366e4&count=8&source.type=video&source.id=214321562187&source.url=http://www.site.com/videos/214321562187.html";

const USE_MOCK_DATA = true;

async function getMockData() {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const data = {
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
        name: "How to make the perfect coffee: A comprehensive guide",
        branding: "Example Site",
        origin: "organic",
        url: "http://organic.example.com/item2",
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
        type: "video",
        thumbnail: [{ url: "https://d153vhm9x4bt63.cloudfront.net/test6.jpg" }],
        name: "A deep dive into JavaScript's asynchronous nature",
        branding: "Coding School",
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
        type: "video",
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

async function fetchRecommendations(countryCode = "US") {
  if (USE_MOCK_DATA) {
    const data = await getMockData();
    renderWidget(data);
    return;
  }

  const API_URL = `${BASE_API_URL}&user.country=${countryCode}`;
  console.log(`מתחיל בטעינת נתונים עבור GEO: ${countryCode}...`);

  try {
    const response = await fetch(API_URL);

    const data = await response.json();

    const recommendations = data?.list;

    if (!recommendations || recommendations.length === 0) {
      if (countryCode !== "GB") {
        console.log("Empty list, trying alternative geography: GB");

        return await fetchRecommendations("GB");
      }

      console.log("No data was found even after repeated attempts.");
      const container = document.getElementById(WIDGET_CONTAINER_ID);
      container.innerHTML = "No recommendations were found after two attempts.";
      return;
    }

    console.log(`API data successfully received for${countryCode}:`, data);
    renderWidget(data);
  } catch (error) {}
}

function renderWidget(data) {
  const container = document.getElementById(WIDGET_CONTAINER_ID);

  const PLACEHOLDER_IMAGES = [
    "img/placeholder-1.jpg",
    "img/placeholder-2.jpg",
    "img/placeholder-3.jpg",
    "img/placeholder-4.jpg",
  ];

  const recommendations = data?.list;
  if (!recommendations || recommendations.length === 0) {
    container.innerHTML = "No recommendations found.";
    return;
  }

  const widgetContent = document.createElement("div");
  widgetContent.className = "recommendations-grid";
  const likedItems = JSON.parse(localStorage.getItem("likedItems")) || [];

  recommendations.forEach((item, index) => {
    const linkUrl = item.url;
    const imageUrl = item.thumbnail[0]?.url;
    const title = item.name;
    const description = item.description;
    const fallbackImage = PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];

    const isSponsored = item.origin === "sponsored";

    let originLabelHTML = "";
    if (isSponsored) {
      originLabelHTML =
        '<div class="card-origin-label sponsored">SPONSORED</div>';
    } else {
      originLabelHTML =
        '<div class="card-origin-label organic">FROM THE WEB</div>';
    }

    const card = document.createElement("a");
    card.href = linkUrl;
    card.className = "recommendation-card";

    card.target = isSponsored ? "_blank" : "_self";

    card.innerHTML = `
           <div class="card-image-container">
        <img src="${imageUrl}" alt="${title}" class="card-image" onerror="this.onerror=null; this.src='${fallbackImage}';">
        ${item.type === "video" ? '<span class="video-icon">▶</span>' : ""} 
    
    </div>
    <div class="card-content">
        <p class="card-title">${title}</p>
        <p class="card-source">${item.branding}</p>
        
        ${originLabelHTML}  <div class="card-actions">
           <button class="action-button like-button" id="like-button-${
             item.id
           }" data-item-id="${
      item.id
    }">♡</button> <button class="action-button share-button" 
                    data-title="${title}" 
                    data-url="${linkUrl}">Share</button>
        </div>
    </div>
    `;

    if (!item.id) {
      item.id = `mock-item-${index}`;
    }

    widgetContent.appendChild(card);
  });

  container.innerHTML = "";
  container.appendChild(widgetContent);
}

function toggleLike(itemId) {
  let likedItems = JSON.parse(localStorage.getItem("likedItems")) || [];
  const likeButton = card.querySelector(`#like-button-${item.id}`);
  const shareButton = card.querySelector(".share-button");

  if (likedItems.includes(itemId)) {
    likedItems = likedItems.filter((id) => id !== itemId);
    if (likeButton) {
      likeButton.classList.remove("liked");
      likeButton.textContent = "♡";
    }
  } else {
    likedItems.push(itemId);
    if (likeButton) {
      likeButton.classList.add("liked");
      likeButton.textContent = "❤";
    }
  }
  localStorage.setItem("likedItems", JSON.stringify(likedItems));
}

function shareItem(title, url) {
  if (navigator.share) {
    navigator
      .share({
        title: title,
        url: url,
      })
      .then(() => console.log("Sherd"))
      .catch((error) => console.error("Sharing error", error));
  } else {
    alert(`${url}\n(The browser does not support the Web Share API.)`);
  }
}

fetchRecommendations();

if (typeof window !== "undefined" && typeof document !== "undefined") {
  if (document.getElementById(WIDGET_CONTAINER_ID)) {
    fetchRecommendations("US");
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    renderWidget,
    fetchRecommendations,
  };
}
