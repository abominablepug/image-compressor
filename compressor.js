// Compress all images in a folder
// Use sharp library
// Input: path/to/folder
const readline = require("readline");
const sharp = require("sharp");
const { parseArgs } = require("node:util");
const { readdir, access, mkdir } = require("node:fs/promises");

const options = {
    height: {
        type: "string",
        short: "h"
    },
    input: {
        type: "string",
        short: "i"
    },
    width: {
        type: "string",
        short: "w"
    },
    output: {
        type: "string",
        short: "o"
    }
}

const { height, width, input, output } = parseArgs({ options }).values

async function main() {
    const inputPath = process.cwd() + "/" + input;
    const outputPath = process.cwd() + "/" + output;
    try {
        await access(outputPath);
    } catch (err) {
        console.log("Output folder does not exist... creating now");
        await mkdir(outputPath);
    }
    const files = await readdir(inputPath);
    files.map(file => {
        sharp(inputPath + "/" + file)
        .resize(Number(width), Number(height), {fit:"contain"})
        .toFile(outputPath + "/" + file)
    })
}

main();