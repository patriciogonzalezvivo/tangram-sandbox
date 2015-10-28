function captionizeImages() {
    if (!document.getElementsByTagName)
      return false;

    if (!document.createElement)
      return false;

    var images = document.getElementsByTagName("img");
    if (images.length < 1)
      return false;

    for (var i=0; i<images.length; i++) {
        var title = images[i].getAttribute("alt");

        if (title != ""){
            var divCaption = document.createElement("div");
            divCaption.className = "caption";
            var divCaption_text = document.createTextNode(title);
            divCaption.appendChild(divCaption_text);
            var divContainer = document.createElement("div");
            divContainer.className="imgcontainer";
            images[i].parentNode.insertBefore(divContainer,images[i]);
            divContainer.appendChild(images[i]);
            insertAfter(divCaption,images[i]);
        }
    }
}

function insertAfter(newElement,targetElement) {
    var parent = targetElement.parentNode;
    if (parent.lastChild == targetElement) {
      parent.appendChild(newElement);
    } else {
      parent.insertBefore(newElement,targetElement.nextSibling);
    }
}

function loadMarkdown( url_file ){
    getHttp(url_file, (error, response) => {
        var content = document.getElementById('content');
        content.className = "full";
        content.innerHTML = marked(response);
        captionizeImages();

        // Load codes tags that have "src" attributes
        var list = document.getElementsByTagName("code");
        for(var i = 0; i < list.length; i++){
            if (list[i].className == "lang-glsl" ||
                list[i].className == "lang-bash" ||
                list[i].className == "lang-cpp" ||
                list[i].className == "lang-html" ||
                list[i].className == "lang-processing" ){
                hljs.highlightBlock(list[i]);
            }
        }

        loadCanvas();
    });
}

var billboards = []; 
function loadCanvas() {
    var canvas = document.getElementsByClassName("canvas");
    for (var i = 0; i < canvas.length; i++){
        billboards.push(new GlslCanvas(canvas[i]));
    }
}

function renderCanvas() {
    for(var i = 0; i < billboards.length; i++){
        billboards[i].setMouse(mouse);
        billboards[i].render();
    }
    window.requestAnimFrame(renderCanvas);
}