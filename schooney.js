const puppeteer = require("puppeteer");

const fs = require("fs");
const cookiesFilePath = "./cookies.json";

const main = async (page) => {
  await page.goto("https://mdschooney.ddns.net/message/create");

  const std_id = await page.evaluate('prompt("Enter Student ID")');
  const amt = await page.evaluate('prompt("Enter amount")');

  if (std_id === "") {
    await browser.close();
  }

  const message = `โรงเรียนได้รับเงิน เพื่อเข้าร่วมโครงการเซอร์เวียม จำนวน ${amt} บาท  จากท่าน เรียบร้อยแล้ว ขอขอบคุณ`;

  const btn = await page.$$("#__BVID__6");
  await page.click("#__BVID__6");
  await page.waitForSelector("#__BVID__22");
  await page.select("#__BVID__22", "PARENT");
  await page.select("#__BVID__24", "BY_PERSON");
  await page.type("input[type='search']", std_id);
  await page.select("#__BVID__8", "IMMEDIATE");

  await page.type("#__BVID__11", "เงินเซอร์เวียม");
  await page.type(".editor-section", message);

  await page.focus("input[type='search']");

  await page.waitForRequest("https://mdschooney.ddns.net/message");
  await main(page);
};

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  //   Restore Cookies
  const previousSession = fs.existsSync(cookiesFilePath);
  if (previousSession) {
    // If file exist load the cookies
    const cookiesString = fs.readFileSync(cookiesFilePath);
    const parsedCookies = JSON.parse(cookiesString);
    if (parsedCookies.length !== 0) {
      for (let cookie of parsedCookies) {
        await page.setCookie(cookie);
      }
      console.log("Session has been loaded in the browser");
    }
  }

  main(page);
})();
