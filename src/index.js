const CODENATION_URL = "https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=";
const MY_TOKEN = "0fb02427366245d2c5b6ac06e2bb89b475d81a2f";
const request = require('request');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const alphabet = ['a', 'b', 'c', 'd', 'e', 'f',
    'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
    'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

async function main() {
    try {
        const buildJson = await generateJson();
        const readedJson = await readFile();

        const json = JSON.parse(readedJson);

        const decodedPhrase = decodePhrase(json.cifrado, json.numero_casas);
        json.decifrado = decodedPhrase;
        json.resumo_criptografico = encryptSha(decodedPhrase);
        const writedJson = await writeFile(JSON.stringify(json));
        const newReadedJson = await readFile();

        await submitChallenge();

        

    } catch (error) {
        console.log(error);
    }
}
const submitChallenge = () => {
    const options = {
        method: "POST",
        url: "https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=" + MY_TOKEN,
        headers: {
            "Content-Type": "multipart/form-data"
        },
        formData: {
            "answer": fs.createReadStream(path.resolve(__dirname, 'answer.json'))
        }
    };

    request(options, (err, res, body) => {
        if (err)
            console.log(err)

        console.log("Status: " + res.statusCode + res.statusMessage,body)
    })
}
const encryptSha = (phraseToDecode) => {
    return crypto.createHash('sha1')
        .update(phraseToDecode)
        .digest('hex');
}

const generateJson = () => new Promise((resolve, reject) => {
    request(CODENATION_URL + MY_TOKEN)
        .on('error', () => {
            reject();
        })
        .pipe(fs.createWriteStream(path.resolve(__dirname, 'answer.json')))
        .on('finish', () => {
            resolve();
        });
})

const readFile = () => new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, 'answer.json'), (err, data) => {
        if (err) {
            reject(err);
        } else {
            resolve(data);
        }
    })
})
const writeFile = (content) => new Promise((resolve, reject) => {
    fs.writeFile(path.resolve(__dirname, 'answer.json'), content, (err, data) => {
        if (err) {
            reject(err);
        } else {
            resolve(data);
        }
    })
})

const decodePhrase = (phrase, numbers) => {
    let decodedPhrase = '';
    if (phrase.length > 0 && numbers >= 0) {
        for (let i = 0; i < phrase.length; i++) {
            const char = phrase.charAt(i);

            if (!alphabet.includes(char)) {
                decodedPhrase += char;
            } else {
                decodedPhrase += alphabet[getIndexFromAlphabet(alphabet.indexOf(char), numbers)];
            }
        }

    } else {
        throw "Empty phrase or numbers is less than zero";
    }
    return decodedPhrase;
}

const getIndexFromAlphabet = (index, numbers) => {
    let nextIndex = index - numbers;
    if (nextIndex < 0) {
        nextIndex = alphabet.length - Math.abs(nextIndex);
    }

    return nextIndex;
}

main();
