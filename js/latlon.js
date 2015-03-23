/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Latitude/longitude spherical geodesy formulae & scripts           (c) Chris Veness 2002-2014  */
/*   - www.movable-type.co.uk/scripts/latlong.html                                                */
/*                                                                                                */
/*  Sample usage:                                                                                 */
/*    var p1 = new LatLon(51.5136, -0.0983);                                                      */
/*    var p2 = new LatLon(51.4778, -0.0015);                                                      */
/*    var dist = p1.distanceTo(p2);                                                               */
/*    var brng = p1.bearingTo(p2);                                                                */
/*    ... etc                                                                                     */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
'use strict';


/**
 * Creates a LatLon point on the earth's surface at the specified latitude / longitude.
 *
 * @classdesc Tools for geodetic calculations
 * @requires Geo
 *
 * @constructor
 * @param {number} lat - Latitude in degrees.
 * @param {number} lon - Longitude in degrees.
 * @param {number} [height=0] - Height above mean-sea-level in kilometres.
 * @param {number} [radius=6371] - (Mean) radius of earth in kilometres.
 */
function LatLon(lat, lon, height, radius) {
    if (typeof height == 'undefined') height = 0;
    if (typeof radius == 'undefined') radius = 6371;
    radius = Math.min(Math.max(radius, 6353), 6384);

    this.lat    = Number(lat);
    this.lon    = Number(lon);
    this.height = Number(height);
    this.radius = Number(radius);
}


/**
 * Returns the distance from 'this' point to destination point (using haversine formula).
 *
 * @param   {LatLon} point - Latitude/longitude of destination point.
 * @param   {number} [precision=4] - Number of significant digits to use for returned value.
 * @returns {number} Distance between this point and destination point, in km.
 */
