const axios = require("axios");
const cheerio = require("cheerio");
var pageLimit = 20;
let data;

const fetchHackerNewsData = async () => {
  var initialPage = 0;
  for (i = 0; i < pageLimit; i++) {
    var pageCount = initialPage++;
    const url = `https://news.ycombinator.com/news?p=${pageCount}`;
    await axios
      .get(url)
      .then((response) => {
        let getData = (html) => {
          data = [];
          const $ = cheerio.load(html);
          $("table.itemlist tr td:nth-child(3)").each((i, elem) => {
            data.push({
              title: $(elem).text(),
              link: $(elem).find("a.storylink").attr("href"),
              source: $(elem).find("span.sitebit.comhead").text(),
              pageCount: pageCount,
            });
          });
          console.log(data);
        };
        getData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    pageCount++;
    console.log("xxxxxxx=====================================xxxxxx", url);
  }
};

fetchHackerNewsData();
