import { writeFragmentShader, updateCenter } from "./shaders.js";
import { listaFuncoes } from "./funcoes_complexas_gl.js";

 
function PlotterGl(funcao, tamanhoCanvas) {
    let start = performance.now();
    const gl = variaveisGlobais.glContext;
    const glCanvas = variaveisGlobais.glCanvas;
    const vaoExt = gl.getExtension('OES_vertex_array_object');
    const instancedExt = gl.getExtension('ANGLE_instanced_arrays');

    // Create and bind a Vertex Array Object (VAO)
    const vao = vaoExt.createVertexArrayOES();
    vaoExt.bindVertexArrayOES(vao);

    // Set canvas size
    glCanvas.width = tamanhoCanvas;
    glCanvas.height = tamanhoCanvas;
    const functionKey  = funcao + String(tamanhoCanvas) + String(variaveisGlobais.valorTipoGrafico);
    variaveisGlobais.sizeCache[tamanhoCanvas] = true;
    const cache = variaveisGlobais.functionCache[functionKey];
    if(variaveisGlobais.sizeCache[tamanhoCanvas])
        gl.viewport(0, 0, glCanvas.width, glCanvas.height);
    if (cache) { 
        if (!(gl instanceof WebGLRenderingContext)) {
            alert(typeof gl)
        }
        const {shaderProgram, vao, vertexBuffer, indexBuffer} = cache;
        updateCenter(gl, variaveisGlobais.centro, variaveisGlobais.raio, shaderProgram);

        vaoExt.bindVertexArrayOES(vao);
        gl.useProgram(shaderProgram);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
        gl.drawElements(gl.TRIANGLES,6,gl.UNSIGNED_SHORT,0);

        
    } else {
        // Vertex shader source
        var vertexShaderSource = `
        attribute vec2 a_position;

        void main() {
            gl_Position = vec4(a_position, 0, 1);
        }
        `;

        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexShaderSource);
        gl.compileShader(vertexShader);

        const fragmentShaderSource = writeFragmentShader(funcao, listaFuncoes.declarations);
         

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentShaderSource);
        gl.compileShader(fragmentShader);

        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        gl.useProgram(shaderProgram);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = new Float32Array([
            -1.0, -1.0,
            1.0, -1.0,
            -1.0, 1.0,
            1.0, 1.0,
        ]);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        const indices = new Uint16Array([
            // Index data
            0, 1, 2,
            2, 3, 0,
        ]);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        const vertices = new Float32Array([
            // Vertex data (x, y)
            -1.0, -1.0,
             1.0, -1.0,
             1.0,  1.0,
            -1.0,  1.0
        ]);
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);

        const resolutionLocation = gl.getUniformLocation(shaderProgram, 'u_resolution');
        gl.uniform2f(resolutionLocation, tamanhoCanvas, tamanhoCanvas);  
        const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");
        gl.enableVertexAttribArray(positionAttributeLocation);
        const centerLocation = gl.getUniformLocation(shaderProgram, "u_center_radius");
        gl.uniform3f(centerLocation, variaveisGlobais.centro.x, variaveisGlobais.centro.y, variaveisGlobais.raio);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        vaoExt.bindVertexArrayOES(null);
        
        vaoExt.bindVertexArrayOES(vao);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
        vaoExt.bindVertexArrayOES(null);
        variaveisGlobais.functionCache[functionKey] = {
            shaderProgram: shaderProgram,
            vao: vao,
            vertexBuffer: vertexBuffer,
            indexBuffer: indexBuffer
        }

    }
    variaveisGlobais.currentFunction = funcao;
    let end = performance.now();
    console.log(`Rendering time: ${end - start} ms`);
}

export { PlotterGl, listaFuncoes as listaFuncoesGL }