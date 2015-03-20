// Created by patricio gonzalez vivo - 2015
// http://shiny.ooo/~patriciogv/

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

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    vec2 pos = vec2(0.5)-st;

    float r = length(pos)*2.0;
    float a = atan(pos.y,pos.x);

    float shape1 = 0.5-0.2*cos(a*5.0);
    float shape2 = 0.15-0.03*cos(a*5.0);

    color = vec3( shape(r,shape1));
    color -= vec3( shape(r,shape2));
    color += vec3( circle(st,0.0005));

    gl_FragColor = vec4(color, 1.0);
}