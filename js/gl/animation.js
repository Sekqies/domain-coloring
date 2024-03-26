import {PlotterGl} from "./plotter_gl.js";
class GlAnimation
{
    constructor(canvas, width, height)
    {
        this.canvas = canvas;
        this.gl = canvas.getContext("webgl");
        this.width = width;
        this.height = height;
        this.iteration = 0;
        this.frames = [];
        this.fps = 30;
    }

    addFrame()
    {
        let pixels = new Uint8Array(this.width * this.height * 4);
        this.gl.readPixels(0, 0, this.width, this.height, this.gl.RGBA, this.gl.UNSIGNED_BYTE, pixels);
        this.frames.push(pixels);
    }
    getFrames()
    {
        return this.frames;
    }
    getFrame(i)
    {
        return this.frames[i];
    }
    requestGLPlotterFrame(funcao)
    {
        return new Promise((resolve) => {
            funcao = funcao.replace(/ANIMATION_VARIABLE/g, this.iteration.toString());
            PlotterGl(funcao, this.width);
            let pixels = new Uint8Array(this.width * this.height * 4);
            this.gl.readPixels(0, 0, this.width, this.height, this.gl.RGBA, this.gl.UNSIGNED_BYTE, pixels);
            resolve(pixels);
        });
    }
    async animate(funcao, start, end, step)
    {
        this.iteration = start;
        for (let k= start; (end>start)? k<=end: k>=end; k+=step)
        {
            try {
            this.iteration+=step;
            if ((end>start)? this.iteration > end : this.iteration < end) this.iteration = end;
            let pixels = await this.requestGLPlotterFrame(funcao);
            this.addFrame(pixels);
            }
            catch (e) {
                console.log(e);
            }
        }
        if (this.gl.isContextLost())
            console.log("Contexto perdido");
        else
        this.downloadAnimation();

    }
    downloadAnimation() {
        let capturer = new CCapture({ format: 'webm', framerate: this.fps });
    
        capturer.start();
    
        for (let i = 0; i < this.frames.length; i++) {
            let canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            let context = canvas.getContext('2d');
            let imageData = new ImageData(new Uint8ClampedArray(this.frames[i]), this.width, this.height);
            context.putImageData(imageData, 0, 0);
            capturer.capture(canvas);
        }
    
        capturer.stop();
        capturer.save();
    }
    playAnimation(FPS, mode)
    {
        mode = mode.toLowerCase();
        let context = canvas.getContext('2d');
        let frameIndex = 0;
        let frameDuration = 1000 / FPS; 
        let lastFrameTime = 0;
        let direction = 1; 
    
        context.translate(0, this.height);
        context.scale(1, -1); 
    
        let displayFrame = (currentTime) => {
            if (currentTime - lastFrameTime >= frameDuration) {
                let imageData = new ImageData(new Uint8ClampedArray(this.frames[frameIndex]), this.width, this.height);
                context.putImageData(imageData, 0, 0);
                frameIndex += direction;
                if (mode == 'bounce') {
                    if (frameIndex >= this.frames.length) {
                        frameIndex = this.frames.length - 2;
                        direction = -1;
                    } else if (frameIndex < 0) {
                        frameIndex = 1;
                        direction = 1;
                    }
                } else if (mode == 'loop') {
                    frameIndex = frameIndex % this.frames.length;
                }
                lastFrameTime = currentTime;
            }
            if ((frameIndex < this.frames.length && direction == 1) || (frameIndex >= 0 && direction == -1) || mode =='loop') {
                requestAnimationFrame(displayFrame);
            }
        };
    
        requestAnimationFrame(displayFrame);
    }
}

export {GlAnimation};