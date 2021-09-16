'use strict';
const fs = require("fs");
const path = require("path");
const os = require("os");
const querystring = require('querystring');


/* CGI 用 WebPage クラス */
class WebPage {
  // コンストラクタ
  constructor(template="", callback=null) {
    this.headers = ["Content-Type: text/html"];
    this.html = "";
    this.params = {};
    this.cookies = {};
    this.is_postback = false;
    this.qs = null;
    this.body = null;
    // クッキー (HTTP_COOKIE) 
    if (process.env["HTTP_COOKIE"]) {
      let cookie = process.env["HTTP_COOKIE"];
      WebPage.log(cookie);
      this.cookies = querystring.decode(cookie);
    }
    // テンプレートファイルを読み込む。
    if (template != "") {
      this.html = fs.readFileSync(template, {mode:"r", encoding:"utf-8"});
    }
    this.is_postback = false;
    // GET データ (QUERY_STRING)
    if (this.get_method() == "GET" && process.env["QUERY_STRING"]) {
      this.qs = process.env["QUERY_STRING"];
      this.is_postback = true;
      this.params = querystring.decode(this.qs);
      if (callback != null)
        callback(this);
    }
    else {
      this.qs = "";
      if (callback != null) {
        callback(this);
      }
    }
    // POST データ
    if (this.get_method() == "POST") {
      let n = parseInt(process.env["CONTENT_LENGTH"], 10);
      this.body = Buffer.alloc(n);
      fs.read(0, this.body, 0, n, null,
        (err, bytes, buffer) =>{
          if (err == null) {
            this.is_postback = true;
            let str = this.body.toString();
            this.params = querystring.decode(str);
            WebPage.log(this.params["message"]);
            callback(this);
          }
          else {
            throw err;
          }
        });
    }
    else {
      this.body = Buffer.alloc(0);
    }
  }
  
  // HTTP メソッドを得る。
  get_method() {
    return process.env["REQUEST_METHOD"];
  }
  
  // パラメータを得る。
  get_param(key, defval="") {
    if (this.params[key] == undefined)
      return defval;
    else
      return this.params[key];
  }
  
  // クッキーを得る。
  get_cookie(key, defval="") {
    if (this.cookies[key] == undefined)
      return defval;
    else
      return this.cookies[key];
  }

  // HTTP ヘッダーを返す。
  send_headers() {
    for (let header of this.headers) {
      console.log(header);
    }
    console.log("");
  }
  
  // レスポンスを返す。
  echo() {
    this.send_headers();
    console.log(this.html);
  }

  // 文字列を返す。
  static send_text(text) {
    console.log("Content-Type: text/plain\n");
    console.log(text);
  }

  // JSON 文字列を返す。
  static send_json(json) {
    console.log("Content-Type: application/json\n");
    console.log(json);
  }
  
  // 画像を返す。
  static send_image(filepath) {
    let ext = path.extname(filepath).toLowerCase();
    let mime = "";
    if (ext == ".jpg" || ext == ".jpeg") {
      mime = "Content-Type: image/jpeg\n\n";
    }
    else if (ext == ".png") {
      mime = "Content-Type: image/png\n\n";
    }
    else if (ext == ".gif") {
      mime = "Content-Type: image/gif\n\n";
    }
    else {
      throw "Bad image file.";
    }
    
    let fd1 = fs.openSync(filepath, "r");
    let stat = fs.fstatSync(fd1);
    let buffer = Buffer.concat([Buffer.from(mime), Buffer.alloc(stat.size)]);
    let offset = mime.length;
    fs.read(fd1, buffer, offset, buffer.length-offset, 0, (err, bytes, buff)=>{
       if (err == null) {
          fs.write(1, buffer, (err, bytes, buff)=>{
            fs.closeSync(fd1);
          });
       }
    });
  }


  // テンプレートの埋め込み変数に値を埋め込む。
  set_value(key, value) {
    let regex = new RegExp("\\(\\*" + key + "\\*\\)", "g");
    this.html = this.html.replace(regex, value);
  }

  // テンプレートの埋め込み変数に値を一括して埋め込む。
  embed(obj) {
    for (let key in obj) {
      this.setPlaceHolder(key, obj[key]);
    }
  }

  // this.headers に HTTP ヘッダーを追加する。
  append_header(header) {
    this.headers.push(header);
  }

  // クッキーを this.headers に追加する。
  append_cookie(key, value, options = "") {
    let encval = encodeURI(value);
    let cookie = "SET-COOKIE: " + key + "=" + encval + " " + options;
    this.append_header(cookie);
  }

  // ログを取る。
  static log(msg) {
    let logfile = "/var/www/data/NodeCGI.log";
    if (os.platform() == "win32")
       logfile = "C:/temp/NodeCGI.log";
    let dt = new Date();
    let sdt = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
    fs.appendFileSync(logfile, sdt + " " + msg + "\n");
  }
}


/* エクスポート */
module.exports.WebPage = WebPage;
