(function() {

  var commChan;

  /*
    data = data from message
    origin = domain from which message was sent
    source = window object message was sent from
  */
  personaObserver = {
    onlogin: function(assertion){
      console.log('onlogin');
    },
    onlogout: function(){
      console.log('onlogout');
    },
    onmatch: function(){
      console.log('onmatch');
    },
    oncancel: function(){
      console.log('oncancel');
    }
  }

  /*
    ...
  */
  navigator.idSSO = {
    watch: function(options) {
      personaObserver.onlogin = options.onlogin;
      personaObserver.onlogout = options.onlogout;
      personaObserver.onmatch = options.onmatch;
      commChan.postMessage({
        type: "watch",
        data: {
          loggedInUser: options.loggedInUser
        }
      }, "*");
    },
    request: function(options) {
      personaObserver.oncancel = options.oncancel;
      commChan.postMessage({
        type: "request",
        data: {
          privacyPolicy: options.privacyPolicy,
          returnTo: options.returnTo,
          siteLogo: options.siteLogo,
          siteName: options.siteName,
          termsOfService: options.termsOfService
        }
      }, "*");
    },
    logout: function() {
      commChan.postMessage({
        type: "logout",
        data: {}
      }, "*");
    }
  };

  /*
    ...
  */
  var iframe = document.createElement("iframe");
  iframe.addEventListener("load", function() {
    commChan = iframe.contentWindow;
    /*
      data = data from message
      origin = domain from which message was sent
      source = window object message was sent from
    */
    commChan.addEventListener("message", function(payload, origin, source) {

      var fn = personaObserver[payload.type];
      if(fn) {
        switch(payload.type) {
          case "onlogin":
            fn(payload.data.assertion);
            break;
          default:
            fn();
        }
      }
    }, false);
  });
  iframe.style["display"] = "none";
  document.body.appendChild(iframe);
  iframe.src = "include.html";

}());
