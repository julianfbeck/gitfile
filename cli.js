const meow = require('meow');
const gitFile = require("./gitFile")
const cli = meow(`
Usage
  $ gitfile <GitHubFileURL/GistFileURL>
  $ gitfile <filename> <githubURL>
`);

(async () => {
    await gitFile(cli)
})()