const axios = require('axios')
const fs = require('fs')
const jsdom = require("jsdom")
const { JSDOM } = jsdom

const start = 1592715707060
const root = `https://www.theonion.com/latest?startTime=`
let next = 172800000

const request = (next) => {
	return axios({
		method: 'get',
		url: nextLink
	})
}

const crawl = async () => {
	let headlines = []
	let links = []

	const articleLinks = Array.from(
		{ length: 150 },
		(_, i) => {
			const res = axios({
				method: 'get',
				url: `${root}${start - next*i}`
			})

			return res
		}
	)

	await axios
		.all(articleLinks)
		.then(axios.spread((...rs) => {
			const list = rs.map(({ data }) => {
				const dom = new JSDOM(data)
	      const headlineList = dom.window.document.querySelectorAll('article h2')
	      const linkList = dom.window.document.querySelectorAll('article .aoiLP a')

	      headlineList.forEach(item => {
	      	headlines.push(item.textContent)
	      })

	      linkList.forEach(item => {
	      	links.push(item.href)
	      })
			})
		}))

	headlines = Array.from(new Set(headlines))
	links = Array.from(new Set(links))

	const result = headlines.map((item, i) => ({
		is_sarcastic: 1,
		headline: item,
		article_link: links[i]
	}))

	console.log(result)
	fs.writeFileSync('./data/onion.json', JSON.stringify(result), 'utf-8')
}

crawl()