import querystring from "querystring";

/**
 * bootstraps the lading federated bundle location
 * @param {string} server the lading server url (e.g. https://lading-app.azurewebsites.net)
 * @param {string} app the application registered (the name of the manifest)
 */
export function bootstrap(server, app) {
  const search = querystring.parse(location.search.slice(1));

  let manifestUrl = `${server}/rest/manifest/${app}`;
  let override = {};

  if (search.ring) {
    manifestUrl = `${manifestUrl}/${search.ring}`;
  }

  if (search.override) {
    try {
      override = JSON.parse(search.override);
    } catch (e) {
      console.warn("invalid override");
    }
  }

  return fetch(manifestUrl)
    .then((res) => res.json())
    .then((manifest) => {
      if (!manifest.packages) {
        throw new Error(
          `Fetched manifest is not of the correct format. ${manifest}`
        );
      }

      let formattedManifest = {};

      for (const packageInfo of manifest.packages) {
        formattedManifest[packageInfo["globalVarName"]] = packageInfo.url;
      }

      if (override) {
        formattedManifest = { ...formattedManifest, ...override };
      }

      window.__LADING_MANIFEST__ = formattedManifest;
    });
}
