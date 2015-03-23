Source Code: [style](https://github.com/patriciogonzalezvivo/tangram-sandbox/blob/gh-pages/styles/lego.yaml) | [tangram](https://github.com/tangrams/tangram) | [patterns](http://tangrams.github.io/ProceduralTextures/)

Inspiration: [Lego building blocks](http://cache.lego.com/r/www/r/city/-/media/franchises/lego%20city/panorama/img2600x2000_crosspromotion_gv.jpg)

[![floor normal-map](imgs/normal-0027.jpg)](imgs/normal-0027.jpg)

```glsl
vec2 st = fract(v_world_position.xy*0.07);

if (dot(v_normal,vec3(0.,0.,1.)) == 0.0){
    // Is a wall
} else {
    // Is a roof
}
```

<a href="code.html#shaders/brick.frag"><canvas class="canvas" data-fragment-url="shaders/brick.frag" width="200px" height="200px"></canvas></a>
#### Procedural brick pattern

<a href="code.html#shaders/lego.frag"><canvas class="canvas" data-fragment-url="shaders/lego.frag" width="200px" height="200px"></canvas></a>
#### Procedural brick pattern
