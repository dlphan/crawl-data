const axios = require("axios");
const fs = require('fs')

const MAX_PAGE = 2;
const LIMIT = 500;

const crawl = async () => {
  const request = Array.from({ length: MAX_PAGE }, (_, i) =>
    axios({
      method: "get",
      url: `https://www.huffpost.com/api/department/news/cards?page=${
        i + 1
      }&limit=${LIMIT}`,
    })
  );

  const result = await axios.all(request).then(
    axios.spread((...responses) => {
      const page = responses.map(({ data: { cards } }) =>
        cards.map((card) => 
          ({
            is_sarcastic: 0,
            headline: card.headlines[0].text,
            article_link: card.headlines[0].url
          }))
      );
      return [].concat(...page);
    })
  );

  fs.writeFileSync('./data/huffpost.json', JSON.stringify(result), 'utf-8')
};

crawl();
