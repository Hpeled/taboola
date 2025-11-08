/**
 * @jest-environment jsdom
 */

// ייבוא הפונקציה אותה אנו בודקים
const { renderWidget } = require("../widget");

// נתוני דמו מלאים הכוללים שני סוגי המלצות
const mockApiData = {
  list: [
    // 1. המלצה ממומנת (Sponsored)
    {
      url: "http://sponsored.link/1",
      thumbnail: [{ url: "http://image.com/sponsored1.jpg" }],
      name: "Sponsored Article",
      description: "This is a sponsored article description.",
      origin: "sponsored",
      branding: "Sponsored By Acme Inc.",
    },
    // 2. המלצה אורגנית (Organic) - מדומים עבור הבדיקה
    {
      url: "http://organic.link/2",
      thumbnail: [{ url: "http://image.com/organic2.jpg" }],
      name: "Organic Content",
      description: "This is an organic article description.",
      origin: "organic", // Origin 'organic'
      branding: "My Site",
    },
    // 3. המלצה עם תמונה חסרה (לבדיקת מנגנון הגיבוי)
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

// הגדרת בדיקה גדולה (Test Suite)
describe("renderWidget", () => {
  // שלב הכנה: יצירת סביבת DOM מדומה לפני כל בדיקה
  beforeEach(() => {
    // מחיקת תוכן ה-DOM הקודם ויצירת ה-DIV הנדרש
    document.body.innerHTML = '<div id="recommendations-widget"></div>';

    // הגדרת מערך הגיבוי הדרוש בתוך ה-DOM (כפי שהוגדר בקוד)
    global.PLACEHOLDER_IMAGES = [
      "img/placeholder-1.jpg",
      "img/placeholder-2.jpg",
      "img/placeholder-3.jpg",
      "img/placeholder-4.jpg",
    ];
  });

  // ----------------------------------------------------
  // בדיקה 1: הצגת כל ההמלצות והמבנה הבסיסי
  // ----------------------------------------------------
  test("Should render all recommendations with the correct structure", () => {
    renderWidget(mockApiData);

    const container = document.getElementById("recommendations-widget");
    const cards = container.querySelectorAll(".recommendation-card");

    // ודא שהצגנו 3 כרטיסים (כמספר ההמלצות בדמו)
    expect(cards.length).toBe(3);
    // ודא שמבנה הרשת נוצר
    expect(container.querySelector(".recommendations-grid")).not.toBeNull();
  });

  // ----------------------------------------------------
  // בדיקה 2: טיפול בהמלצות ממומנות (Sponsored)
  // ----------------------------------------------------
  test("Sponsored card should open in a new tab (_blank) and show branding", () => {
    renderWidget(mockApiData);

    // בחירת הכרטיס הממומן (הראשון)
    const sponsoredCard = document.querySelectorAll(".recommendation-card")[0];

    // ודא שהיעד הוא לשונית חדשה
    expect(sponsoredCard.target).toBe("_blank");
    // ודא שהכיתוב "מודעה" מופיע
    expect(sponsoredCard.querySelector(".card-type").textContent).toBe("מודעה");
    // ודא ששם המפרסם מופיע
    expect(sponsoredCard.querySelector(".card-source").textContent).toBe(
      "Sponsored By Acme Inc."
    );
  });

  // ----------------------------------------------------
  // בדיקה 3: טיפול בהמלצות אורגניות (Organic)
  // ----------------------------------------------------
  test("Organic card should open in the same tab (_self) and hide branding", () => {
    renderWidget(mockApiData);

    // בחירת הכרטיס האורגני (השני)
    const organicCard = document.querySelectorAll(".recommendation-card")[1];

    // ודא שהיעד הוא אותה לשונית (ברירת מחדל או _self)
    expect(organicCard.target).toBe("_self");
    // ודא שהכיתוב הוא "תוכן אורגני" (אם כי ה-API שלנו לא מחזיר זאת כרגע, נבדוק את ההיגיון)
    expect(organicCard.querySelector(".card-type").textContent).toBe(
      "תוכן אורגני"
    );
    // ודא שרכיב ה-branding לא קיים
    expect(organicCard.querySelector(".card-source")).toBeNull();
  });

  // ----------------------------------------------------
  // בדיקה 4: מנגנון הגיבוי לתמונות (Fallback)
  // ----------------------------------------------------
  test("Card with missing image should use the correct fallback image in onerror", () => {
    renderWidget(mockApiData);

    // בחירת הכרטיס השלישי (עם התמונה החסרה)
    const missingImageCard = document.querySelectorAll(
      ".recommendation-card"
    )[2];
    const imageElement = missingImageCard.querySelector("img");

    // ודא ש-src המקורי ריק (או מכיל undefined), כיוון ש-item.thumbnail[0] לא קיים
    // אנחנו בודקים את ה-onerror, המשתמש בתמונת הגיבוי השלישית (אינדקס 2)
    const expectedFallback = global.PLACEHOLDER_IMAGES[2];

    // בדיקת ה-onerror string
    expect(imageElement.getAttribute("onerror")).toContain(
      `this.src='${expectedFallback}'`
    );
  });
});
