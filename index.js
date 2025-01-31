import express from 'express';
import path from 'path';
import { connectToMongodb } from "./connect.js";
import { URL } from "./models/url.js";
import cookieParser from 'cookie-parser';

import { staticRouter } from './routes/staticRouter.js';
import { router } from "./routes/url.js";
import { userSignRouter } from './routes/user.js';
import { checkForAuthontication, restrictTo } from './middleware/auth.js';

const app = express();
const PORT = 8111;

connectToMongodb("mongodb://localhost:27017/short-url").then(() => {
    console.log("mongodb connected");
})

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());//middleware
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthontication);

// app.use("/url/test", async (req, res) => {
//     const allUrls = await URL.find({});
//     return res.render("home", {
//         urls: allUrls,
//     });
// });

app.use("/url",restrictTo(["NORMAL"]), router);
app.use("/", staticRouter);
app.use("/user", userSignRouter);

app.listen(PORT, () => console.log(`Server Startted at PORT: ${PORT}`));