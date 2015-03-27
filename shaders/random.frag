// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float random (in float _x) {
    return fract(sin(_x)*1e4);
}

float random (in vec2 _st) { 
    return fract(sin(dot(_st.xy ,vec2(12.9898,78.233))) * 43758.5453123);
}

float random(in vec3 _st){ 
    return fract(sin(dot(_st.xyz, vec3(12.9898,78.233,32.4355)))* 43758.5453123);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec3 color = vec3(1.0);

    st *= 20.;
    float t = u_time*0.0001;
    vec2 ipos = floor(st);
    float rnd = random(vec3(ipos,t));
    color *= rnd*rnd;

    gl_FragColor = vec4(color,1.0);
}