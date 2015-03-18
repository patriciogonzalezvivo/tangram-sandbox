// Created by patricio gonzalez vivo - 2015
// http://shiny.ooo/~patriciogv/

#ifdef GL_ES
precision mediump float;
#endif

const float PI = 3.1415926535897932384626433832795;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    
    vec3 color = vec3(0.0);

    float pattern = st.x*2.0-1.;
    // color.rgb = vec3(mix( vec3(0.282,0.133,0.063), vec3(0.4, 0.3, 0.2) , pattern) );
    // color.rgb = mix(vec3(0.2,0.15,0.1),color.rgb,smoothstep(0.0,0.2,pattern));
    // color.rgb = mix(color.rgb,vec3(0.878,0.651,0.471),smoothstep(0.8,1.0,pattern))*1.2;
  
    vec3 pct = vec3(st.x);
    vec3 colorA = vec3(0.282,0.133,0.063);
    vec3 colorB = vec3(1.000,0.870,0.624);
    vec3 colorC = vec3(0.6,0.25,0.1354);
    color = mix(colorA,colorB, smoothstep(0.,1.,pattern));
    color = mix(color,colorC,smoothstep(0.,-1.,pattern));

    gl_FragColor = vec4(color, 1.0);
}