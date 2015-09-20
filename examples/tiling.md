http://www.sitepoint.com/the-cicada-principle-and-why-it-matters-to-web-designers/

https://www.shadertoy.com/view/4tsGzf

http://www.mitchchn.me/2014/os-x-terminal/?x

‘’’
            blocks:
                global: |
                    vec4 TileTexture(sampler2D tex, float scale) {
                        vec2 IN = TileCoords()*scale;
                        vec2 OUT = TileCoords()*scale*2.;
                        return mix(texture2D(tex,fract(IN)), texture2D(tex,fract(OUT)), fract(u_map_position.z));
                    }
                    
                    vec3 hash3(vec2 p) { 
                        return fract(sin(vec3( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)), dot(p,vec2(419.2,371.9)) ))*43758.5453); 
                    }
                    vec4 textureNoTile(sampler2D tex, vec2 x, float v) {
                        vec2 p = floor(x);
                        vec2 f = fract(x);

                        vec4 va = vec4(0.0);
                        float wt = 0.0;
                        for (int j=-1; j<=1; j++) {
                            for (int i=-1; i<=1; i++ ) {
                                vec2 g = vec2( float(i),float(j) );
                                vec3 o = hash3( p + g );
                                vec2 r = g - f + o.xy;
                                float d = dot(r,r);
                                float w = pow( 1.0 - smoothstep(0.0,2.0,dot(d,d)), 1.0 + 16.0*v );
                                vec4 c = texture2D(tex, fract(.2*x + v*o.zy) );
                                va += w*c;
                                wt += w;
                            }
                        }
                        return va/wt;
                    }
                color: |
                    float pattern = 0.0;
                    float f = smoothstep( 0.4, 0.6, sin(u_time) );
                    
                    pattern = 1.0 - textureNoTile(u_hatch, v_world_position.xy*.005, f).a;
                    // pattern = 1.0-TileTexture(u_hatch,3.).a;
                    color.rgb = mix(vec3(0.271,0.267,0.243), vec3(0.949,0.957,0.949), pattern);
‘’’