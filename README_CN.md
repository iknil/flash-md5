<p align="center">
  <a href="./README.md"><img alt="README in English" src="https://img.shields.io/badge/English-d9d9d9"></a>
  <a href="./README_CN.md"><img alt="简体中文版自述文件" src="https://img.shields.io/badge/简体中文-d9d9d9"></a>
</p>

FlashMD5是运行在Web端的高性能MD5计算工具，速度接近命令行工具，尤其适合在Web端计算大文件MD5的场景。以下是一些核心实现：

1. 开启Webworker运算MD5结果，不会阻塞渲染进程
2. 采用Openssl的MD5实现，计算速度快

## 快速开始

```js
import FlashMD5 from "flash-md5";

(async () => {
    const flashMD5 = new FlashMD5({
        entry: "https://cdn.jsdelivr.net/npm/flash-md5@1.0.1/lib/build/flash-md5.js",
        wasm: "https://cdn.jsdelivr.net/npm/flash-md5@1.0.1/lib/build/flash-md5.wasm"
    });

    await flashMD5.init(); // 初始化

    // 获取文件ArrayBuffer
    xxx.onchange = function() {
        const file = this.files[0];
        const chunkSize = FlashMD5.BASIS_CHUNK_SIZE * 20; // 控制分片大小，BASIS_CHUNK_SIZE = 5MB

        for (let start = 0; start < file.size; start += chunkSize) {
            const chunk = file.slice(start, start + chunkSize);
            const buffer = await chunk.arrayBuffer();

            await flashMD5.update(buffer); // 分片计算
        }

        const result = flashMD5.end(); // 获取MD5结果
    }
})()

```

### 在线示例

Demo：[https://codesandbox.io/p/sandbox/nice-mccarthy-jx35z3](https://codesandbox.io/p/sandbox/nice-mccarthy-jx35z3)


## 开发

**1. 环境准备**

> 如果需要在Windows系统上完成开发，请通过WSL的方式执行以下命令

```shell
git submodule init
git submodule update

./extra/emsdk/emsdk install 4.0.8
./extra/emsdk/emsdk activate 4.0.8
source ./extra/emsdk/emsdk_env.sh

npm install

```

**2. 编译测试**

```shell
# 编译
./build.sh

# 测试
npm run test

```

## 已知问题

**1. blob.arrayBuffer()耗时长**：

update()方法的入参类型是arrayBuffer，在获取到文件的句柄之后需要通过调用arrayBuffer()方法进行数据类型的转换，这个过程是需要进行硬盘读写的，耗时主要取决于硬盘读写性能。如果发现这个耗时比较长，或者考虑到使用者的机器性能欠佳，可以考虑调整每次获取文件的分片大小，避免在计算MD5之前有较长的io等待。

又或者可以考虑，异步把文件读入内存，避免需要计算MD5之时准备数据的等待，例如：

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

btn.onclick = async function () {
    while(chunkBufferArray.length > 0) {
        const buffer = await bufferArray.shift();
        flashMD5.update(buffer);
    }

    const result = flashMD5.end();
}

```

