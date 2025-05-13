const request = require('request');


function translateText(sourceLang, targetLang, text) {
  const options = {
    method: 'POST',
    url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Accept-Encoding': 'application/gzip',
      'X-RapidAPI-Key': '61edba90famsha86f9cf13c233a7p10921ejsn6156531a5740',
      'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
    },
    form: {
      q: text,
      target: targetLang,
      source: sourceLang
    }
  };


  request(options, function (error, response, body) {
    if (error) throw new Error(error);


    const responseBody = JSON.parse(body);

  
    if (responseBody && responseBody.data && responseBody.data.translations && responseBody.data.translations.length > 0) {
      const translatedText = responseBody.data.translations[0].translatedText;
      console.log("Translated Text:", translatedText);
    } else {
      console.log("Error: Unable to get translated text.");
    }
  });
}

// Taking user input
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Enter the source language code (e.g., 'hi' for Hindi): ", function (sourceLang) {
  rl.question("Enter the target language code (e.g., 'en' for English): ", function (targetLang) {
    rl.question("Enter the text to be translated: ", function (text) {
      // Calling the function to translate text
      translateText(sourceLang, targetLang, text);
      rl.close();
    });
  });
});