LatLon.prototype.distanceTo = function(point, precision) {
    // default 4 significant figures reflects typical 0.3% accuracy of spherical model
    if (typeof precision == 'undefined') precision = 4;
  
    var R = this.radius;
    var phi1 = this.lat.toRadians(),  lamda1 = this.lon.toRadians();
    var phi2 = point.lat.toRadians(), lamda2 = point.lon.toRadians();
    var deltaphi = phi2 - phi1;
    var deltalamda = lamda2 - lamda1;

    var a = Math.sin(deltaphi/2) * Math.sin(deltaphi/2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltalamda/2) * Math.sin(deltalamda/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;

    return d.toPrecisionFixed(Number(precision));
}


/**
 * Returns the (initial) bearing from 'this' point to destination point.
 *
 * @param   {LatLon} point - Latitude/longitude of destination point.
 * @returns {number} Initial bearing in degrees from north.
 */
LatLon.prototype.bearingTo = function(point) {
    // see http://williams.best.vwh.net/avform.htm#Crs

    var phi1 = this.lat.toRadians(), phi2 = point.lat.toRadians();
    var deltalamda = (point.lon-this.lon).toRadians();

    var y = Math.sin(deltalamda) * Math.cos(phi2);
    var x = Math.cos(phi1)*Math.sin(phi2) -
            Math.sin(phi1)*Math.cos(phi2)*Math.cos(deltalamda);
    var theta = Math.atan2(y, x);
  
    return (theta.toDegrees()+360) % 360;
}


/**
 * Returns final bearing arriving at destination destination point from 'this' point; the final bearing
 * will differ from the initial bearing by varying degrees according to distance and latitude.
 *
 * @param   {LatLon} point - Latitude/longitude of destination point.
 * @returns {number} Final bearing in degrees from north.
 */
LatLon.prototype.finalBearingTo = function(point) {
    // get initial bearing from destination point to this point & reverse it by adding 180°
    return ( point.bearingTo(this)+180 ) % 360;
}


/**
 * Returns the midpoint between 'this' point and the supplied point.
 *
 * @param   {LatLon} point - Latitude/longitude of destination point.
 * @returns {LatLon} Midpoint between this point and the supplied point.
 */
LatLon.prototype.midpointTo = function(point) {
    // see http://mathforum.org/library/drmath/view/51822.html for derivation

    var phi1 = this.lat.toRadians(), lamda1 = this.lon.toRadians();
    var phi2 = point.lat.toRadians();
    var deltalamda = (point.lon-this.lon).toRadians();

    var Bx = Math.cos(phi2) * Math.cos(deltalamda);
    var By = Math.cos(phi2) * Math.sin(deltalamda);

    var phi3 = Math.atan2(Math.sin(phi1)+Math.sin(phi2),
             Math.sqrt( (Math.cos(phi1)+Bx)*(Math.cos(phi1)+Bx) + By*By) );
    var lamda3 = lamda1 + Math.atan2(By, Math.cos(phi1) + Bx);
    lamda3 = (lamda3+3*Math.PI) % (2*Math.PI) - Math.PI; // normalise to -180..+180º

    return new LatLon(phi3.toDegrees(), lamda3.toDegrees());
}


/**
 * Returns the destination point from 'this' point having travelled the given distance on the
 * given initial bearing (bearing normally varies around path followed).
 *
 * @param   {number} brng - Initial bearing in degrees.
 * @param   {number} dist - Distance in km.
 * @returns {LatLon} Destination point.
 */
LatLon.prototype.destinationPoint = function(brng, dist) {
    // see http://williams.best.vwh.net/avform.htm#LL

    var theta = Number(brng).toRadians();
    var gamma = Number(dist) / this.radius; // angular distance in radians

    var phi1 = this.lat.toRadians();
    var lamda1 = this.lon.toRadians();

    var phi2 = Math.asin( Math.sin(phi1)*Math.cos(gamma) +
                        Math.cos(phi1)*Math.sin(gamma)*Math.cos(theta) );
    var lamda2 = lamda1 + Math.atan2(Math.sin(theta)*Math.sin(gamma)*Math.cos(phi1),
                             Math.cos(gamma)-Math.sin(phi1)*Math.sin(phi2));
    lamda2 = (lamda2+3*Math.PI) % (2*Math.PI) - Math.PI; // normalise to -180..+180º

    return new LatLon(phi2.toDegrees(), lamda2.toDegrees());
}


/**
 * Returns the point of intersection of two paths defined by point and bearing.
 *
 * @param   {LatLon} p1 - First point.
 * @param   {number} brng1 - Initial bearing from first point.
 * @param   {LatLon} p2 - Second point.
 * @param   {number} brng2 - Initial bearing from second point.
 * @returns {LatLon} Destination point (null if no unique intersection defined).
 */
LatLon.intersection = function(p1, brng1, p2, brng2) {
    // see http://williams.best.vwh.net/avform.htm#Intersection

    var phi1 = p1.lat.toRadians(), lamda1 = p1.lon.toRadians();
    var phi2 = p2.lat.toRadians(), lamda2 = p2.lon.toRadians();
    var theta13 = Number(brng1).toRadians(), theta23 = Number(brng2).toRadians();
    var deltaphi = phi2-phi1, deltalamda = lamda2-lamda1;

    var gamma12 = 2*Math.asin( Math.sqrt( Math.sin(deltaphi/2)*Math.sin(deltaphi/2) +
        Math.cos(phi1)*Math.cos(phi2)*Math.sin(deltalamda/2)*Math.sin(deltalamda/2) ) );
    if (gamma12 == 0) return null;

    // initial/final bearings between points
    var theta1 = Math.acos( ( Math.sin(phi2) - Math.sin(phi1)*Math.cos(gamma12) ) /
           ( Math.sin(gamma12)*Math.cos(phi1) ) );
    if (isNaN(theta1)) theta1 = 0; // protect against rounding
    var theta2 = Math.acos( ( Math.sin(phi1) - Math.sin(phi2)*Math.cos(gamma12) ) /
           ( Math.sin(gamma12)*Math.cos(phi2) ) );

    if (Math.sin(lamda2-lamda1) > 0) {
        var theta12 = theta1;
        var theta21 = 2*Math.PI - theta2;
    } else {
        var theta12 = 2*Math.PI - theta1;
        var theta21 = theta2;
    }

    var alpha1 = (theta13 - theta12 + Math.PI) % (2*Math.PI) - Math.PI; // angle 2-1-3
    var alpha2 = (theta21 - theta23 + Math.PI) % (2*Math.PI) - Math.PI; // angle 1-2-3

    if (Math.sin(alpha1)==0 && Math.sin(alpha2)==0) return null; // infinite intersections
    if (Math.sin(alpha1)*Math.sin(alpha2) < 0) return null;      // ambiguous intersection

    //alpha1 = Math.abs(alpha1);
    //alpha2 = Math.abs(alpha2);
    // ... Ed Williams takes abs of alpha1/alpha2, but seems to break calculation?

    var alpha3 = Math.acos( -Math.cos(alpha1)*Math.cos(alpha2) +
                         Math.sin(alpha1)*Math.sin(alpha2)*Math.cos(gamma12) );
    var gamma13 = Math.atan2( Math.sin(gamma12)*Math.sin(alpha1)*Math.sin(alpha2),
                          Math.cos(alpha2)+Math.cos(alpha1)*Math.cos(alpha3) )
    var phi3 = Math.asin( Math.sin(phi1)*Math.cos(gamma13) +
                        Math.cos(phi1)*Math.sin(gamma13)*Math.cos(theta13) );
    var deltalamda13 = Math.atan2( Math.sin(theta13)*Math.sin(gamma13)*Math.cos(phi1),
                           Math.cos(gamma13)-Math.sin(phi1)*Math.sin(phi3) );
    var lamda3 = lamda1 + deltalamda13;
    lamda3 = (lamda3+3*Math.PI) % (2*Math.PI) - Math.PI; // normalise to -180..+180º

    return new LatLon(phi3.toDegrees(), lamda3.toDegrees());
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/**
 * Returns the distance travelling from 'this' point to destination point along a rhumb line.
 *
 * @param   {LatLon} point - Latitude/longitude of destination point.
 * @returns {number} Distance in km between this point and destination point.
 */
LatLon.prototype.rhumbDistanceTo = function(point) {
    // see http://williams.best.vwh.net/avform.htm#Rhumb

    var R = this.radius;
    var phi1 = this.lat.toRadians(), phi2 = point.lat.toRadians();
    var deltaphi = phi2 - phi1;
    var deltalamda = Math.abs(point.lon-this.lon).toRadians();
    // if dLon over 180° take shorter rhumb line across the anti-meridian:
    if (Math.abs(deltalamda) > Math.PI) deltalamda = deltalamda>0 ? -(2*Math.PI-deltalamda) : (2*Math.PI+deltalamda);

    // on Mercator projection, longitude gets increasing stretched by latitude; q is the 'stretch factor'

    var deltapsi = Math.log(Math.tan(phi2/2+Math.PI/4)/Math.tan(phi1/2+Math.PI/4));

    // the stretch factor becomes ill-conditioned along E-W line (0/0); use empirical tolerance to avoid it
    var q = Math.abs(deltapsi) > 10e-12 ? deltaphi/deltapsi : Math.cos(phi1);

    // distance is pythagoras on 'stretched' Mercator projection
    var gamma = Math.sqrt(deltaphi*deltaphi + q*q*deltalamda*deltalamda); // angular distance in radians
    var dist = gamma * R;

    return dist.toPrecisionFixed(4); // 4 sig figs reflects typical 0.3% accuracy of spherical model
}


/**
 * Returns the bearing from 'this' point to destination point along a rhumb line.
 *
 * @param   {LatLon} point - Latitude/longitude of destination point.
 * @returns {number} Bearing in degrees from north.
 */
LatLon.prototype.rhumbBearingTo = function(point) {
    var phi1 = this.lat.toRadians(), phi2 = point.lat.toRadians();
    var deltalamda = (point.lon-this.lon).toRadians();
    // if dLon over 180° take shorter rhumb line across the anti-meridian:
    if (Math.abs(deltalamda) > Math.PI) deltalamda = deltalamda>0 ? -(2*Math.PI-deltalamda) : (2*Math.PI+deltalamda);

    var deltapsi = Math.log(Math.tan(phi2/2+Math.PI/4)/Math.tan(phi1/2+Math.PI/4));

    var theta = Math.atan2(deltalamda, deltapsi);

    return (theta.toDegrees()+360) % 360;
}


/**
 * Returns the destination point having travelled along a rhumb line from 'this' point the given
 * distance on the  given bearing.
 *
 * @param   {number} brng - Bearing in degrees from north.
 * @param   {number} dist - Distance in km.
 * @returns {LatLon} Destination point.
 */
LatLon.prototype.rhumbDestinationPoint = function(brng, dist) {
    var gamma = Number(dist) / this.radius; // angular distance in radians
    var phi1 = this.lat.toRadians(), lamda1 = this.lon.toRadians();
    var theta = Number(brng).toRadians();

    var deltaphi = gamma * Math.cos(theta);

    var phi2 = phi1 + deltaphi;
    // check for some daft bugger going past the pole, normalise latitude if so
    if (Math.abs(phi2) > Math.PI/2) phi2 = phi2>0 ? Math.PI-phi2 : -Math.PI-phi2;

    var deltapsi = Math.log(Math.tan(phi2/2+Math.PI/4)/Math.tan(phi1/2+Math.PI/4));
    var q = Math.abs(deltapsi) > 10e-12 ? deltaphi / deltapsi : Math.cos(phi1); // E-W course becomes ill-conditioned with 0/0

    var deltalamda = gamma*Math.sin(theta)/q;

    var lamda2 = lamda1 + deltalamda;

    lamda2 = (lamda2 + 3*Math.PI) % (2*Math.PI) - Math.PI; // normalise to -180..+180º

    return new LatLon(phi2.toDegrees(), lamda2.toDegrees());
}


/**
 * Returns the loxodromic midpoint (along a rhumb line) between 'this' point and second point.
 *
 * @param   {LatLon} point - Latitude/longitude of second point.
 * @returns {LatLon} Midpoint between this point and second point.
 */
LatLon.prototype.rhumbMidpointTo = function(point) {
    // http://mathforum.org/kb/message.jspa?messageID=148837

    var phi1 = this.lat.toRadians(), lamda1 = this.lon.toRadians();
    var phi2 = point.lat.toRadians(), lamda2 = point.lon.toRadians();

    if (Math.abs(lamda2-lamda1) > Math.PI) lamda1 += 2*Math.PI; // crossing anti-meridian

    var phi3 = (phi1+phi2)/2;
    var f1 = Math.tan(Math.PI/4 + phi1/2);
    var f2 = Math.tan(Math.PI/4 + phi2/2);
    var f3 = Math.tan(Math.PI/4 + phi3/2);
    var lamda3 = ( (lamda2-lamda1)*Math.log(f3) + lamda1*Math.log(f2) - lamda2*Math.log(f1) ) / Math.log(f2/f1);

    if (!isFinite(lamda3)) lamda3 = (lamda1+lamda2)/2; // parallel of latitude

    lamda3 = (lamda3 + 3*Math.PI) % (2*Math.PI) - Math.PI; // normalise to -180..+180º

    return new LatLon(phi3.toDegrees(), lamda3.toDegrees());
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */


/**
 * Returns a string representation of 'this' point, formatted as degrees, degrees+minutes, or
 * degrees+minutes+seconds.
 *
 * @param   {string} [format=dms] - Format point as 'd', 'dm', 'dms'.
 * @param   {number} [dp=0|2|4] - Number of decimal places to use - default 0 for dms, 2 for dm, 4 for d.
 * @returns {string} Comma-separated latitude/longitude.
 */
LatLon.prototype.toString = function(format, dp) {
    if (typeof format == 'undefined') format = 'dms';

    return Geo.toLat(this.lat, format, dp) + ', ' + Geo.toLon(this.lon, format, dp);
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */


/** Extend Number object with method to convert numeric degrees to radians */
if (typeof Number.prototype.toRadians == 'undefined') {
    Number.prototype.toRadians = function() { return this * Math.PI / 180; }
}


/** Extend Number object with method to convert radians to numeric (signed) degrees */
if (typeof Number.prototype.toDegrees == 'undefined') {
    Number.prototype.toDegrees = function() { return this * 180 / Math.PI; }
}


/** Extend Number object with method to format significant digits of a number,
 * using only fixed-point notation (without exponential) */
if (typeof Number.prototype.toPrecisionFixed == 'undefined') {
    Number.prototype.toPrecisionFixed = function(precision) {

        // use standard toPrecision method
        var n = this.toPrecision(precision);

        // ... but replace +ve exponential format with trailing zeros
        n = n.replace(/(.+)e\+(.+)/, function(n, sig, exp) {
            sig = sig.replace(/\./, '');       // remove decimal from significand
            var l = sig.length - 1;
            while (exp-- > l) sig = sig + '0'; // append zeros from exponent
            return sig;
        });

        // ... and replace -ve exponential format with leading zeros
        n = n.replace(/(.+)e-(.+)/, function(n, sig, exp) {
            sig = sig.replace(/\./, '');       // remove decimal from significand
            while (exp-- > 1) sig = '0' + sig; // prepend zeros from exponent
            return '0.' + sig;
        });

        return n;
    }
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
if (!window.console) window.console = { log: function() {} };
