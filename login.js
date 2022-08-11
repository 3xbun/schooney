const puppeteer = require("puppeteer");

const fs = require("fs");
const cookiesFilePath = "./cookies.json";

(async () => {
  const credentials = JSON.parse(fs.readFileSync("./credentials.json"));

  // Login Credentials
  const username = credentials.username;
  const password = credentials.password;

  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  // Login
  await page.goto("https://mdschooney.ddns.net/login");
  await page.type("input[name=username]", username);
  await page.type("input[name=password]", password);
  await page.keyboard.press("Enter");
  await page.waitForNavigation();

  // Save Cookies
  const cookiesFilePath = "cookies.json";
  // Save Session Cookies
  const cookiesObject = await page.cookies();
  // Write cookies to temp file to be used in other profile pages
  fs.writeFile(cookiesFilePath, JSON.stringify(cookiesObject), function (err) {
    if (err) {
      console.log("The file could not be written.", err);
    }
    console.log("Session has been successfully saved");
  });

  await page.waitForNavigation();
  await browser.close();
})();
