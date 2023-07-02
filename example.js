const fs = require('fs')

const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch({ headless: false ?? 'new' })
  const page = await browser.newPage()
  await page.goto('https://www.cypherhunter.com/en/t/defi/')

  let main = await page.$('main>div')
  let currentPage = 0
  let list = []

  try {
    while (true) {
      currentPage++
      let currentPageList = await main.$$eval('a', (a) =>
        a.map((x) => ({ title: x.title, path: x.href }))
      )

      // if (list.length == 5) break

      list.push(...currentPageList)
      let nextButton = await page.$('a[title=next]')
      console.log('Processed page', currentPage)

      if (nextButton) {
        console.log('Found next page')
        await nextButton.click()
      } else {
        console.log('Reached end at page', currentPage)
        break
      }
    }
  } catch (ex) {
    //
  } finally {
    console.log(list.length)
    saveItems('defi', list)
  }

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

async function getDetails(category, url) {
  let data = {}
  let detailsPage = await browser.newPage()
  let resp = await detailsPage.goto(x.href)
  let logoSection = await detailsPage.$('#project-logo')
  let description = logoSection.$('div>div')

  console.log(data)
  data = { title: x.title, path: x.href, description }
  return data
}
