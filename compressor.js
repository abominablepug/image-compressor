const sharp = require("sharp");
const path = require("node:path")
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

async function resizeImages(inputPath, outputPath, width, height) {
    const files = await readdir(inputPath);
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|webp|gif|tiff)$/i.test(file));

    if (imageFiles.length === 0) {
        console.log("No images found in the input directory.");
        return;
    }

    console.log(`Found ${imageFiles.length} images to resize...`);

    const resizePromises = imageFiles.map(file => {
        const inputFile = path.join(inputPath, file);
        const outputFile = path.join(outputPath, file);

        sharp(inputFile)
        .resize(Number(width), Number(height), {fit:"contain"})
        .toFile(outputFile)
    })

    await Promise.all(resizePromises);
    console.log("All images have been successfully resized.");
}

async function ensureDirExists(dirPath) {
    try {
        await access(dirPath)
    } catch (err) {
        if (err.code === "ENOENT") {
            console.log(`Output directory does not exist. Creating it now at: ${dirPath}`);
            await mkdir(dirPath, {recursive: true})
        } else {
            throw err;
        }
    }
}

async function main() {
    try {
        const { height: heightStr, width: widthStr, input, output } = parseArgs({ options }).values

        
        if (!widthStr) {
            throw new Error("A width argument must be provided via -w or --width.")
        }
        if (!input) {
            throw new Error("A input argument must be provided via -i or --input.")
        }
        if (!output) {
            throw new Error("A output argument must be provided via -o or --output.")
        }


        const width = Number(widthStr);
        const height = heightStr ? Number(heightStr) : width;
        if (isNaN(width) || isNaN(height)) {
            throw new Error("Width and height must be valid numbers.")
        }


        const inputPath = path.resolve(process.cwd(), input);
        const outputPath = path.resolve(process.cwd(), output);

        if (inputPath === outputPath) {
            throw new Error("Input and output directories cannot be the same.")
        }

        await ensureDirExists(outputPath);
        await resizeImages(inputPath, outputPath, width, height);


    } catch (err) {
        console.error("An error occurred:");
        switch (err.code) {
            case "ENOENT":
                console.error("The specified input path does not exist.")
                break;
            case "EPERM":
            case "EACCES":
                console.error("Permission denied. Check file/folder permissions.")
                break;
            default:
                console.error(err.message);
                break;
        }
        process.exit(1);
    }
}

main();