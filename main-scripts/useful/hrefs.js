//  Use this if needed to loop over each href
let href_urls = await page.evaluate(() => {
  const urlArr = [];
  document.querySelectorAll("selector").forEach((url) => {
    url.push(url.href);
  });
  return urlArr;
});

let first_urls = href_urls;

let data_collection = await page.$$("selector");
