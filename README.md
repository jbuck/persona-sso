# Persona SSO

## Send data from include.js to comm channel

## Recieve data in comm channel

## Parse the data in comm channel, make some Persona calls

## Send data back to include.js

## Data format

* watch()
  * loggedInUser - String
  * onlogin - required Function
  * onlogout - required Function
  * onmatch - Function
* request()
  * oncancel - Function
  * privacyPolicy - String
  * returnTo - String
  * siteLogo - String
  * siteName - String
  * termsOfService - String
* logout()

window.postMessage(data, origin);
window.addEventListener("message", function(data, origin, source) {
  data = data from message
  origin = domain from which message was sent
  source = window object message was sent from
}, false);

// Send a watch to comm channel
{
  type: "watch",
  data: {
    loggedInUser: "jon@jbuckley.ca"
  }
}

// Send a request to comm channel
{
  type: "request",
  data: {
    siteLogo: "/logo.png"
  }
}

// Receive onlogin from comm channel
{
  type: "onlogin",
  data: {
    assertion: "asdfasdf"
  }
}

// Receive onlogout from comm channel
{
  type: "onlogout",
  data: {}
}

// Recieve onmatch from comm channel
{
  type: "onmatch",
  data: {}
}
