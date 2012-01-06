var Proxy;

Proxy = (function() {

  function Proxy(document) {
    this.document = document;
    this.body = this.document.getElementsByTagName('body')[0];
    this.injectScript(this._listener);
  }

  Proxy.prototype.injectScript = function(code, name, src) {
    var script;
    if (name == null) name = null;
    if (src == null) src = null;
    code = code.toString();
    if (code.length > 0) {
      if (name != null) {
        code = "" + name + " = " + code;
      } else {
        code = "(" + code + ")()";
      }
    }
    if (name && (script = document.getElementById(name))) {
      return script.innerHTML = code;
    } else {
      script = this.document.createElement("script");
      script.type = "text/javascript";
      if (name != null) script.id = name;
      if (src != null) script.src = src;
      script.innerHTML = code;
      return this.document.head.appendChild(script);
    }
  };

  Proxy.prototype._listener = function() {
    console.log('adding listener');
    return document.getElementsByTagName('body')[0].addEventListener('vimbanery-exec', function() {
      return _vimbaneryAction();
    });
  };

  Proxy.prototype.injectAction = function(f) {
    console.log('injecting new action');
    return this.injectScript(f, '_vimbaneryAction');
  };

  Proxy.prototype.exec = function(f) {
    var event;
    this.injectAction(f);
    event = document.createEvent('Event');
    event.initEvent('vimbanery-exec', true, true);
    return this.body.dispatchEvent(event);
  };

  return Proxy;

})();
