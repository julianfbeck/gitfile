const http = require('https');
const fs = require('fs');
const meow = require('meow');
const url = require("url");
const request = require('request');
const cheerio = require('cheerio');
const chalk = require('chalk');



const cli = meow(`
	Usage
      $ gitfile <GitHubFileURL/GistFileURL>
      $ gitfile <filename> <githubURL>
`);


(async () => {
    if (cli.input.length == 0) {
        console.log(chalk.red("please provide a github url"))
        console.log(cli.help)
    }

    let baseURL = cli.input.length == 2 ? cli.input[1] : cli.input[0]
    baseURL.replace(/\/$/, '');
    const URLHostname = url.parse(baseURL).hostname
    let downloadURL = ""
    let fileName = ""

    if (URLHostname == "github.com") {

        downloadURL = baseURL.replace("https://www.github.com/", "https://raw.githubusercontent.com/")
        fileName = cli.input.length == 2 ? cli.input[0] : cli.input[0].substring(cli.input[0].lastIndexOf('/') + 1)

    } else if (URLHostname == "gist.github.com") {

        try {
            downloadURL = await getGistRawURL(baseURL)
        } catch (error) {
            console.log(error)
        }
        fileName = cli.input.length == 2 ? cli.input[0] : downloadURL.substring(downloadURL.lastIndexOf('/') + 1)

    } else {
        console.log(chalk.red("please provide a valid github url"))
        console.log(cli.help)
    }

    const file = fs.createWriteStream(fileName)
    const download = http.get(downloadURL, (response) => {
        response.pipe(file);
    }).on("close", () => {
        console.log(chalk.green("Downloaded "+fileName))
    }).on("error",(error)=>{
        console.print(error)
    });
})();

function getGistRawURL(inputURL) {
    return new Promise((resolve, reject) => {
        request(inputURL, function (err, resp, html) {
            if (err) {
                reject(err)
            }
            const $ = cheerio.load(html);
            let rawURl = ($('.file-actions').find('a').attr("href"));
            resolve(url.resolve(inputURL, rawURl))
        });
    });
}