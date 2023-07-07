const fs = require('fs')

const puppeteer = require('puppeteer')

const args = process.argv.slice(2)
console.log('Parameters:', args)

let url = 'https://www.cypherhunter.com/en/t/defi'
if (args && args.length > 0) {
  url = args[0]
}

;(async () => {
  const browser = await puppeteer.launch({ headless: false ?? 'new' })
  const page = await browser.newPage()

  let details = await getDetails(
    browser,
    'defi',
    'https://www.cypherhunter.com/en/p/oxalus/'
  )
  console.log(details)
  return
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
    saveItems('defi', list)
  }

  let listDetails = []

  list.forEach(async (item) => {
    let details = await getDetails(browser, 'defi', item.path)
    listDetails.push(details)
  })

  // Wait till async foreach is completed.
  while (listDetails.length == list.length) {}

  saveItems('defidetails', listDetails)
  //   await browser.close()
})()

function saveItems(category, list) {
  const jsonString = JSON.stringify(list, null, 2) // The third argument (2) adds indentation for readability

  // File path where you want to save the JSON data
  const filePath = category + '.json'

  // Write the JSON string to the file
  fs.writeFile(filePath, jsonString, 'utf8', (err) => {
    if (err) {
      console.error('Error saving JSON file:', err)
    } else {
      console.log('JSON file saved successfully.')
    }
  })
}

async function getDetails(browser, category, url) {
  let detailsPage = await browser.newPage()
  await detailsPage.goto(url)
  let title = await detailsPage.$eval('#project-logo>div>h1', (a) => {
    return a.value
  })

  let description = await detailsPage.$eval('#project-logo>div>div', (a) => {
    return a.value
  })

  let website = await detailsPage.$$eval('#project-logo ~ div', (a) => {
    return a
  })

  return { title, description, website }
}
