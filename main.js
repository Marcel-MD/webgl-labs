figures = []; //array of Figure objects
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
        alert("Failed to initialize shaders.");
        return;
    }

    setInterval(() => {
        //repeatedly calls a function or executes a code snippet,
        render(gl); //with a fixed time delay between each call (milliseconds)
    }, 15);
}

function render(gl) {
    gl.clearColor(0.2, 0.227, 0.271, 1); //the color values used when clearing color buffers.
    gl.enable(gl.DEPTH_TEST); //Activates depth comparisons and updates to the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); //clears buffers to preset values (accepts multiple values)

    var viewMatrix = new Matrix4();
    viewMatrix
        .setPerspective(
            cameraValues.perspectiveFov, //fovy. Viewing vertical angle in degrees.
            cameraValues.perspectiveAspect, //aspect. Aspect ratio.
            cameraValues.perspectiveNear, //znear. Distance between a camera to the near clipping plane.
            cameraValues.perspectiveFar //zfar. Distance between a camera and far clipping plane.
        )
        .lookAt(
            //.lookAt ( eye : Vector3, center : Vector3, up : Vector3, )
            cameraValues.cameraX, //Constructs a rotation matrix, looking from eye towards center oriented by the up vector.
            cameraValues.cameraY, //It computes a matrix that transforms world space to view space.
            cameraValues.cameraZ, //It generates a matrix for rasterization, in which an object must be transformed from the world into the view.
            0,
            0,
            0,
            0,
            1,
            0
        );
    var u_Mvp = gl.getUniformLocation(gl.program, "u_Mvp");
    //returns the location of a specific uniform variable
    //program - The WebGLProgram in which to locate the specified uniform variable.
    //name - A DOMString specifying the name of the uniform variable whose location is to be returned.

    gl.uniformMatrix4fv(u_Mvp, false, viewMatrix.elements);
    // specifies matrix values for uniform variables,
    //takes as the input value 4-component square matrix.
    //location - A WebGLUniformLocation object containing the location of the uniform attribute to modify. The location is obtained using getUniformLocation().
    //transpose - A GLboolean specifying whether to transpose the matrix. Must be false.
    //value - A Float32Array or sequence of GLfloat values. The values are assumed to be supplied in column major order.

    for (let figure of figures) {
        var n = initVertexBuffers(gl, figure); //initialize vertices, color ... for figure

        var transformMatrix = new Matrix4(); //A class representing a 4x4 matrix.
        transformMatrix
            .setTranslate(figure.moveX, figure.moveY, figure.moveZ) //set the values for scaling and position
            .scale(figure.scale, figure.scale, figure.scale);

        var u_Transform = gl.getUniformLocation(gl.program, "u_Transform");
        gl.uniformMatrix4fv(u_Transform, false, transformMatrix.elements);

        var u_DefaultTranslate = gl.getUniformLocation(
            gl.program,
            "u_DefaultTranslate"
        );
        gl.uniformMatrix4fv(u_DefaultTranslate, false, figure.defaultTranslate);

        var rotateMatrix = new Matrix4(); //set the values for rotation
        rotateMatrix.setRotate(
            figure.angle,
            figure.rotateX,
            figure.rotateY,
            figure.rotateZ
        );

        var u_Rotate = gl.getUniformLocation(gl.program, "u_Rotate");
        gl.uniformMatrix4fv(u_Rotate, false, rotateMatrix.elements);

        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0); //draw the figure
    }
}

function initVertexBuffers(gl, figure) {
    var vertices = figure.vertices;
    var indices = figure.indices;
    var colors = figure.colors;
    var FSIZE = vertices.BYTES_PER_ELEMENT;

    /// SENDING THE DATA TO OUR SHADER!!!!!!!!

    var verticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); // SET THE DATA, SPECIFY THE ARRAY, vertices in this case
    var a_Position = gl.getAttribLocation(gl.program, "a_Position"); // SET THE LOCATION (pick any variable name to be accessible within the v-shader)
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0); // DESCRIBE THE DATA: EACH vertex has 3 values of type FLOAT
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
        //new figure pushed to the end of array
        0,
        0,
        0
    ).elements; //.elements is the property of a Matrix4. An array. A column-major list of matrix values)

    select = document.getElementById("objectIndex");
    select.innerHTML = "";

    for (var i = 0; i < figures.length; i++) {
        var opt = document.createElement("option"); //method creates the HTML element specified by tagName
        opt.value = i;
        opt.class = "option";
        opt.innerHTML = "Object " + i;
        select.appendChild(opt); //add the new element to the page
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
