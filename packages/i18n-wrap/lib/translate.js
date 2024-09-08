const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const supportedLocales = [
  "af", // Afrikaans
  "sq", // Albanian
  "am", // Amharic
  "ar", // Arabic
  "hy", // Armenian
  "as", // Assamese
  "az", // Azerbaijani
  "bn", // Bangla
  "bs", // Bosnian
  "bg", // Bulgarian
  "yue", // Cantonese (Traditional)
  "ca", // Catalan
  "hr", // Croatian
  "cs", // Czech
  "da", // Danish
  "dv", // Divehi
  "nl", // Dutch
  "en", // English
  "et", // Estonian
  "fj", // Fijian
  "fil", // Filipino
  "fi", // Finnish
  "fr", // French
  "gl", // Galician
  "ka", // Georgian
  "de", // German
  "el", // Greek
  "gu", // Gujarati
  "ht", // Haitian Creole
  "he", // Hebrew
  "hi", // Hindi
  "hu", // Hungarian
  "is", // Icelandic
  "id", // Indonesian
  "ga", // Irish
  "it", // Italian
  "ja", // Japanese
  "kn", // Kannada
  "kk", // Kazakh
  "km", // Khmer
  "ko", // Korean
  "lv", // Latvian
  "lt", // Lithuanian
  "mk", // Macedonian
  "ms", // Malay
  "ml", // Malayalam
  "mt", // Maltese
  "mr", // Marathi
  "nb", // Norwegian
  "fa", // Persian
  "pl", // Polish
  "pt", // Portuguese (Portugal)
  "pa", // Punjabi
  "ro", // Romanian
  "ru", // Russian
  "sk", // Slovak
  "sl", // Slovenian
  "es", // Spanish
  "sw", // Swahili
  "sv", // Swedish
  "ta", // Tamil
  "te", // Telugu
  "th", // Thai
  "tr", // Turkish
  "uk", // Ukrainian
  "ur", // Urdu
  "vi", // Vietnamese
  "cy", // Welsh
  "zu", // Zulu
];

const endpoint =
  process.env.AZURE_ENDPOINT || "https://api.cognitive.microsofttranslator.com";
const subscriptionKey = process.env.AZURE_SUBSCRIPTION_KEY;
const location = process.env.AZURE_LOCATION || "global";

const MAX_ARRAY_ELEMENTS = 1000;
const MAX_REQUEST_SIZE = 50000; // 50,000 characters

const splitArray = (array, chunkSize) => {
  const results = [];
  while (array.length) {
    results.push(array.splice(0, chunkSize));
  }
  return results;
};

const splitTextArray = (texts, maxArraySize, maxRequestSize) => {
  const results = [];
  let currentBatch = [];
  let currentSize = 0;

  texts.forEach((text) => {
    const textSize = text.length;
    const effectiveTextSize = textSize * supportedLocales.length;
    if (
      currentBatch.length >= maxArraySize ||
      currentSize + effectiveTextSize > maxRequestSize
    ) {
      results.push(currentBatch);
      currentBatch = [];
      currentSize = 0;
    }
    currentBatch.push(text);
    currentSize += effectiveTextSize;
  });

  if (currentBatch.length) {
    results.push(currentBatch);
  }

  return results;
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const translateText = async (texts, targetLanguages) => {
  console.log(
    `Translating texts: "${texts.join(
      ", "
    )}" to languages: ${targetLanguages.join(", ")}`
  );

  if (!Array.isArray(targetLanguages) || targetLanguages.length === 0) {
    throw new Error(`Invalid target languages: ${targetLanguages}`);
  }

  const textBatches = splitTextArray(
    texts,
    MAX_ARRAY_ELEMENTS,
    MAX_REQUEST_SIZE
  );
  let allTranslations = [];

  for (const batch of textBatches) {
    try {
      const response = await fetch(`${endpoint}/translate`, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": subscriptionKey,
          "Ocp-Apim-Subscription-Region": location,
          "Content-Type": "application/json",
          "X-ClientTraceId": uuidv4().toString(),
        },
        body: JSON.stringify(batch.map((text) => ({ text }))),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Translation error:", errorData);
        throw new Error(`Translation API error: ${errorData.error.message}`);
      }

      const data = await response.json();
      console.log("Translation response:", data);
      data.forEach((item) => {
        allTranslations = allTranslations.concat(item.translations);
      });
    } catch (error) {
      console.error("Translation error:", error.message);
      throw new Error(`Translation API error: ${error.message}`);
    }
    await delay(1000);
  }

  return allTranslations;
};

const saveStringsToFile = async (strings, outputDir, languages, translate) => {
  let hasChanges = false;
  const existingTranslations = {};

  for (const lang of languages) {
    const filePath = path.join(outputDir, lang, "common.json");
    if (fs.existsSync(filePath)) {
      existingTranslations[lang] = JSON.parse(
        fs.readFileSync(filePath, "utf8")
      );
    } else {
      existingTranslations[lang] = {};
    }
  }

  const texts = Array.from(strings);
  let translations = [];

  if (translate) {
    translations = await translateText(texts, languages);

    translations.forEach((translation, index) => {
      const lang = translation.to;
      const text = texts[index];
      if (!existingTranslations[lang][text]) {
        existingTranslations[lang][text] = translation.text;
        hasChanges = true;
      }
    });
  } else {
    texts.forEach((text) => {
      languages.forEach((lang) => {
        if (!existingTranslations[lang][text]) {
          existingTranslations[lang][text] = text;
          hasChanges = true;
        }
      });
    });
  }

  if (hasChanges) {
    for (const lang of languages) {
      const sortedTranslations = Object.keys(existingTranslations[lang])
        .sort()
        .reduce((acc, key) => {
          acc[key] = existingTranslations[lang][key];
          return acc;
        }, {});

      const jsonContent = JSON.stringify(sortedTranslations, null, 2);
      const langDir = path.join(outputDir, lang);
      fs.mkdirSync(langDir, { recursive: true });
      fs.writeFileSync(path.join(langDir, "common.json"), jsonContent, "utf8");
      console.log(
        `Saved translation strings to ${path.join(langDir, "common.json")}`
      );
    }
  }

  return translations;
};

const azureError = () => {
  console.error(`
Error: Azure Translator subscription key not found.

Please follow these steps to create the credentials file:

1. Go to the Azure Portal: https://portal.azure.com/
2. Create a Translator resource.
3. Get the Subscription Key and Endpoint from the Azure Portal.
4. Set the AZURE_SUBSCRIPTION_KEY environment variable with your subscription key.
5. Set the AZURE_ENDPOINT environment variable with your endpoint (if different from the default).
6. Set the AZURE_LOCATION environment variable with your location (if different from the default).

Once you have completed these steps, rerun this script.
`);
};

module.exports = {
  translateText,
  saveStringsToFile,
  splitTextArray,
  splitArray,
  delay,
  supportedLocales,
  azureError,
};
