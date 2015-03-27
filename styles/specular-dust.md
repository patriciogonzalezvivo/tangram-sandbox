Style by [@patriciogv](https://twitter.com/patriciogv)

Source Code: [style](https://github.com/patriciogonzalezvivo/tangram-sandbox/blob/gh-pages/styles/specular-dust.yaml) | [tangram](https://github.com/tangrams/tangram)| [patterns](http://tangrams.github.io/ProceduralTextures/)

<a href="code.html#shaders/random.frag"><canvas class="canvas" data-fragment-url="shaders/random.frag" width="200px" height="200px"></canvas></a>
#### Procedural random

<a href="code.html#shaders/fbm.frag"><canvas class="canvas" data-fragment-url="shaders/fbm.frag" width="200px" height="200px"></canvas></a>
#### Procedural fractional brownian motion

```yaml
lights:
    light1:
        type: directional
        direction: [0, 1, -.5]
        diffuse: .3
        ambient: .1
    light2:
        type: point
        position: [0, 200, 700]
        origin: ground
        ambient: .15
        diffuse: .15
        specular: [.6,.6,.0]
    light3:
        type: point
        position: [200, -100, 200]
        origin: ground
        ambient: .15
        diffuse: .15
        specular: [.0,0.4,.9]
    light4:
        type: point
        position: [-200, -100, 300]
        origin: ground
        ambient: .15
        diffuse: .15
        specular: [.5,0.,.5]
```