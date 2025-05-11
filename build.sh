#!/usr/bin/env sh
set -e

# clear
rm -rf ./build
mkdir ./build

# build wasm
emcmake cmake ./ -B ./build
cd build
make

echo $res

# copy to lib
cd ../
mkdir -p ./lib/build
cp ./build/*.js ./lib/build
cp ./build/*.wasm ./lib/build

npm run build

# copy to test
cp -r ./lib/* ./test