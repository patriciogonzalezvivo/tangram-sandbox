// Created by patricio gonzalez vivo - 2015
// http://shiny.ooo/~patriciogv/

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926535897932384626433832795

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 tile(vec2 _st, float _zoom){
  _st *= _zoom;
  return fract(_st);
}

float circle(vec2 _st, float _radius){
  vec2 pos = vec2(0.5)-_st;
  _radius *= 0.75;
  return 1.-smoothstep(_radius-(_radius*0.01),_radius+(_radius*0.01),dot(pos,pos)*3.14);
}

float box(vec2 _st, vec2 _size){
  _size = vec2(0.5)-_size*0.5;
  vec2 uv = smoothstep(_size,_size+vec2(0.0001),_st);
  uv *= smoothstep(_size,_size+vec2(0.0001),vec2(1.0)-_st);
  return uv.x*uv.y;
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 normal = vec3(0.0);

    vec2 pos = st-0.5;
    normal = vec3(pos*2.0,1.0)*(1.0-vec3(box(st,vec2(0.95))));

    st = tile(st,2.);

    pos = st-0.5;
    float a = atan(pos.y,pos.x);
    
    normal += vec3(cos(a),sin(a),0.)*circle(st,0.5);
    normal *= 1.0-circle(st,0.4);
    normal.b = 1.0;

    gl_FragColor = vec4(normal*0.5+0.5,1.0);
}