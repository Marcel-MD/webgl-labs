figures = [];
cameraValues = {
    perspectiveFov: 45,
    perspectiveAspect: 1,
    perspectiveNear: 1,
    perspectiveFar: 30,
    cameraX: 0,
    cameraY: 3,
    cameraZ: 6.5,
};

function main() {
    var canvas = document.getElementById("webgl");

    var gl = getWebGLContext(canvas);
    if (!gl) {
        alert("Failed to get the rendering context for WebGL");
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        alert("Failed to intialize shaders.");
        return;
    }

    setInterval(() => {
        render(gl);
    }, 15);
}

function render(gl) {
    gl.clearColor(0.2, 0.227, 0.271, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var viewMatrix = new Matrix4();
    viewMatrix
        .setPerspective(
            cameraValues.perspectiveFov,
            cameraValues.perspectiveAspect,
            cameraValues.perspectiveNear,
            cameraValues.perspectiveFar
        )
        .lookAt(
            cameraValues.cameraX,
            cameraValues.cameraY,
            cameraValues.cameraZ,
            0,
            0,
            0,
            0,
            1,
            0
        );
    var u_Mvp = gl.getUniformLocation(gl.program, "u_Mvp");
    gl.uniformMatrix4fv(u_Mvp, false, viewMatrix.elements);

    for (let figure of figures) {
        var n = initVertexBuffers(gl, figure);

        var transformMatrix = new Matrix4();
        transformMatrix
            .setTranslate(figure.moveX, figure.moveY, figure.moveZ)
            .scale(figure.scale, figure.scale, figure.scale);
        var u_Transform = gl.getUniformLocation(gl.program, "u_Transform");
        gl.uniformMatrix4fv(u_Transform, false, transformMatrix.elements);

        var rotateMatrix = new Matrix4();
        rotateMatrix.setRotate(
            figure.angle,
            figure.rotateX,
            figure.rotateY,
            figure.rotateZ
        );
        var u_Rotate = gl.getUniformLocation(gl.program, "u_Rotate");
        gl.uniformMatrix4fv(u_Rotate, false, rotateMatrix.elements);

        var u_DefaultTranslate = gl.getUniformLocation(
            gl.program,
            "u_DefaultTranslate"
        );
        gl.uniformMatrix4fv(u_DefaultTranslate, false, figure.defaultTranslate);

        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    }
}

function initVertexBuffers(gl, figure) {
    var vertices = figure.vertices;
    var indices = figure.indices;
    var colors = figure.colors;
    var FSIZE = vertices.BYTES_PER_ELEMENT;

    var verticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    var a_Position = gl.getAttribLocation(gl.program, "a_Position");
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    var colorsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    var a_Color = gl.getAttribLocation(gl.program, "a_Color");
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    var indicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return indices.length;
}

function addFigure(figureName) {
    switch (figureName) {
        case "cube":
            figures.push(createCube());
            break;
        case "pyramid":
            figures.push(createPyramid());
            break;
        case "conus":
            figures.push(createConus());
            break;
    }

    figures[figures.length - 1].defaultTranslate = new Matrix4().setTranslate(
        0,
        0,
        0
    ).elements;

    select = document.getElementById("objectIndex");
    select.innerHTML = "";

    for (var i = 0; i < figures.length; i++) {
        var opt = document.createElement("option");
        opt.value = i;
        opt.class = "option";
        opt.innerHTML = "Object " + i;
        select.appendChild(opt);
    }
}

function removeFigure() {
    figures.pop();
}

function rotate(axis) {
    var index = document.getElementById("objectIndex").value;
    switch (axis) {
        case "x":
            var rotateX = document.getElementById("rotateX").value;
            figures[index].rotateX = 1;
            figures[index].rotateY = 0;
            figures[index].rotateZ = 0;
            figures[index].angle = rotateX;
            break;

        case "y":
            var rotateY = document.getElementById("rotateY").value;
            figures[index].rotateX = 0;
            figures[index].rotateY = 1;
            figures[index].rotateZ = 0;
            figures[index].angle = rotateY;
            break;

        case "z":
            var rotateZ = document.getElementById("rotateZ").value;
            figures[index].rotateX = 0;
            figures[index].rotateY = 0;
            figures[index].rotateZ = 1;
            figures[index].angle = rotateZ;
            break;

        default:
            break;
    }
}

function move(axis) {
    var index = document.getElementById("objectIndex").value;
    switch (axis) {
        case "x":
            var moveX = document.getElementById("moveX").value;
            figures[index].moveX = moveX;
            break;

        case "y":
            var moveY = document.getElementById("moveY").value;
            figures[index].moveY = moveY;
            break;

        case "z":
            var moveZ = document.getElementById("moveZ").value;
            figures[index].moveZ = moveZ;
            break;

        default:
            break;
    }
}

function scale() {
    var index = document.getElementById("objectIndex").value;
    figures[index].scale = document.getElementById("size").value;
}

function updateCamera(property) {
    var newValue = parseFloat(document.getElementById(property).value);
    cameraValues[property] = newValue;
}
