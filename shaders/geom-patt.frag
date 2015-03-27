// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926535897932384626433832795

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float shape(float _radius, float _shape){
  return 1.-smoothstep(_shape-(_shape*0.01),_shape+(_shape*0.01),_radius);
}

float circle(vec2 _st, float _radius){
  vec2 pos = vec2(0.5)-_st;
  _radius *= 0.75;
  return 1.-smoothstep(_radius-(_radius*0.01),_radius+(_radius*0.01),dot(pos,pos)*3.14);
}

float random (in float _x) {
    return fract(sin(_x)*1e4);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in float _x) {
    float i = floor(_x);
    float f = fract(_x);
    float u = f * f * (3.0 - 2.0 * f);
    return mix(random(i), random(i + 1.0), u);
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    
    vec3 color = vec3(0.0);

    vec2 pos = vec2(0.5)-st;

    float r = length(pos)*2.0;
    float a = atan(pos.y,pos.x)+noise(u_time*0.5)*3.14;

    float f = abs(cos(a*12.)*sin(a*3.))*.6+0.15;
    
    color = vec3( shape(r,f));

    gl_FragColor = vec4(color, 1.0);
}