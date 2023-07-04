const location_blue1_json = require("./location_blue1_json.json"); // grab using DevTools or use RequestIntercept
const fse = require("fs-extra");

console.log(Object.keys(location_blue1_json));

let dataKeys = Object.keys(location_blue1_json);

let results = [];

for (let i = 0; i < dataKeys.length; i++) {
  let name = location_blue1_json[i].name;
  let station_code = location_blue1_json[i].code;
  let latitude = location_blue1_json[i].gs_location_latitude;
  let longitude = location_blue1_json[i].gs_location_longitude;
  let country = location_blue1_json[i].country;

  results.push({ name, station_code, country, latitude, longitude });
}

// CSV Ready variable with a big string
const CSVReady =
  "station_code, name, country, latitude, longitude\n" +
  results
    .map((l) => {
      return `${l.station_code}, ${l.name}, ${l.country}, ${l.latitude}, ${l.longitude}`;
    })
    .join("\n");

// Create a file location
let file = "./CSVs/location_blue1.csv";

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
