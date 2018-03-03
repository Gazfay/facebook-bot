const algoliasearch = require('algoliasearch');

let client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_APP_TOKEN);
let index = client.initIndex('stickers');

function getIndex(length) {
  return Math.floor(Math.random() * length);
}

function getLink(term) {
  return new Promise(function (r, rej) {
    index.search(term, function (err, content) {
      if (err) {
        return rej(err);
      }
      let index = getIndex(content.hits.length);

      if (content.hits[index]) {
        return r([content.hits[index].image_url])
      }
      return r([]);
    });
  })
}

module.exports = {
  getLink: getLink
}
