var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    varying vec4 v_Color;

    uniform mat4 u_Mvp;
    uniform mat4 u_Transform;
    uniform mat4 u_Rotate;
    uniform mat4 u_DefaultTranslate;

    void main() {
        gl_Position = u_Mvp * u_DefaultTranslate * u_Transform * u_Rotate * a_Position;
        v_Color = a_Color;
    }`;

var FSHADER_SOURCE = `
  precision mediump float;
  varying vec4 v_Color;
  void main() {
    gl_FragColor = v_Color;
  }`;
