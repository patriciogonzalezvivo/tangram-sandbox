// Created by patricio gonzalez vivo - 2015
// http://shiny.ooo/~patriciogv/

#ifdef GL_ES
precision mediump float;
#endif

const float PI = 3.1415926535897932384626433832795;

uniform sampler2D u_tex0;
uniform vec2 u_tex0Resolution;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random (in vec2 _st) { 
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))* 
        43758.5453123);
}

float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) + 
            (c - a)* u.y * (1.0 - u.x) + 
            (d - b) * u.x * u.y;
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    float b = texture2D(u_tex0,st).r;

    float scale = 50.0;
    float angle = (u_time*0.1);//+noise(st*2.0)*0.5;
    st *= scale;
   
    st = rotate2d( angle ) * st;

    float pct = 1.0-smoothstep(-1.+b*2.0,1.,abs(sin(st.x*PI)));

    vec3 color = vec3(smoothstep(0.2,0.5,pct));
    gl_FragColor = vec4(color, 1.0);
}