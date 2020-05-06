#!/usr/bin/env node
/* cgi.js のテスト (5) cookie.cgi */
const CgiPage = require("./cgi.js").WebPage;
var cgi = new CgiPage("./templates/cookie.html", proc);

function proc(co) {
  let count = 0;
  let cookie = co.get_cookie("count", null);
  if (cookie != null) {
    count = parseInt(cookie, 10) + 1;
  }
  co.append_cookie("count", count);
  co.set_value("count", count);
  co.echo();
}



