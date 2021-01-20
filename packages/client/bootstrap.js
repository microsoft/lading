import querystring from "querystring";

export function bootstrap(server, app) {
  const search = querystring.parse(location.search.slice(1));

  let manifestUrl = `${server}/m/${app}`;
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
      if (override) {
        manifest = { ...manifest, ...override };
      }

      window.__LADING_MANIFEST__ = manifest;
    });
}
