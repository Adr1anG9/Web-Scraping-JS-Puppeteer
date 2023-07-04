const { executablePath } = require("puppeteer");
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
    executablePath: executablePath(),
  });

  // Initiate page variable
  const [page] = await browser.pages();

  // Proxy authentication
  // await page.authenticate({
  //   username,
  //   password,
  // });

  // URL
  const url = "INSERT TARGET URL";
  await page.goto(url, { waitUntil: "networkidle2" });

  // Results array
  let results = [];

  // Data collection selector
  let stations = await page.$$(".region-list .cf li");

  // Loop over each of the li's
  for (const station of stations) {
    // Clean the data if needed
    let nameDirty = await station.$eval("a", (text) => text.textContent);
    let name = nameDirty.replace(/^\s+|\s+$/gm, "").toString();
    // console.log(name);

    let station_codeNotClean = await station.$eval("a", (el) => el.href);
    let station_code = station_codeNotClean
      .toString()
      .split("-")
      .pop()
      .replaceAll(".html", "");

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

  // console.log(CSVReady);
  // return;
  // Create a file location
  let file = "./CSVs/location_green1_au_results.csv";

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
