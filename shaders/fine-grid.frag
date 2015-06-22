// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }
float noise(vec2 x) {
    vec2 i = floor(x);
    vec2 f = fract(x);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
float fbm( in vec2 p ){
    float s = 0.0;
    float m = 0.0;
    float a = 0.5;
    for(int i=0; i<2; i++ ){
        s += a * noise(p);
        m += a;
        a *= 0.5;
        p *= 2.0;
    }
    return s/m;
}
bool grid(vec2 _pos, float _res){
    vec2 grid = fract(_pos*_res*250.);
    return grid.x < _res || grid.y < _res;
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy-vec2(.5);
    st.x *= u_resolution.x/u_resolution.y;
  
    vec3 color = mix(   vec3(0.5), 
                        vec3(0.), 
                        dot(st,st) + (fbm(gl_FragCoord.xy*0.6)*0.1) );

    if(grid(st,0.01)) color += vec3(0.05);
    if(grid(st,0.1)) color += vec3(0.02);

    gl_FragColor = vec4(color,1.0);
}