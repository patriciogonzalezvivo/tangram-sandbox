// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 mirrorTile(vec2 _st, vec2 _zoom){
    _st *= _zoom;
    if (fract(_st.y * 0.5) > 0.5){
        _st.x = _st.x+0.5;
        _st.y = 1.0-_st.y;
    }
    return fract(_st);
}

float fillY(vec2 _st, float _pct,float _antia){
  return smoothstep( _pct-_antia, _pct, _st.y);
}

float chevron(vec2 st){
	st = mirrorTile(st,vec2(1.,6.));
	float x = st.x*2.; 
	float a = floor(1.+sin(x*3.14));
	float b = floor(1.+sin((x+1.)*3.14));
	float f = fract(x);
  	return fillY(st,mix(a,b,f),0.01);
}

float stripes(vec2 st){
    st = st*10.;
    return step(.5,1.0-smoothstep(.3,1.,abs(sin(st.y*3.1415))));
}

float xMargin(vec2 st,float margin){
    return 1.0-clamp(step(margin*.5,st.x)*step(margin*.5,1.0-st.x),0.,1.);
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
	vec3 color = vec3(0.0);

    // Nathaniel un-comment the following lines
	color = vec3( chevron(st) - xMargin(st,.25) );
    // color = vec3( stripes(st) );
    // color = vec3( stripes(st) - xMargin(st,.95) ) ;

	gl_FragColor = vec4( color, 1.0 );
}