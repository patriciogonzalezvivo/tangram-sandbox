// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random (in float _x) {
    return fract(sin(_x)*1e4);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec3 _p) {
    vec3 step = vec3(110.0, 241.0, 171.0);

    vec3 i = floor(_p);
    vec3 f = fract(_p);

    float n = dot(i, step);

    vec3 u = f * f * (3.0 - 2.0 * f);
    return mix( mix(mix(random(n + dot(step, vec3(0,0,0))),
                        random(n + dot(step, vec3(1,0,0))),
                        u.x),
                    mix(random(n + dot(step, vec3(0,1,0))),
                        random(n + dot(step, vec3(1,1,0))),
                        u.x), 
                u.y),
                mix(mix(random(n + dot(step, vec3(0,0,1))),
                        random(n + dot(step, vec3(1,0,1))),
                        u.x),
                    mix(random(n + dot(step, vec3(0,1,1))),
                        random(n + dot(step, vec3(1,1,1))),
                        u.x),
                u.y),
            u.z);
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

float lines(in vec2 _pos, float _angle, float _b){
    float scale = 10.0;
    _pos *= scale;
    _pos = rotate2d( _angle ) * _pos;
    return smoothstep(0.0,
                    0.5+_b*0.5,
                    abs((sin(_pos.x*3.1415)+_b*2.0))*0.5);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    vec3 pos = vec3(st*2.0,u_time*0.25)*vec3(3.0,1.,1.0);
    float pattern = lines( pos.xy+noise(pos), 0.5, noise(pos*1.5) );

    gl_FragColor = vec4(vec3(pattern),1.0);
}