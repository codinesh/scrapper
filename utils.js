const fs = require('fs')

const saveItems = (category, list) => {
  const jsonString = JSON.stringify(list, null, 2) // The third argument (2) adds indentation for readability

  // File path where you want to save the JSON data
  const filePath = './data/' + category + '.json'

  // Write the JSON string to the file
  fs.writeFile(filePath, jsonString, 'utf8', (err) => {
    if (err) {
      console.error('Error saving JSON file:', err)
    } else {
      console.log('JSON file saved successfully.')
    }
  })
}

const loadItems = (fileName) => {
  return new Promise((resolve, reject) => {
    fs.readFile('./data/' + fileName, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err)
        reject(err)
      }

      try {
        const jsonArray = JSON.parse(data)
        return resolve(jsonArray)
      } catch (err) {
        console.error('Error parsing JSON:', err)
        return reject(err)
      }
    })
  })
}

const sanitise = (urlToSanitise) => {
  const url = new URL(urlToSanitise)
  url.searchParams.delete('utm_source')
  return url
}

module.exports = {
  sanitise,
  loadItems,
  saveItems,
}
