import { writeFragmentShader } from "./shaders";

function PlotterGl(funcao, tamanhoCanvas) {
    let start = performance.now();
    let canvas = document.getElementById("glCanvas");
    var gl = canvas.getContext("webgl");
    canvas.width = tamanhoCanvas;
    canvas.height = tamanhoCanvas;
    var vertexShaderSource = `
    attribute vec2 a_position;

    void main()
    {
        gl_Position = vec4(a_position, 0, 1);
    }
    `;
    var fragmentShaderSource = writeFragmentShader(funcao, canvas.width, canvas.height, lista_func, qtndInteiros);
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    var positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var positions = [
        -1, -1,
        1, -1,
        -1, 1,
        -1, 1,
        1, -1,
        1, 1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    let end = performance.now();
    console.log("Tempo do WEBGL");
    console.log(end - start);
}
export { PlotterGl }