const { SitemapStream, streamToPromise } = require("sitemap");
const { createWriteStream } = require("fs");

// Define your base URL
const BASE_URL = "https://www.anddhengroup.com";

// Define your routes
const routes = [
  { url: "/", changefreq: "monthly", priority: 0.5 },
  { url: "/acs", changefreq: "monthly", priority: 1.0 },
];

// Generate the sitemap
(async () => {
  const sitemap = new SitemapStream({ hostname: BASE_URL });
  const writeStream = createWriteStream("./public/sitemap.xml");

  sitemap.pipe(writeStream);

  routes.forEach((route) => sitemap.write(route));
  sitemap.end();

  await streamToPromise(sitemap).then(() =>
    console.log("Sitemap successfully created!")
  );
})();
