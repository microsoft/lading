import { bootstrap } from "@lading/client";

import("./bootstrap");

// arg1: url for the lading server
// arg2: the manifest name configured on the server
bootstrap("https://lading-app.azurewebsites.net", "fluent-website").then(() => {
  import("./bootstrap");
});
