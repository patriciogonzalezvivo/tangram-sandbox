![floor normal-map](imgs/normal-0027.jpg)

```glsl
vec2 st = fract(v_world_position.xy*0.07);

if ( dot(v_normal,vec3(0.,0.,1.)) == 0.0 ){
    // Is a wall
    // DO BRICK PATTERN
} else {
    // Is a roof
    // DO LEGO CIRCLES normals
}
```

<a href="code.html#shaders/brick.frag"><canvas class="canvas" data-fragment-url="shaders/brick.frag" width="350px" height="350px"></canvas></a>
#### Procedural brick pattern

<a href="code.html#shaders/lego.frag"><canvas class="canvas" data-fragment-url="shaders/lego.frag" width="350px" height="350px"></canvas></a>
#### Procedural brick pattern
