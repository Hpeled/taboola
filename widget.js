const WIDGET_CONTAINER_ID = "recommendations-widget";

const BASE_API_URL =
  "https://api.taboola.com/1.0/json/taboola-templates/recommendations.get" +
  "?app.type=desktop&app.apikey=f9040ab1b9c802857aa783c469d0e0ff7e7366e4" +
  "&count=12&source.type=video&source.id=214321562187" +
  "&source.url=http://www.site.com/videos/214321562187.html";

async function fetchRecommendations(countryCode = "US") {
  const API_URL = `${BASE_API_URL}&user.country=${countryCode}`;
  console.log(`מתחיל בטעינת נתונים עבור GEO: ${countryCode}...`);

  try {
    const response = await fetch(API_URL);

    const data = await response.json();

    const recommendations = data?.list;

    if (!recommendations || recommendations.length === 0) {
      if (countryCode !== "GB") {
        console.log("רשימה ריקה, מנסה GEO חלופי: GB");

        return await fetchRecommendations("GB");
      }

      console.log("נתונים לא נמצאו גם לאחר ניסיון חוזר.");
      const container = document.getElementById(WIDGET_CONTAINER_ID);
      container.innerHTML = "לא נמצאו המלצות לאחר שני ניסיונות.";
      return;
    }

    console.log(`נתוני API התקבלו בהצלחה עבור ${countryCode}:`, data);
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
    container.innerHTML = "לא נמצאו המלצות.";
    return;
  }

  const widgetContent = document.createElement("div");
  widgetContent.className = "recommendations-grid";

  recommendations.forEach((item, index) => {
    const linkUrl = item.url;
    const imageUrl = item.thumbnail[0]?.url;
    const title = item.name;
    const description = item.description;
    const fallbackImage = PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];

    const isSponsored = item.origin === "sponsored";

    const card = document.createElement("a");
    card.href = linkUrl;
    card.className = "recommendation-card";

    card.target = isSponsored ? "_blank" : "_self";

    card.innerHTML = `
           <div class="card-image-container">
        <img src="${imageUrl}" alt="${title}" class="card-image" onerror="this.onerror=null; this.src='${fallbackImage}';">
        ${item.type === "video" ? '<span class="video-icon">▶</span>' : ""} 
        <div class="card-meta-top">
            <span class="card-source-logo"></span> <span class="card-time">${
              item.created ? formatTimeAgo(item.created) : ""
            }</span>
        </div>
    </div>
    <div class="card-content">
        <p class="card-title">${title}</p>
        <p class="card-source">${item.branding}</p>
        <div class="card-actions">
            <button class="action-button like-button" data-item-id="${
              item.id
            }">❤️</button>
            <button class="action-button share-button" 
                    data-title="${title}" 
                    data-url="${linkUrl}">Share</button>
        </div>
    </div>
`;

    widgetContent.appendChild(card);
  });

  container.innerHTML = "";
  container.appendChild(widgetContent);
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
