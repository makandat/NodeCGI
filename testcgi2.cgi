#!/usr/bin/env node
/* cgi.js のテスト (2) */
const cgi = require("./cgi.js").WebPage;

let data = { "destination":"Yokohama", "fare":430, "minutes":25 };
let json = JSON.stringify(data);
cgi.send_json(json);
