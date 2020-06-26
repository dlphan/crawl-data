const axios = require('axios')

const MAX_PAGE = 2
const LIMIT = 500

const crawl = async () => {
  const request = Array.from(
    { length: MAX_PAGE },
    (_, i) => axios({
      method: 'get',
      url: `https://www.huffpost.com/api/department/news/cards?page=${i + 1}&limit=${LIMIT}`,
    })
  )

  const result = axios
    .all(request)
    .then(axios.spread((...responses) => {
      const page = responses.map(({ data: { cards } }) => cards.map(card => card.headlines[0].text))
      console.log(page)
    }))
}

crawl()