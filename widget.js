// 1. הגדרת משתנים
const WIDGET_CONTAINER_ID = "recommendations-widget";
// ה-API Endpoint המלא כפי שקיבלנו מהדרישות:
const BASE_API_URL =
  "https://api.taboola.com/1.0/json/taboola-templates/recommendations.get" +
  "?app.type=desktop&app.apikey=f9040ab1b9c802857aa783c469d0e0ff7e7366e4" +
  "&count=4&source.type=video&source.id=214321562187" +
  "&source.url=http://www.site.com/videos/214321562187.html";

// 2. פונקציה לבקשת נתונים מה-API
async function fetchRecommendations(countryCode = "US") {
  // בניית URL חדש הכולל את קוד המדינה הנוכחי
  const API_URL = `${BASE_API_URL}&user.country=${countryCode}`;
  console.log(`מתחיל בטעינת נתונים עבור GEO: ${countryCode}...`);

  try {
    const response = await fetch(API_URL);
    // ... (בדיקת response.ok)
    const data = await response.json();

    const recommendations = data?.list;

    // *** לוגיקת ה-GEO FALLBACK ***
    if (!recommendations || recommendations.length === 0) {
      // אם הרשימה ריקה, ננסה מיקום אחר (רק אם לא ניסינו כבר את הגיבוי)
      if (countryCode !== "GB") {
        console.log("רשימה ריקה, מנסה GEO חלופי: GB");
        // קריאה חוזרת עם קוד מדינה אחר
        return await fetchRecommendations("GB");
      }

      // אם ניסינו את הגיבוי ועדיין ריק, נציג הודעת שגיאה סופית
      console.log("נתונים לא נמצאו גם לאחר ניסיון חוזר.");
      const container = document.getElementById(WIDGET_CONTAINER_ID);
      container.innerHTML = "לא נמצאו המלצות לאחר שני ניסיונות.";
      return;
    }

    console.log(`נתוני API התקבלו בהצלחה עבור ${countryCode}:`, data);
    renderWidget(data);
  } catch (error) {
    // ... (טיפול בשגיאה)
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
  if (document.getElementById(WIDGET_CONTAINER_ID)) {
    fetchRecommendations("US"); // *** קריאה ראשונית עם 'US' ***
  }
}

// ...
// ייצוא הפונקציה
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    renderWidget,
    fetchRecommendations, // *** חובה לייצא את הפונקציה לבדיקה! ***
  };
}
