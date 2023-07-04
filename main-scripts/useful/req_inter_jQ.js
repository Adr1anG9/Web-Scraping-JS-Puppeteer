//  Use this for changing source when intercepting jQeury

await page.setRequestInterception(true);

page.once("request", async (request) => {
  if (request.url() == "INSERT ORIGINAL jQuery URL") {
    request.continue({ url: "NEW jQuery URL Replacement" });
  } else {
    request.continue();
  }

  // await page.setRequestInterception(false); // sometimes not needed
});
