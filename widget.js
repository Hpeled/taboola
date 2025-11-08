// 1. הגדרת משתנים
const WIDGET_CONTAINER_ID = "recommendations-widget";
// ה-API Endpoint המלא כפי שקיבלנו מהדרישות:
const API_URL =
  "https://api.taboola.com/1.0/json/taboola-templates/recommendations.get?app.type=desktop&app.apikey=f9040ab1b9c802857aa783c469d0e0ff7e7366e4&count=4&source.type=video&source.id=214321562187&source.url=http://www.site.com/videos/214321562187.html";

// 2. פונקציה לבקשת נתונים מה-API
async function fetchRecommendations() {
  console.log("מתחיל בטעינת נתונים מה-API...");

  try {
    // ביצוע הבקשה באמצעות fetch (Promise based)
    const response = await fetch(API_URL);

    // בדיקה שהבקשה הצליחה (HTTP status 200)
    if (!response.ok) {
      throw new Error(`שגיאת HTTP! Status: ${response.status}`);
    }

    // המרת התגובה לפורמט JSON
    const data = await response.json();

    console.log("נתוני API התקבלו בהצלחה:", data);

    // **השלב הבא שלנו:** נתחיל לעבד ולהציג את הנתונים
    renderWidget(data);
  } catch (error) {
    console.error("שגיאה בטעינת המלצות:", error);
    // הצגת הודעת שגיאה למשתמש
    const container = document.getElementById(WIDGET_CONTAINER_ID);
    container.innerHTML = "שגיאה בטעינת הנתונים. נסה/י שוב מאוחר יותר.";
  }
}

// 3. פונקציה שכרגע רק מציגה שהנתונים התקבלו
// 3. פונקציה לעיבוד והצגת הנתונים בתוך הווידג'ט
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

  // ניצור DIV שיכיל את כל כרטיסיות ההמלצה
  const widgetContent = document.createElement("div");
  widgetContent.className = "recommendations-grid"; // נשתמש בזה ל-CSS רספונסיבי

  // לולאה על כל המלצה
  recommendations.forEach((item, index) => {
    // המידע הדרוש לנו
    const linkUrl = item.url;
    const imageUrl = item.thumbnail[0]?.url;
    const title = item.name;
    const description = item.description; // יכול להיות שזה מה שנרצה להציג כטקסט הראשי
    const fallbackImage = PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];

    // נניח שכרגע כל מה שחוזר מה-API הזה הוא 'Sponsored', אבל נהיה מוכנים ל-Organic
    const isSponsored = item.origin === "sponsored";

    // יצירת רכיב הכרטיס
    const card = document.createElement("a");
    card.href = linkUrl;
    card.className = "recommendation-card";

    // קביעת יעד הקישור בהתאם לסוג ההמלצה (Sponsored = לשונית חדשה)
    card.target = isSponsored ? "_blank" : "_self";

    // בניית ה-HTML הפנימי של הכרטיס
    card.innerHTML = `
            <div class="card-image-container">
                <img src="${imageUrl}" alt="${title}" class="card-image" onerror="this.onerror=null; this.src='${fallbackImage}';">
            </div>
            <div class="card-text">
                <p class="card-description">${description}</p>
                ${
                  isSponsored
                    ? `<p class="card-source">${item.branding}</p>`
                    : ""
                }
                <span class="card-type">${
                  isSponsored ? "מודעה" : "תוכן אורגני"
                }</span>
            </div>
        `;

    // הוספת הכרטיס לרשת ההמלצות
    widgetContent.appendChild(card);
  });

  // ניקוי "טוען המלצות..." והכנסת התוכן החדש
  container.innerHTML = "";
  container.appendChild(widgetContent);
}

// 4. קריאה לפונקציה כדי להתחיל את התהליך (נשאיר את הקריאה הזו למטה)
fetchRecommendations();

if (typeof window !== "undefined" && typeof document !== "undefined") {
  // אם הקונטיינר קיים ב-HTML, התחל בטעינה
  if (document.getElementById(WIDGET_CONTAINER_ID)) {
    fetchRecommendations();
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    renderWidget,
  };
}
