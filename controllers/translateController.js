const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const deepl = require('deepl-node');

class translateController {

    // Azure translation engine (Primary)
    translateTheText(req, res) {
        //Azure Config
        let azureKey = process.env.AZURE_KEY
        let azureEndpoint = "https://api.cognitive.microsofttranslator.com"
        let azureLocation = "southeastasia"
        axios({
            baseURL: azureEndpoint,
            url: '/translate',
            method: 'post',
            headers: {
                'Ocp-Apim-Subscription-Key': azureKey,
                'Ocp-Apim-Subscription-Region': azureLocation,
                'Content-type': 'application/json',
                'X-ClientTraceId': uuidv4().toString()
            },
            params: {
                'api-version': '3.0',
                'from': 'en',
                'to': 'vi'
            },
            data: [{
                'text': req.body.text
            }],
            responseType: 'json'
        }).then(azureRes => {
            if (azureRes) {
                res.status(200);
                res.json({
                    translatedText: azureRes.data[0].translations[0].text
                });
            }
        }).catch(err => {
            console.log(err)
            res.status(500);
            res.json({
                message: "Internal Server Error"
            });
        });
    }

    // DeepL translation engine (Backup)
    translateTheTextByDeepL(req, res) {
        const deeplAuthKey = process.env.DEEPL_KEY;
        const translator = new deepl.Translator(deeplAuthKey);
        const text = req.body.text;
        translator.translate(text, "en").then((translatedText) => {
            if (translatedText) {
                res.status(200);
                res.json({
                    translatedText: translatedText
                });
            }
        }).catch((err) => {
            console.log(err);
            res.status(500);
            res.json({
                message: "Internal Server Error"
            });
        });
    }

}

module.exports = new translateController();