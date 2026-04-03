const fs = require("fs");
const path = require("path");

const indexHtmlPath = path.join(__dirname, "../dist-standalone/index.html");

fs.readFile(indexHtmlPath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading index.html:", err);
    return;
  }

  const modifiedData = data.replace(
    /globalThis\.__EXPO_ROUTER_HYDRATE__=true;/,
    "globalThis.__EXPO_ROUTER_HYDRATE__=false;",
  );

  fs.writeFile(indexHtmlPath, modifiedData, "utf8", (writeError) => {
    if (writeError) {
      console.error("Error writing index.html:", writeError);
      return;
    }
    console.log("Adjusted dist-standalone/index.html.");
  });
});
