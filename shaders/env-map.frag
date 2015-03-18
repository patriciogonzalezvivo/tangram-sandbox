// Created by patricio gonzalez vivo - 2015
// http://shiny.ooo/~patriciogv/

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

uniform sampler2D u_tex0;
uniform vec2 u_tex0Resolution;

// LIGHT Functions and Structs
struct Light { vec3 ambient, diffuse, specular; };
struct DirectionalLight { Light emission; vec3 direction; };
struct PointLight { Light emission; vec3 position; };
struct Material { Light bounce; vec3 emission; float shininess;};

void computeLight(in DirectionalLight _light, in Material _material, in vec3 _pos, in vec3 _normal, inout Light _accumulator ){
    _accumulator.ambient += _light.emission.ambient;

    float diffuseFactor = max(0.0,dot(_normal,-_light.direction));
    _accumulator.diffuse += _light.emission.diffuse * diffuseFactor;

    if (diffuseFactor > 0.0) {
        vec3 reflectVector = reflect(_light.direction, _normal);
        float specularFactor = max(0.0,pow( dot(normalize(_pos), reflectVector), _material.shininess));
        _accumulator.specular += _light.emission.specular * specularFactor;
    }

}

void computeLight(in PointLight _light, in Material _material, in vec3 _pos, in vec3 _normal, inout Light _accumulator ){
    float dist = length(_light.position - _pos);
    vec3 lightDirection = (_light.position - _pos)/dist;

    _accumulator.ambient += _light.emission.ambient;

    float diffuseFactor = max(0.0,dot(lightDirection,_normal));
    _accumulator.diffuse += _light.emission.diffuse * diffuseFactor;

    if (diffuseFactor > 0.0) {
        vec3 reflectVector = reflect(-lightDirection, _normal);
        float specularFactor = max(0.0,pow( dot(-normalize(_pos), reflectVector), _material.shininess));
        _accumulator.specular += _light.emission.specular * specularFactor;
    }
}

vec3 calculate(in Material _material, in Light _light){
    vec3 color = vec3(0.0);
    color += _material.emission;
    color += _material.bounce.ambient * _light.ambient;
    color += _material.bounce.diffuse * _light.diffuse;
    color += _material.bounce.specular * _light.specular;
    return color;
}

vec3 rim (in vec3 _normal, in float _pct) {
    float cosTheta = abs( dot( vec3(0.0,0.0,-1.0) , _normal));
    return vec3( _pct * ( 1. - smoothstep( 0.0, 1., cosTheta ) ) );
}

vec3 calculateSEM(in sampler2D _tex, in vec3 _eyeToPoint, in vec3 _normal ) {
    vec3 r = reflect( normalize(_eyeToPoint), _normal);
    r.z = 1.;
    float m = 2. * length(r);
    vec2 uv = r.xy / m + .5;
    return texture2D(_tex, 1.0-uv).rgb;
}

// SPHERE functions
vec3 sphereNormal(vec2 uv) {
    uv = fract(uv)*2.0-1.0; 
    vec3 ret;
    ret.xy = sqrt(uv * uv) * sign(uv);
    ret.z = sqrt(abs(1.0 - dot(ret.xy,ret.xy)));
    return ret * 0.5 + 0.5;
}

// SCENE Definitions
//---------------------------------------------------

//  Light accumulator
Light l = Light(vec3(0.0),vec3(0.0),vec3(0.0)); 

//  Material
Material m = Material(Light(vec3(0.8),vec3(0.8),vec3(0.2)),vec3(0.0),2.0);

// Lights
DirectionalLight a = DirectionalLight(Light(vec3(0.1),vec3(0.3,0.6,0.6),vec3(1.0)),vec3(1.0));
PointLight b = PointLight(Light(vec3(0.1),vec3(0.6,0.6,0.3),vec3(0.5)),vec3(1.0));

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    vec3 normal = normalize(sphereNormal(st)*2.0-1.0);
    vec3 pos = normal*1.0;

    // Load diffuse if there is one
    if(u_tex0Resolution != vec2(0.0)){
        float aspect = u_tex0Resolution.x/u_tex0Resolution.y;
        m.emission = calculateSEM(u_tex0,normal);
        // m.bounce.ambient = calculateSEM(u_tex0,normal);
        // m.bounce.diffuse = calculateSEM(u_tex0,normal);
        // m.bounce.specular = calculateSEM(u_tex0,normal);
    }
    
    // a.direction = vec3(cos(u_time),0.0,sin(u_time));
    // computeLight(a,m,pos,normal,l);
  
    // b.position = vec3(-cos(u_time*0.25),cos(u_time*0.5),sin(u_time*0.5))*2.0;
    // computeLight(b,m,pos,normal,l);
  
    color = calculate(m,l);
    // color += rim(normal, 0.5);
  
    // turn black the area around the sphere;
    float radius = length( vec2(0.5)-st )*2.0;
    color = mix(color,mix(color,vec3(0.0),1.0-radius*0.2),smoothstep(0.99,1.0,radius));
  
    gl_FragColor = vec4(color, 1.0);
}