#!/usr/bin/env node
/* cgi.js のテスト (3) QUERY_STRING */
const CgiPage = require("./cgi.js").WebPage;

var cgi = new CgiPage("", proc);

function proc(co) {
  var message = co.get_param("message", "");
  CgiPage.send_text(message);
}


