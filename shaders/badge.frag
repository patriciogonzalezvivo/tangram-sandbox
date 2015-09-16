// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float shape(vec2 st, int N){
    st = st *2.-1.;
    float a = atan(st.x,st.y)+PI;
    float r = TWO_PI/float(N);
    return cos(floor(.5+a/r)*r-a)*length(st);
}

// Antialiazed Step function
// from http://webstaff.itn.liu.se/~stegu/webglshadertutorial/shadertutorial.html
float aastep(float threshold, float value) {
    #ifdef GL_OES_standard_derivatives
    float afwidth = 0.7 * length(vec2(dFdx(value), dFdy(value)));
    return smoothstep(threshold-afwidth, threshold+afwidth, value);
    #else
    return step(threshold, value);
    #endif
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    vec3 background = vec3(1.0,0.0,0.0);
    vec3 foreground = vec3(1.0);
    vec3 color = vec3(0.0);
    float d = 0.0;

    int sides = int(3.+mod(u_time,5.));
    float size = .8;
    vec2 offset = vec2(0.0);

    if (sides == 3){
        // Scale and translate triangle
        size *= .7;
        offset = vec2(0.,.1);
    } else if (sides == 6) {
        // Rotate hexagon
        st = st.yx; 
    } else if (sides == 7) {
        // Make circle
        sides = 360; 
    }

    d = shape(st+offset,sides);

    color = vec3(d);
    color = background*(1.0-aastep(size,d));
    color = mix(color,foreground,1.0-aastep(size,d*1.5));

    gl_FragColor = vec4(color,1.0);
}