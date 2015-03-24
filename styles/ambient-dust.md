Source Code: [style](https://github.com/patriciogonzalezvivo/tangram-sandbox/blob/gh-pages/styles/ambient-dust.yaml) | [tangram](https://github.com/tangrams/tangram)| [patterns](http://tangrams.github.io/ProceduralTextures/)

<a href="code.html#shaders/random.frag"><canvas class="canvas" data-fragment-url="shaders/random.frag" width="200px" height="200px"></canvas></a>
#### Procedural random

<a href="code.html#shaders/noise.frag"><canvas class="canvas" data-fragment-url="shaders/noise.frag" width="200px" height="200px"></canvas></a>
#### Procedural noise

<a href="code.html#shaders/fbm.frag"><canvas class="canvas" data-fragment-url="shaders/fbm.frag" width="200px" height="200px"></canvas></a>
#### Procedural fractional brownian motion

```yaml
lights:
    light1:
        type: directional
        direction: [0, 1, -.5]
        diffuse: .5
        ambient: .2
    light2:
        type: point
        position: [0, 0, 300px]
        origin: ground
        ambient: .3
        diffuse: .5
        specular: .2
```