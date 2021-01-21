import { bootstrap } from "@lading/client";

// arg1: url for the lading server
// arg2: the manifest name configured on the server
bootstrap("https://lading-app.azurewebsites.net", "test-consume").then(() => {
  import("./bootstrap");
});
