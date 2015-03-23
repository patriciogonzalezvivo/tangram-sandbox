// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float rows = 10.0;

vec2 brickTile(vec2 _st, float _zoom){
  _st *= _zoom;
  if (fract(_st.y * 0.5) > 0.5){
      _st.x += 0.5;
  }
  return fract(_st);
}

vec2 rotate2D(vec2 _st, float _angle){
  _st -= 0.5;
  _st =  mat2(cos(_angle),-sin(_angle),
              sin(_angle),cos(_angle)) * _st;
  _st += 0.5;
  return _st;
}

void main(){

  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  vec2 pos = brickTile(st,rows);

  float angle = PI*0.25*cos(u_time*0.5);

  if (fract(st.y * 0.5 * rows) > 0.5){
    angle *= -1.0;
  }

  pos = rotate2D(pos,angle);

  pos *= 2.0;
  float pct = (1.0+cos(PI*pos.x))*0.5;

  vec3 color = vec3( 1.0-smoothstep( 0.5,0.6, pow(pct,pos.y) ) * 1.0-smoothstep( 0.79,0.81, pow(pct,2.0-pos.y ) ));

  gl_FragColor = vec4(color,1.0);
}