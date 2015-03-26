// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision highp float;
#endif
                                   
uniform sampler2D u_tex0;
uniform vec2 u_tex0Resolution;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float hatch ( sampler2D hatchmap, vec2 st, float brightness ){
    brightness = clamp(brightness,0.,0.9999999);
    vec2 pos1 = vec2(floor(brightness*9.0)/3.,
                     floor(brightness*3.0)/3.);

    float minBrightness = clamp(brightness-0.111111111,0.,1.0);
    vec2 pos2 = vec2(floor(minBrightness*9.0)/3.,
                     floor(minBrightness*3.0)/3.);

    return mix(texture2D( hatchmap,fract(pos1+fract(st)/3.)).a,
               texture2D( hatchmap,fract(pos2+fract(st)/3.)).a,
               1.0-fract(brightness*9.0));
}

void main(){
   vec2 st = gl_FragCoord.st/u_resolution.xy;
   float b = length(st-0.5)*2.;
   vec3 color = vec3(1.0);
   color -= hatch(u_tex0,st*2.,b);
   gl_FragColor = vec4(color,1.);
}