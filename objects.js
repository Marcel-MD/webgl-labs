class Figure {
    constructor(vertices, indices, colors) {
        this.vertices = vertices;
        this.colors = colors;
        this.indices = indices;
        // This array defines each face as two triangles, using the
        // indices into the vertex array to specify each triangle's
        // position.

        this.angle = 0;
        this.rotateX = 1;
        this.rotateY = 0;
        this.rotateZ = 0;

        this.scale = 1.0;

        this.moveX = 0;
        this.moveY = 0;
        this.moveZ = 0;
    }
}

function createCube() {
    var vertices = [
        0.5, 0.5, 0.5, 0.7, 0.7, 0.7, -0.5, 0.5, 0.5, 0.1, 0.2, 0.7, -0.5, -0.5,
        0.5, 0.7, 0.9, 0.7, 0.5, -0.5, 0.5, 0.7, 0.6, 0.7, 0.5, -0.5, -0.5, 0.7,
        0.7, 0.7, 0.5, 0.5, -0.5, 0.5, 0.8, 0.7, -0.5, 0.5, -0.5, 0.7, 0.7, 0.3,
        -0.5, -0.5, -0.5, 0.7, 0.4, 0.7,
    ];

    var indices = [
        0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 5, 0, 5, 6, 0, 6, 1, 1, 6, 7, 1, 7, 2,
        7, 4, 3, 7, 3, 2, 4, 7, 6, 4, 6, 5,
    ];

    var colors = [];
    for (let i = 0; i < vertices.length; i++) {
        colors.push(Math.random());
    }

    return new Figure(
        new Float32Array(vertices),
        new Uint8Array(indices),
        new Float32Array(colors)
    );
}

function createPyramid() {
    var vertices = [
        0.0, 0.5, 0.0, 0.8, 0.8, 0.5, -0.5, -0.5, 0.5, 0.8, 0.5, 0.8, 0.5, -0.5,
        0.5, 0.8, 0.8, 0.8, 0.5, -0.5, -0.5, 0.5, 0.8, 0.8, -0.5, -0.5, -0.5,
        0.8, 0.5, 0.8,
    ];

    var indices = [0, 1, 2, 0, 2, 3, 0, 1, 4, 0, 3, 4, 1, 2, 4, 2, 3, 4];

    var colors = [];
    for (let i = 0; i < vertices.length; i++) {
        colors.push(Math.random());
    }

    return new Figure(
        new Float32Array(vertices),
        new Uint8Array(indices),
        new Float32Array(colors)
    );
}

function createConus() {
    var vertices = [];
    var indices = [];
    const sectors = (2 * Math.PI) / 100;
    var angle;

    vertices.push(0, 0.5, 0, 1, 0, 1);
    for (let i = 0; i < 100; i++) {
        angle = i * sectors;

        vertices.push(Math.cos(angle) / 2);
        vertices.push(-0.7);
        vertices.push(Math.sin(angle) / 2);
        vertices.push(1, 1, 0);

        if (i <= 98) indices.push(0, i, i + 1);
        indices.push(100, i, i + 1);
    }

    vertices.push(0, -0.5, 0, 1, 1, 0);
    indices.push(0, 99, 1);

    var colors = vertices;

    return new Figure(
        new Float32Array(vertices),
        new Uint8Array(indices),
        new Float32Array(colors)
    );
}
