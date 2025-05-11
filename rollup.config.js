import typescript from "rollup-plugin-typescript";
import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import sourceMaps from "rollup-plugin-sourcemaps";
import dts from "rollup-plugin-dts";

export default [{
    input: "./src/index.ts",
    plugins: [
        typescript({
            exclude: "node_modules/**",
            typescript: require("typescript")
        }),
        commonjs(),
        babel(),
        sourceMaps()
    ],
    output: [
        {
            name: "FlashMD5",
            format: "esm",
            file: "lib/index.js"
        },
        {
            name: "FlashMD5",
            format: "umd",
            file: "lib/index.umd.js"
        }
    ]
}, {
    input: "./src/index.ts",
    plugins: [dts()],
    output: {
        format: "esm",
        file: "lib/index.d.ts"
    }
}];