"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UploadFile = function () {
  function UploadFile() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$selector = _ref.selector,
        selector = _ref$selector === undefined ? "" : _ref$selector,
        _ref$callback = _ref.callback,
        callback = _ref$callback === undefined ? function () {} : _ref$callback;

    _classCallCheck(this, UploadFile);

    this.selector = selector;
    this.callback = callback;
    this.init();
  }

  _createClass(UploadFile, [{
    key: "init",
    value: function init() {
      var self = this;
      this.events = {};
      //判断元素
      if (this.selector && document.querySelector(this.selector)) {
        this.el = document.querySelector(this.selector);
      } else {
        this.el = document.createElement("div");
      }
      this.el.classList.add("upload-box");

      this.oInput = document.createElement("input");
      this.oInput.setAttribute("type", "file");
      this.oInput.setAttribute("name", "uploadFile");
      this.oInput.setAttribute("id", "uploadFile");
      this.oInput.setAttribute("accept", "image/*");
      this.oInput.style.position = "absolute";
      this.oInput.style.width = "100%";
      this.oInput.style.height = "100%";
      this.oInput.style.top = 0;
      this.oInput.style.left = 0;
      this.oInput.style.opacity = 0;
      this.el.appendChild(this.oInput);

      this.reader = new FileReader();
      this.reader.addEventListener("loadstart", this.onLoadStart.bind(this), false);
      this.reader.addEventListener("progress", this.onProgress.bind(this), false);
      this.reader.addEventListener("abort", this.onAbort.bind(this), false);
      this.reader.addEventListener("load", this.onFinish.bind(this), false);
      this.reader.addEventListener("loadend", this.onLoadEnd.bind(this), false);
      this.reader.addEventListener("error", this.onError.bind(this), false);

      this.oInput.addEventListener("change", function () {
        self.readAsDataURL(this.files[0]);
      }, false);
    }
  }, {
    key: "readAsDataURL",
    value: function readAsDataURL(_file) {
      this.handleFile(_file);
      this.reader.readAsDataURL(_file);
    }
  }, {
    key: "readAsArrayBuffer",
    value: function readAsArrayBuffer(_file) {
      this.handleFile(_file);
      this.reader.readAsArrayBuffer(_file);
    }
  }, {
    key: "readAsBinaryString",
    value: function readAsBinaryString(_file) {
      this.handleFile(_file);
      this.reader.readAsBinaryString(_file);
    }
  }, {
    key: "readAsText",
    value: function readAsText(_file) {
      this.handleFile(_file);
      this.reader.readAsText(_file);
    }
  }, {
    key: "handleFile",
    value: function handleFile(_file) {
      this.file = {
        name: _file.name,
        size: _file.size,
        type: _file.type
      };
    }
    //监听事件

  }, {
    key: "on",
    value: function on(type, handler) {
      this.events[type] = this.events[type] || [];
      this.events[type].push(handler);
    }
    //删除事件

  }, {
    key: "off",
    value: function off(type, handler) {
      if (arguments.length == 0) {
        for (var _name in this.events) {
          delete this.events[_name];
        }
        return this;
      }
      if (arguments.length == 1 && {}.toString.call(arguments[0]) == "[object String]") {
        this.events[type] = [];
        return this;
      }
      if (arguments.length == 1 && {}.toString.call(arguments[0]) == "[object Function]") {
        for (var name in this.events) {
          for (var i = 0, len = this.events[name].length; i < len; i++) {
            if (this.events[name][i] == arguments[0]) {
              this.events[name].splice(i, 1);
            }
          }
        }
        return this;
      }
      for (var i = 0, len = this.events[type].length; i < len; i++) {
        this.events[type].slice(i, 1);
      }

      return this;
    }
    //触发事件

  }, {
    key: "trigger",
    value: function trigger(type, data) {
      if (arguments.length == 0 || {}.toString.call(arguments[0]) != "[object String]") return this;
      if (!this.events[type]) return;
      for (var i = 0, len = this.events[type].length; i < len; i++) {
        this.events[type][i].call(this, data);
      }
      return this;
    }
    //文件开始上传

  }, {
    key: "onLoadStart",
    value: function onLoadStart() {
      this.trigger("loadstart");
    }
    /*文件上传进度*/

  }, {
    key: "onProgress",
    value: function onProgress() {
      this.trigger("loadprogress", { loaded: arguments[0].loaded, total: arguments[0].total });
    }
    //文件上传完成

  }, {
    key: "onFinish",
    value: function onFinish() {
      this.onCompass(arguments[0].target.result);
      this.trigger("loadfinish", { result: arguments[0].target.result });
    }
    //文件上传取消

  }, {
    key: "onAbort",
    value: function onAbort() {
      this.trigger("loadabort");
    }
    //文件上传失败

  }, {
    key: "onError",
    value: function onError() {
      this.trigger("loaderror");
    }
    //文件无论是否上传完成都会调用

  }, {
    key: "onLoadEnd",
    value: function onLoadEnd() {
      this.trigger("loadend");
    }
    //压缩图片

  }, {
    key: "onCompass",
    value: function onCompass(url) {
      var self = this;
      this.trigger("compassstart");
      var tmp = document.createElement("canvas");
      var ctx = tmp.getContext("2d");
      var img = new Image();
      img.onload = function () {

        tmp.width = img.width / 2;
        tmp.height = img.height / 2;
        ctx.drawImage(this, 0, 0, img.width, img.height, 0, 0, tmp.width, tmp.height);
        self.trigger("compassend", { result: tmp.toDataURL(self.file.type) });
        self.callback(tmp.toDataURL(self.file.type, .96));
      };
      img.src = url;
    }
  }]);

  return UploadFile;
}();