#!/usr/bin/env sh

# clear
rm -rf ./build
mkdir ./build

# build wasm
emcmake cmake ./ -B ./build
# cp ./src/main.c ./build/main.c
cd build
make

# copy to lib
cd ../
mkdir -p ./lib/build
cp ./build/*.js ./lib/build
cp ./build/*.wasm ./lib/build

npm run build

# copy to test
cp -r ./lib/* ./test