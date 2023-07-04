// When Working with XPATH selectors

// In the data collection section
let [xpath] = await page.$x(
  "Add full xpath selector | Construct using XPATH sources"
);
data1 = await (await xpath.getProperty("textContent")).jsonValue();
