(function() {
  var commChan;

  var iframe = document.createElement("iframe");
  iframe.addEventListener("load", function() {
    commChan = iframe.contentWindow;
  });
  iframe.style["display"] = "none";
  document.body.appendChild(iframe);
  iframe.src = "include.html";

  navigator.idSSO = {
    watch: function(options) {
      commChan.postMessage(options, "*");
    },
    request: function(options) {

    },
    logout: function() {

    }
  };
}());
