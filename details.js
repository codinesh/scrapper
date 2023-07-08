const puppeteer = require('puppeteer')
const utils = require('./utils')

const args = process.argv.slice(2)
console.log('Parameters:', args)

let category = ''
if (args && args.length > 0) {
  category = args[0]
}

;(async () => {
  console.log('cat', category)
  if (category) await getAllDetails()
})()

async function getAllDetails() {
  let listDetails = []
  let list = await utils.loadItems(category + '.json')
  const browser = await puppeteer.launch({ headless: false ?? 'new' })
  await Promise.all(
    list.map(async (item) => {
      try {
        let details = await getDetails(browser, 'defi', item.path)
        listDetails.push(details)
      } catch (ex) {
        console.error(ex, item.path)
      } finally {
      }
    })
  )

  utils.saveItems('defidetails', listDetails)
}

async function getDetails(browser, category, url) {
  let page = await browser.newPage()
  await page.goto(url)
  const title = await page.$eval('nav h2', (element) =>
    element.textContent.trim()
  )

  // Extract the description
  const description = await page.$eval('nav div.flex:nth-child(2)', (element) =>
    element.textContent.trim()
  )

  // Extract the social media links
  const socialMediaLinks = await page.$$eval('nav a[href^="http"]', (links) => {
    return links.map((link) => link.getAttribute('href'))
  })

  let website = await page.$eval('nav div.flex:nth-child(2) a', (link) =>
    link.getAttribute('href')
  )

  website = utils.sanitise(website)

  return { title, description, socialMediaLinks, website }
}
