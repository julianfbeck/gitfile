const expect = require("chai").expect;
const chai = require("chai");
const gitFile = require("./gitFile")
const fs = require('fs')




after(function (done) {
    fs.unlinkSync("test1")
    fs.unlinkSync("test2")
    fs.unlinkSync("./index.js")
    fs.unlinkSync("./discoverLocalWebservices.sh")
    done()
});

describe('Testing', async () => {
    it('Downloading from Gitub', async () => {
        let cli = {
            input:["https://github.com/sindresorhus/meow/blob/master/index.js"]
        }
        await gitFile(cli)
        expect(fs.existsSync("./index.js")).to.equal(true)
    });
    it('Downloading from Gist', async () => {
        let cli = {
            input:["https://gist.github.com/jufabeck2202/2e4ebea6439b94a6946b851e4dacd13b"]
        }
        await gitFile(cli)
        expect(fs.existsSync("./discoverLocalWebservices.sh")).to.equal(true)
    });
    it('Downloading from Gitub with Filename', async () => {
        let cli = {
            input:["test1","https://github.com/sindresorhus/meow/blob/master/index.js"]
        }
        await gitFile(cli)
        expect(fs.existsSync("./test1")).to.equal(true)
    });
    it('Downloading from Gist with Filename', async () => {
        let cli = {
            input:["test2","https://gist.github.com/jufabeck2202/2e4ebea6439b94a6946b851e4dacd13b"]
        }
        await gitFile(cli)
        expect(fs.existsSync("./test2")).to.equal(true)

    });

});