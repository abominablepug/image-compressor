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

async function resizeImages(inputPath, outputPath, width, height) {
    if (!width) {

    }

    const files = await readdir(inputPath);
    const realHeight = height ? height : width;
    files.map(file => {
        sharp(inputPath + "/" + file)
        .resize(Number(width), Number(height), {fit:"contain"})
        .toFile(outputPath + "/" + file)
    })
}

async function main() {
    const inputPath = process.cwd() + "/" + input;
    const outputPath = (output) ? process.cwd() + "/" + output : inputPath;
    try {
        await access(outputPath);
    } catch (err) {
        console.log("Output folder does not exist... creating now");
        try {
            await mkdir(outputPath);
            await resizeImages(inputPath);
        } catch (err) {
            if (err.code === "ENOENT") {
                console.log("Part of the provided path does not exist.");
            } else if (err.code === "EPERM") {
                console.log("You do not have write permission to that folder.");
            } else if (err.code === "ENAMETOOLONG") {
                console.log("The name of the new folder is too long.");
            } else {
                console.log("Unable to resize the images. Make sure the right folder was provided and that ALL files within are images.");
                console.log(err)
            }
        }
    }
    try {
        await resizeImages(inputPath)
    } catch (err) {
        console.log("Unable to resize the images. Make sure the right folder was provided and that ALL files within are images.");
    }
}

main();