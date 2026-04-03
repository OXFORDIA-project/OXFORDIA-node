const fs = require("fs");
const path = require("path");

const indexHtmlPath = path.join(__dirname, "../dist-server/index.html");

fs.readFile(indexHtmlPath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading index.html:", err);
    return;
  }

  let modifiedData = data.replace(
    /(href|src)=["'](\/(?!\.ui-static\/)\S*?)["']/g,
    (match, attr, urlPath) => `${attr}="/.ui-static${urlPath}"`,
  );

  modifiedData = modifiedData.replace(
    /globalThis\.__EXPO_ROUTER_HYDRATE__=true;/,
    "globalThis.__EXPO_ROUTER_HYDRATE__=false;",
  );

  fs.writeFile(indexHtmlPath, modifiedData, "utf8", (writeError) => {
    if (writeError) {
      console.error("Error writing index.html:", writeError);
      return;
    }
    console.log("Adjusted dist-server/index.html for CSS hosting.");
  });
});
