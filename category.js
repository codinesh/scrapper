const fs = require('fs')
const utils = require('./utils')

const puppeteer = require('puppeteer')

const args = process.argv.slice(2)
console.log('Parameters:', args)

let url = 'https://www.cypherhunter.com/en/t/defi'
if (args && args.length > 0) {
  url = args[0]
}

;(async () => {
  console.log('Fetching categories from the url', url)
  await getCategories()
})()

async function getCategories() {
  const browser = await puppeteer.launch({ headless: false ?? 'new' })
  const page = await browser.newPage()

  await page.goto(url)

  let currentPage = 1
  let totalPages = 45
  let list = []

  try {
    while (true) {
      currentPage++
      let main = await page.$('main>div')
      let currentPageList = await main.$$eval('a', (a) =>
        a.map((x) => ({ title: x.title, path: x.href }))
      )

      if (!currentPageList || currentPageList.length == 0) {
        break
      }

      if (list.length >= 5) break
      list.push(...currentPageList)
      console.log('currentPage1', currentPage)

      await page.goto(url + '/page/' + currentPage)
      console.log('currentPage2', currentPage)
    }
  } catch (ex) {
    console.error(ex)
  } finally {
    console.log(list.length)
    utils.saveItems('defi', list)
  }
}
