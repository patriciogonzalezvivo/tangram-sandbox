// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

float getHatch(in vec2 _pos, float _angle, float _brigtness){
    float scale = 20.0;
    _pos *= scale;
    _pos = rotate2d( _angle ) * _pos;
    return 1.0-smoothstep(-1.+_brigtness*2.0,1.,abs(sin(_pos.x*PI)));
}

void main(){

  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st.x *= u_resolution.x/u_resolution.y;
  
  float pattern = getHatch( u_time*0.1+st.xy*0.5, PI*0.5, 0.5);
  vec3 color = vec3( pattern*sin(smoothstep(0.0,1.,st.x)*PI) );

  gl_FragColor = vec4(color,1.0);
}