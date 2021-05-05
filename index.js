const axios = require("axios");
const cheerio = require("cheerio");
//firebase 
const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})
const db = admin.firestore();
var pageLimit = 24;
let data;
const fetchHackerNewsData = async () => {
  const doc = {'data': []}
  for (i = 0; i < pageLimit; i++) {
    const currentPage = {'pageData': []};
    const url = `https://news.ycombinator.com/news?p=${i+1}`;
    await axios
      .get(url)
      .then((response) => {
        let getData = (html) => {
          data = [];
          const $ = cheerio.load(html);
          const timeStamps = $(".age a")
          $("table.itemlist tr td:nth-child(3)").each((i, elem) => {
            currentPage['pageData'].push({
                title: $(elem).text(),
                link: $(elem).find("a.storylink").attr("href"),
                source: $(elem).find("span.sitebit.comhead").text(),
                postedAt: $(timeStamps[i]).text(),
            })
          });
          doc.data.push(currentPage);
        };
        console.log("+++++++++++Added to firebase++++++++++++")
        getData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  db.collection("hacker-news").doc("news-data").set({'data': admin.firestore.FieldValue.arrayUnion.apply(this, doc.data )}, {merge:true});
};
fetchHackerNewsData();