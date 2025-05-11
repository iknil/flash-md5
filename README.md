<p align="center">
<a href="./README.md"><img alt="README in English" src="https://img.shields.io/badge/English-d9d9d9"></a>
<a href="./README_CN.md"><img alt="Simplified Chinese version of Readme File" src="https://img.shields.io/badge/Simplified Chinese-d9d9d9"></a>
</p>

FlashMD5 is a high-performance MD5 computing tool running on the web side, with a speed close to that of the command line tool, and is especially suitable for scenarios where large files MD5 are calculated on the web side. Here are some core implementations:

1. Turn on the Webworker operation MD5 result, and will not block the rendering process
2. Using Openssl's MD5 implementation, fast calculation speed

## Start quickly

```js
import FlashMD5 from "flash-md5";

(async () => {
    const flashMD5 = new FlashMD5({
        entry: "{CDN}/flash-md5.js",
        wasm: "{CDN}/build/flash-md5.wasm"
    });

    await flashMD5.init(); // Initialization

    // Get the file ArrayBuffer
    xxx.onchange = function() {
        const file = this.file[0];
        const chunkSize = FlashMD5.BASIS_CHUNK_SIZE * 20; // Control the shard size, BASIS_CHUNK_SIZE = 5MB

        for (let start = 0; start < file.size; start += chunkSize) {
            const chunk = file.slice(start, start + chunkSize);
            const buffer = await chunk.arrayBuffer();

            await sparkMD5.append(buffer); // sharding calculation
        }

        const result = sparkMD5.end(); // Get MD5 results
    }
})()

```

## Development

**1. Environmental preparation**

> If you need to complete development on Windows system, please execute the following commands through WSL

```shell
Git Submodule Init
git submodule update

./extra/emsdk/emsdk install 4.0.8
./extra/emsdk/emsdk activate 4.0.8
source ./extra/emsdk/emsdk_env.sh

npm install

```

**2. Compilation test**

```shell
# Compilation
./build

# test
npm run test

```

## Known issues

**1. blob.arrayBuffer() takes a long time**:

The parameter type of the update() method is arrayBuffer. After obtaining the file handle, you need to convert the data type by calling the arrayBuffer() method. This process requires hard disk reading, and the time consumption mainly depends on the hard disk reading performance. If you find that this takes a long time, or considering that the user's machine performance is poor, you can consider adjusting the shard size of each file acquisition to avoid having a longer io wait before calculating MD5.

Or you can consider reading files into memory asynchronously to avoid waiting for data preparation when MD5 is calculated, for example:

```js
const bufferArray = [];

function getFileBlocks(file) {
    const chunkBufferArray = [];

    for (let start = 0; start < file.size; start += chunkSize) {
        const chunk = file.slice(start, start + chunkSize);
        chunkBufferArray.push(chunk.arrayBuffer());
    }
    return chunkBufferArray;
}

fileInput.onchange = function () {
    bufferArray = getFileBlocks(this.files[0]);
}

sparkBtn.onclick = async function () {
    while(chunkBufferArray.length > 0) {
        const buffer = await bufferArray.shift();
        sparkMD5.append(buffer);
    }

    const result = sparkMD5.end();
}

```

