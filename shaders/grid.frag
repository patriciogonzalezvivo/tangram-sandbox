// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float grid (in vec2 _pos, in float _zoom, in float _lineWidth){
    _pos = fract(_pos*_zoom);
    vec2 g = smoothstep(vec2(0.5-_lineWidth),vec2(0.5),_pos) - 
             smoothstep(vec2(0.5),vec2(0.5+_lineWidth),_pos);
    return clamp(g.x+g.y,0.0,1.0);
}

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

void main(){

  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  vec3 color = vec3( 0.0 );
  color = vec3( grid(st,10.,0.05+noise(st*5.+u_time*2.)*0.1 ) );
  // color = vec3( grid(st,10.,0.05+abs(sin(u_time))*0.1 ) );

  gl_FragColor = vec4(color,1.0);
}