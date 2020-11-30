"use strict";
var express = require("express");
const puppeteer = require("puppeteer");
var port = 5006;
const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage();

var app = express();

app.get("/", function (req, res) {
  res.send("Headless API");
});

app.get("/pdf", async function (req, res) {
  try {
    const pageResponse = await page.goto(req.query.url, {
      waitUntil: "networkidle2",
    });
    if (pageResponse.ok()) {
      await page.emulateMediaType("print");
      const pdf = await page.pdf({
        format: "A4",
      });
      res.writeHead(200, { "Content-Type": "application/pdf" });
      res.end(pdf);
    } else {
      res
        .status(500)
        .send("Failed to generaete pdf. " + (await pageResponse.text()));
    } 
  } catch (e) {
    console.log("entering catch block");
    console.log(e);
    console.log("leaving catch block");
  }
  finally {
    await browser.disconnect();
  }
});

app.listen(port, function () {
  console.log("App listening on port " + port);
});
