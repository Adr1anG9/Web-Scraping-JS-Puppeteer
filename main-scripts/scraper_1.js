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

  // for vehicleTypes
  let vehicleTypes = ["TYPE1", "TYPE2"];

  // Add moment variables
  const startDay = moment().add(2, "days").format("YYYY-MM-DD"); // format may vary on each website individually
  const endDay = moment()
    .add(2 + days, "days")
    .format("DD");
  const startMonth = moment().add(2, "days").format("MM");
  const endMonth = moment()
    .add(2 + days, "days")
    .format("MM");
  const startYear = moment().add(2, "days").format("YYYY");
  const endYear = moment()
    .add(2 + days, "days")
    .format("YYYY");

  let results = [];

  // Loop over each vehicletype on each url
  for (let i = 0; i < vehicleTypes.length; i++) {
    let url = `URL_TEXT${vehicleTypes[i]}URL_TEXT${locationCode}${locationID}URL_TEXT${startDay}${endDay}${startMonth}${endMonth}URL_TEXT`; // grab url and construct with template literals using moment variables

    let vehicles = [];

    // Ajax response
    page.on("response", async (response) => {
      if (response.url().startsWith("Add string it starts with")) {
        try {
          // Grab the destructured JSON and push to vehicles arr
          const json = await response.json();
          vehicles.push(...json.data);
        } catch (error) {
          console.log("ERROR MESSAGE");
        }
      }
    });
    await page.goto(url, { waitUntil: networkidle2 });

    /****  If Lazy loading images,then add this AutoScroll ****/
    let scrollPos = 300;
    let scrollHeight = await page.evaluate(() => {
      return window.document.body.scrollHeight;
    });

    // Do condition
    do {
      scrollPos += 350;
      await page.evaluate((scrollPos) => {
        window.scrollTo(0, scrollPos);
      }, scrollPos); // pass scrollPos at the end!

      await page.waitForTimeout(2000);

      // Reset the scroll if page is longer than usual
      totalScrollHeight = await page.evaluate(() => {
        return window.document.body.scrollHeight;
      });
    } while (scrollPos < scrollHeight);

    // Scroll back to the top to avoid sticky banners
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });

    let data = [];
    // loop using forEach over vehicles arr
    vehicles.forEach((el) => {
      let name = el.car.name; // use JSON
      let transmBoolean = JSON.stringify(el.car.engine.automatic);

      if (transmBoolean == "true") {
        trasmission = "Automatic";
      } else {
        trasmission = "Manual";
      }
      let priceNotClean = el.data[0].priceInDestinationCurrency.amount;
      let price = JSON.stringify(priceNotClean.toFixed(2));
      let grouping = el.car.category;

      data.push({ name, trasmission, price, grouping });
    });

    // Take a screenshot
    const screen = await page.screenshot({
      timeout: 5000,
      type: "jpeg",
      fullPage: "true",
      encoding: "base64",
    });

    // Grab the HTML
    const html = await page.content();

    // Push to results arr
    results.push({ screen: screen, html: html, data: data });
  }
  return results;
})()
  .catch((err) => {
    console.error("ERROR", err);
  })
  .finally(() => {
    process.exit();
  });
