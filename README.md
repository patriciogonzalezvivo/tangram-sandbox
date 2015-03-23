demo
====

This is a simple angular app that uses mapzen's pelias api (https://pelias.mapzen.com) to demonstrate the following endpoints.

* /suggest
* /search
* /reverse

Start typing into the text box and the suggester will return type ahead suggestions. 

![Suggester](/css/images/screenshots/suggest.png?raw=true "Suggestions for Pizza")

If you want to see '/search' results, simply hit enter. 

![Search](/css/images/screenshots/search.png?raw=true "Search Results for Pizza")

In addition to suggest and search, you can also click anywhere on the map to drop a pin and reverse geocode using the '/reverse' endpoint. 

![Reverse](/css/images/screenshots/reverse.png?raw=true "Reverse Geocoder")