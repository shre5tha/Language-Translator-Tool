
import Mic from 'mic';
import Vosk from 'vosk';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import request from 'request';



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Replace 'vosk-model-small-en-us-0.15' with the actual model folder name
const modelFolderName = 'vosk-model-small-en-us-0.15';
const modelPath = join(__dirname, modelFolderName);

console.log(`Model Path: ${modelPath}`);

// Set up Vosk model
const model = new Vosk.Model(modelPath);
const recognizer = new Vosk.Recognizer({ model, sampleRate: 16000 });

console.log('Recognizer initialized.');

// Configure microphone
const micInstance = Mic({
  rate: '9000',
  channels: '1',
  debug: false,
  exitOnSilence: 1,  // exit the recording after 6 seconds of silence
});

const micInputStream = micInstance.getAudioStream();

console.log('Microphone initialized.');


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
  

micInstance.start();

let isJarvisSpeaking = false;

micInputStream.on('data', async (data) => {
  if (!isJarvisSpeaking && recognizer.acceptWaveform(data)) {
    const result = recognizer.result();
    const transcription = result.text.trim(); 
    translateText('en', 'hi', transcription);// Trim to remove leading/trailing spaces
    console.log(transcription);
   
    
  }
});

console.log('Listening...');

