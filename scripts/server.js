import webpack from "webpack";
import config from "../webpack.config";

const compiler = webpack(config);
const express = require("express");
const open = require("open");
const port = 3005;
const app = express();
app.use(
    require("webpack-dev-middleware")(compiler, {
        publicPath: config.output.publicPath,
    })
);
// app.get("/", function (req, res) {
//     res.sendFile(path.join(__dirname, "../src/index.html"));
// });
app.listen(port, function (err) {
    if (err) {
        console.log(err);
    } else {
        open("http://localhost:" + port);
    }
});