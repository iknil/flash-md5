import typescript from "rollup-plugin-typescript";
import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import sourceMaps from "rollup-plugin-sourcemaps";

export default {
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
            name: "MD5Tool",
            format: "umd",
            file: "lib/index.js"
        }
    ]
};