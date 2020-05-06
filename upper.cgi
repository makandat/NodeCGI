#!/usr/bin/env node
/* cgi.js のテスト (4) upper.cgi */
const CgiPage = require("./cgi.js").WebPage;

function proc(co) {
  let message = co.get_param("message", "");
  let msg = message.toUpperCase();
  console.log(msg);
}

new CgiPage("", proc);


