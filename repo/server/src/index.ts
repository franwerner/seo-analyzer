import "./config/dotenv.config"
import OpenAiService from "./services/openAi.service";
import VirtualDom from "./services/virtualDom.service";
import express from "express";

const app = express()

let virtualDom: VirtualDom;

const openAiService = new OpenAiService();

(async () => {
    const dom = new VirtualDom({
        path: "http://127.0.0.1:5500/html.html"
    })
    await dom.start()
    await dom.validateDom()
    console.log(dom.globalIssues)
    const html = dom.generateDomHTML()
    if (html) {
        await openAiService.generateIssues(html)
    }
    virtualDom = dom
})()


app.get("/", (req, res) => {
    res.json(virtualDom?.generateDomHTML())
})

app.listen(3000, () => console.log("ON"))