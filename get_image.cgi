#!/usr/bin/env node
/* cgi.js のテスト (5) get_image.cgi */
const CgiPage = require("./cgi.js").WebPage;

function proc(co) {
  let path = co.get_param("path", "");
  CgiPage.send_image(path);
}

new CgiPage("", proc);
