// When working with POST data

const { executablePath } = require("puppeteer");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const moment = require("moment");
puppeteer.use(StealthPlugin());

let locationID = "INSERT LOCATION ID"; // hard code or insert from db
let locationCode = "INSERT LOCATION CODE"; // hard code or insert from db
let days = 7;

(async () => {
  // Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: false,
    devtools: false,
    args: ["--window-size=1600,900", "--proxy-server=PROXY-SV:PORT"],
    timeout: 30000,
    executablePath: executablePath(),
  });

  // Initiate page variable
  const [page] = await browser.pages();

  // Add Proxy Authentication
  await page.authenticate({
    username: "USER-NAME",
    password: "PASSWORD",
  });

  // Grab cookies in JSON using EditThisCookie and add here
  const cookies = [];

  await page.setCookie(...cookies);

  // Add moment variables
  const startDay = moment().add(2, "days").format("YYYY-MM-DD"); // format may vary on each website individually
  const endDay = moment()
    .add(2 + days, "days")
    .format("DD");

  // Add empty results arr
  let results = [];

  // for vehicleTypes
  let vehicleTypes = ["CAR", "TRUCK"];

  for (let i = 0; i < vehicleTypes.length; i++) {
    let url = `URL_TEXT${vehicleTypes[i]}URL_TEXT${startDay}${endDay}URL_TEXT${locationCode}${locationID}`;
    await page.goto(url, { waitUntil: networkidle2 });

    // If neeed, grab token from main page
    let CSRFToken = await page.$eval("selector", (el) =>
      el.getAttribute("value")
    );
    // If neeed, grab this token from main page
    let redirect = await page.$eval("selector", (el) =>
      el.getAttribute("value")
    );

    /****  Request Interception ****/

    await page.setRequestInterception(true);

    page.once("request", async (request) => {
      let postData = `Construct with Template Literals${CSRFToken}POST_DATA${redirect}`; // Get the POST data parsed from DevTools

      await request.continue({
        method: "POST",
        postData: postData,
        headers: {
          ...request.headers(),
          "Content-Type": "application/x-www/form-urlencoded",
        },
      });

      await page.setRequestInterception(false);
    });

    const response = await page.goto(url); // go to the page again after constructing postData above

    // Remove any elements which obstruct the screenshot
    // This injects CSS on the page
    // Can insert anything this is just an example
    await page.addStyleTag({ content: "selector {display: none}" });

    // Add Autoscroll code if needed

    // Take screenshot
    const screen = await page.screenshot({
      timeout: 5000,
      type: "jpeg",
      fullPage: "true",
      encoding: "base64",
    });

    // Grab the HTML
    const html = await page.content();

    // Define Data collection variable
    let sets = await page.$$("selector"); // parent selector for multiple sets of data

    let data = [];
    for (const set of sets) {
      let name = await set.$eval("selector1", (text) => text.textContent);
      let version = await set.$eval("selector2", (text) => text.textContent);
      let group = await set.$eval("selector2", (text) => text.textContent);
      // Add any logic if needed
      data.push({ name, version, group });
    }

    results.push({ screen, html, data });
  }
})()
  .catch((err) => {
    console.error("ERROR", err);
  })
  .finally(() => {
    process.exit();
  });
