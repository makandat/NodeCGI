#!/usr/bin/env node
/* cgi.js のテスト (1) */
const cgi = require("./cgi.js").WebPage;

cgi.send_text("Hello World!");
