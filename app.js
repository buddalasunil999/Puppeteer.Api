'use strict';
var express = require('express');
const puppeteer = require('puppeteer');
var port = 5006;

var app = express();

app.get('/', function (req, res) {
  res.send('Headless API');
});

app.get('/pdf', async function (req, res) {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto(req.query.url, { waitUntil: 'networkidle2' });
  const pdf = await page.pdf();
  res.writeHead(200, { 'Content-Type': 'application/pdf' });
  res.end(pdf);
  await browser.close();
});

app.listen(port, function () {
  console.log('App listening on port ' + port);
});
