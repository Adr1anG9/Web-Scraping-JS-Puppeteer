const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));
const fse = require("fs-extra");
puppeteer.use(StealthPlugin());

const session_variable = Math.floor();

(async () => {
  // Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: false,
    devtools: false,
    args: ["--window-size=1600,900"],
    timeout: 30000,
  });

  // Initiate page variable
  const [page] = await browser.pages();

  // Proxy authentication
  await page.authenticate({
    username,
    password,
  });

  // URL
  await page.goto(url, { waitUntil: "networkidle2" });
  const url = "some url";

  // Results array
  let results = [];

  let stations = await page.$$("selector");

  // Loop over each station
  for (const station of stations) {
    let name = await station.$eval("selector", (text) => text.textContent);
    // Clean the data if needed
    let station_codeNotClean = await station.$eval("selector", (el) => el.href);
    let station_code = station_codeNotClean.toLowerCase().split("-");

    // Push to the results array
    results.push({ name, station_code });
  }

  // CSV Ready variable with a big string
  const CSVReady =
    "station_code, name\n" +
    results
      .map((l) => {
        return `${l.station_code}, ${l.name}`;
      })
      .join("\n");

  // Create a file location
  let file = "./CSVs/results.csv";

  // Use the FS library
  fse.createFile(file);

  // Output the data to the CSV file
  fse.outputFile(file, CSVReady, function () {
    fse.readFile(file, "utf8", function (err, data) {
      data = CSVReady;
      console.log(data);
    });
  });

  console.log(results);

  // Close the browser
  await browser.close();
})()
  .catch((err) => {
    console.error("ERROR", err);
  })
  .finally(() => {
    process.exit();
  });
