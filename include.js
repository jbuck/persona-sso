(function() {

  var commChan;

  /*
    Dummy object for catching navigator.idSSO calls
    before the actual idSSO iframe has finished loading.
    The passed objects will be used to call watch, request,
    and/or logout immediately when the iframe has loaded.
  */
  navigator.idSSO = {
    watch: function(watchObject) {
      this.watch = watchObject;
    },
    request: function(requestObject) {
      this.request = requestObject;
    },
    logout: function(logoutObject) {
      this.logout = logoutObject;
    }
  }

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
    Inject an iframe for Persona communication (see include.html)
  */
  var iframe = document.createElement("iframe");
  iframe.addEventListener("load", function() {
    commChan = iframe.contentWindow;

    /*
      Assign watch function, and immediately call if the
      used called navigator.idSSO.watch(...) before the
      iframe was done loading.
    */
    var preset = navigator.idSSO.watch;
    navigator.idSSO.watch = function(options) {
      personaObserver.onlogin = options.onlogin;
      personaObserver.onlogout = options.onlogout;
      personaObserver.onmatch = options.onmatch;
      commChan.postMessage(JSON.stringify({
        type: "watch",
        data: {
          loggedInUser: options.loggedInUser
        }
      }), "*");
    };
    if(preset) navigator.idSSO.watch(preset);

    /*
      Assign request function, and immediately call if the
      used called navigator.idSSO.request(...) before the
      iframe was done loading.
    */
    preset = navigator.idSSO.request;
    navigator.idSSO.request = function(options) {
      personaObserver.oncancel = options.oncancel;
      commChan.postMessage(JSON.stringify({
        type: "request",
        data: {
          privacyPolicy: options.privacyPolicy,
          returnTo: options.returnTo,
          siteLogo: options.siteLogo,
          siteName: options.siteName,
          termsOfService: options.termsOfService
        }
      }), "*");
    };
    if(preset) navigator.idSSO.request(preset);

    /*
      Assign logout function, and immediately call if the
      used called navigator.idSSO.logout(...) before the
      iframe was done loading. If a user wants to do that...
    */
    preset = navigator.idSSO.logout;
    navigator.idSSO.logout = function() {
      commChan.postMessage(JSON.stringify({
        type: "logout",
        data: {}
      }), "*");
    };
    if(preset) navigator.idSSO.logout(preset);

    /*
      data = data from message
      origin = domain from which message was sent
      source = window object message was sent from
    */
    // set up the comm. channel listener
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
