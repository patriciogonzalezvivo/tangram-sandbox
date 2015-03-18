#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

// Based on Morgan
// https://www.shadertoy.com/view/4dS3Wd
float random (in float _x) {
    return fract(sin(_x)*1e4);
}

float random (in vec2 _st) { 
    // return fract(sin(dot(_st.xy ,vec2(12.9898,78.233))) * 43758.5453123);
    return fract( 1e4 * sin(17.0 * _st.x + _st.y * 0.1) * (0.1 + abs(sin(_st.y * 13.0 + _st.x)))); 
}

float noise (in float _x) {
    float i = floor(_x);
    float f = fract(_x);
    float u = f * f * (3.0 - 2.0 * f);
    return mix(random(i), random(i + 1.0), u);
}

float noise (in vec2 _st){
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Simple 2D lerp using smoothstep envelope between the values.
    // return vec3(mix(mix(a, b, smoothstep(0.0, 1.0, f.x)),
    //          mix(c, d, smoothstep(0.0, 1.0, f.x)),
    //          smoothstep(0.0, 1.0, f.y)));

    // Same code, with the clamps in smoothstep and common subexpressions
    // optimized away.
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float noise (in vec3 _p) {
    const vec3 step = vec3(110.0, 241.0, 171.0);

    vec3 i = floor(_p);
    vec3 f = fract(_p);
 
    // For performance, compute the base input to a 1D random from the integer part of the argument and the 
    // incremental change to the 1D based on the 3D -> 1D wrapping
    float n = dot(i, step);

    vec3 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix( random(n + dot(step, vec3(0, 0, 0))), random(n + dot(step, vec3(1, 0, 0))), u.x),
                   mix( random(n + dot(step, vec3(0, 1, 0))), random(n + dot(step, vec3(1, 1, 0))), u.x), u.y),
               mix(mix( random(n + dot(step, vec3(0, 0, 1))), random(n + dot(step, vec3(1, 0, 1))), u.x),
                   mix( random(n + dot(step, vec3(0, 1, 1))), random(n + dot(step, vec3(1, 1, 1))), u.x), u.y), u.z);
}

#define NUM_OCTAVES 5

float fbm ( in float _x) {
    float v = 0.0;
    float a = 0.5;
    float shift = float(100.0);
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_x);
        _x = _x * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}


float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}


float fbm ( in vec3 _p) {
    float v = 0.0;
    float a = 0.5;
    vec3 shift = vec3(100);
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_p);
        _p = _p * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

const float pi          = 3.1415926535;
const float inf         = 1.0 / 0.0;
float square(float x) { return x * x; }
float infIfNegative(float x) { return (x >= 0.0) ? x : inf; }

// C = sphere center, r = sphere radius, P = ray origin, w = ray direction
float intersectSphere (vec3 C, float r, vec3 P, vec3 w) {   
    vec3 v = P - C;
    float b = -dot(w, v);
    float c = dot(v, v) - square(r);
    float d = (square(b) - c);
    if (d < 0.0) { return inf; }    
    float dsqrt = sqrt(d);
    
    // Choose the first positive intersection
    return min(infIfNegative((b - dsqrt)), infIfNegative((b + dsqrt)));
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    // color = vec3( fbm(vec3(st*5.,u_time*0.1)) );

    float v = 0.0;

    const float verticalFieldOfView = 25.0 * pi / 180.0;        
    vec3 P = vec3(cos(u_time),sin(u_time), 8.0);
    vec3 w = normalize(vec3(gl_FragCoord.xy - u_resolution.xy / vec2(2.0, 2.0), 
                            (u_resolution.y / 2.0) / (-2.0 * tan(verticalFieldOfView / 2.0))));

    float t = intersectSphere(vec3(0.0), 1.0, P, w);
    vec3 X = P + w * t;
    v = fbm(X * 10.0);

    color = vec3(v);

    gl_FragColor = vec4(color,1.0);
}