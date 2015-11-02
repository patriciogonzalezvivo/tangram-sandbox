<!-- .slide: data-background="#ffff" -->

CPU

![](imgs/CPU.png)

**+** [more information about tangram's styles](https://mapzen.com/documentation/tangram/Styles-Overview/)


```yaml
scene:
    background: 
        color: white
layers:
    water:
        data: { source: osmTile }
        draw:
            lines:
                order: 2
                color: '#353535'
                width: 3px
    earth:
        data: { source: osmTile }
        draw:
            lines:
                order: 0
                color: '#555'
                width: 2px
    landuse:
        data: { source: osmTile }
        draw:
            lines:
                order: 1
                color: '#666'
                width: 1.5px
    roads:
        data: { source: osmTile }
        properties: { width: 3 }
        draw:
            lines:
                order: 2
                color: '#777'
                width: 1px
    buildings:
        data: { source: osmTile }
        draw:
            lines:
                order: 50
                color: '#999'
                width: .75px
```

**+** [more information about tangram's styles](https://mapzen.com/documentation/tangram/Styles-Overview/)