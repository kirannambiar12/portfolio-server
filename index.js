const axios = require('axios');
const cheerio = require('cheerio');

const url = "https://app.daily.dev";

let data;

axios.get(url)
.then(response => {
    let getData = html => {
        data = [];
        const $ = cheerio.load(html);
        x = $('main.withNavBar article.relative');
        console.log(x.html())
        $('.w-full').each((i, elem) => {
            console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++", elem)
          data.push({
            title : $(elem).text(),
            link : $(elem).find('.w-full').attr('href'),
          });
        });
        console.log("========================================================================================",data);
      }
      
      getData(response.data)
})
.catch(error => {
    console.log(error);
})


