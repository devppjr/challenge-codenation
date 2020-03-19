const CODENATION_URL = "https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=";
const MY_TOKEN = "0fb02427366245d2c5b6ac06e2bb89b475d81a2f";
const request = require('request');
const fs = require('fs');
const path = require('path');

const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

const main = async () => {
    try {
        const geraJson = await generateDataRequestFromCodenation();
        const readJson = await readFile();
        console.log(geraJson);
    } catch (error) {
        console.log(error);
    }
}

const generateDataRequestFromCodenation = async () => {
    return await new Promise(resolve =>
        request(CODENATION_URL + MY_TOKEN)
            .pipe(fs.createWriteStream(path.resolve(__dirname, 'answer.json')))
            .on('finish', resolve));
}

const decode = (phrase, numbers) => {
    let decodedPhrase = '';
    if (phrase.length > 0 && numbers >= 0) {
        for (let i = 0; i < phrase.length; i++) {
            const char = phrase.charAt(i);
            if (alphabet.includes(char)) {
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

const readFile = async () => {
    const readed = await fs.readFile(path.resolve(__dirname, 'answer.json'), (err, data) => {
        if (err)
            throw err;
        return data;
    })
    return readed;
}
const getIndexFromAlphabet = (index, numbers) => {
    let nextIndex = index + numbers;

    if (nextIndex > (alphabet.length - 1)) {
        nextIndex -= alphabet.length;
    }
    return nextIndex;
}

const writeFile = (content) => {
    fs.writeFile(path.resolve(__dirname, 'answer.json'), content, function (err) {
        if (err) throw err;
    });
}

main();
// console.log(readFile());
// console.log(decode("a z", 25))