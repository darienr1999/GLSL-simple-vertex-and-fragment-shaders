// abstract library
import { DrawingCommon } from './common';
import * as THREE from 'three'

// set up a input element as an example
let num = document.querySelector("#number") as HTMLInputElement;

// A class for our application state and functionality
class Drawing extends DrawingCommon {
    plane: THREE.Mesh | null = null;
    planeGeom: THREE.PlaneGeometry;

    // start with shader 1
    programNumber = 0;

    // must be the same number of elements: vertexFiles, fragFiles, texFiles are vertex shader, 
    // fragment shader, texture for each of the 4 shaders.  You'll probably want to change the 
    // texture to match your shader, if it uses a different texture.
    //
    // After loading, the filenames are replace with the actual contents of the files (shader programs or textures) 
    vertexFiles: (string | ArrayBuffer)[] = [ "../shaders/shader1.vert.glsl", "../shaders/shader2.vert.glsl", "../shaders/shader3.vert.glsl", "../shaders/shader4.vert.glsl" ];
    fragFiles: (string | ArrayBuffer)[] = ["../shaders/shader1.frag.glsl", "../shaders/shader2.frag.glsl", "../shaders/shader3.frag.glsl", "../shaders/shader4.frag.glsl" ];
    texFiles: (string | THREE.Texture)[] = [ "../assets/water.jpg", "../assets/brick_diffuse.jpg", "../assets/water.jpg", "../assets/brick_diffuse.jpg" ];

    // the 4 shaders will get saved here    
    shaderMaterial: THREE.ShaderMaterial[] = [];

    // set up a loader for textures and files
    texLoader = new THREE.TextureLoader();
    loader = new THREE.FileLoader();

    // set up the uniforms for the shaders.  You'll need to change these to match your shaders
    uniforms: { [uniform: string]: THREE.IUniform }[] = [
        {
            u_ambient: {value: new THREE.Color( num!.valueAsNumber, num!.valueAsNumber, num!.valueAsNumber)},
            u_color: {value: new THREE.Color( 0xdd2200 )},
            u_colorTexture: {value: null},
            slider: {value: null}
        },
        {
            u_ambient: {value: new THREE.Color( num!.valueAsNumber, num!.valueAsNumber, num!.valueAsNumber)},
            u_color: {value: new THREE.Color( 0xdd2200 )},
            u_colorTexture: {value: null},
            hole: {value: null},
            slider: {value: null}
        },
        {
            u_ambient: {value: new THREE.Color( num!.valueAsNumber, num!.valueAsNumber, num!.valueAsNumber)},
            u_color: {value: new THREE.Color( 0xdd2200 )},
            u_colorTexture: {value: null},
            time: {value: null}
        },
        {
            u_ambient: {value: new THREE.Color( num!.valueAsNumber, num!.valueAsNumber, num!.valueAsNumber)},
            u_color: {value: new THREE.Color( 0xdd2200 )},
            u_colorTexture: {value: null} 
        }
    ];

    // initialize everything
    constructor (canv: HTMLElement) {
        super (canv)

        // we're going to actually wait for everything to load before setting up scene.
        // there are 3 files per shader
        var numFilesLeft = this.vertexFiles.length * 3;
  
        // set up the DOM UI callbacks
        this.setupCallbacks();

        // when all the files are loaded, finish setup!
        var runMoreIfDone = () => {
           --numFilesLeft;
           if (numFilesLeft === 0) {
             this.finishSetup();
           }
        }
        
        // start each file load, and call the above callback when done.  After the last call
        // to runMoreIfDone, the finishSetup() function will be called.
        for (let i = 0; i < this.vertexFiles.length; i++) {
            this.loader.load(this.vertexFiles[i] as string, (data) => { 
                this.vertexFiles[i] = data;
                runMoreIfDone(); 
            });
            this.loader.load(this.fragFiles[i] as string, (data) => { 
                this.fragFiles[i] = data; 
                runMoreIfDone(); 
            });
            this.texLoader.load( this.texFiles[i] as string, (tex) => {
                this.texFiles[i] = tex
                runMoreIfDone(); 
             });
        }

        // create our plane geometry
        var geometry = new THREE.PlaneGeometry( 50, 50, 100, 100 );
        this.planeGeom = geometry;
    }

    // now that things are loaded, lets create our shaders and finish setting up the scene
    finishSetup() {

        // since all our shaders are the same to start, we can initialize everything in a loop.  You
        // will probably need to initialize some things outside the loop, and use the loop to set up
        // the shaders
        for (let i = 0; i < this.vertexFiles.length; i++) {
            this.uniforms[i].u_colorTexture.value = this.texFiles[i] as THREE.Texture;
            this.uniforms[i].u_colorTexture.value.wrapS = this.uniforms[i].u_colorTexture.value.wrapT = THREE.RepeatWrapping;

            this.shaderMaterial[i] = new THREE.ShaderMaterial( {
                uniforms: this.uniforms[i],
                vertexShader: this.vertexFiles[i] as string,
                fragmentShader: this.fragFiles[i] as string
            } );        

            this.shaderMaterial[i].side = THREE.DoubleSide;
        }

        // start with 0
        this.plane = new THREE.Mesh( this.planeGeom, this.shaderMaterial[0] );
        this.scene.add( this.plane );
    }

	/*
	Update the scene during requestAnimationFrame callback before rendering
	*/
	updateScene(time: DOMHighResTimeStamp){
        time *= 0.001;
        if (!this.plane) return;

        // update the uniforms for each shader.  All the same right now, but
        // you'll need to change them to match your shaders
        switch (this.programNumber) {
          case 0:
            this.uniforms[0].slider.value = num!.valueAsNumber;
            this.uniforms[0].u_color.value.offsetHSL( 0.005, 0, 0 );
            this.uniforms[0].u_ambient.value.setScalar(num!.valueAsNumber)
            
            break;

          case 1:
            this.uniforms[1].slider.value = num!.valueAsNumber;
            this.uniforms[1].hole.value = new Float32Array([0.0, 0.0]);
            this.uniforms[1].u_color.value.offsetHSL( 0.005, 0, 0 );
            this.uniforms[1].u_ambient.value.setScalar(num!.valueAsNumber)
            break;

          case 2:
            this.uniforms[2].time.value = time;
            this.uniforms[2].u_color.value.offsetHSL( 0.005, 0, 0 );
            this.uniforms[2].u_ambient.value.setScalar(num!.valueAsNumber)
            break;

          case 3:
            this.uniforms[3].u_color.value.offsetHSL( 0.005, 0, 0 );
            this.uniforms[3].u_ambient.value.setScalar(num!.valueAsNumber)
            break;
        }
    }
    
    // switch the shader program
    setupShaderPlane(effectNum: number) {
        this.programNumber = effectNum;
        if (!this.plane) return;

        this.plane.material = this.shaderMaterial[effectNum];
    }

    setupCallbacks() {
        // @ts-ignore
        window.onEffect1 = () => {
            console.log("default effect 1!");
            this.setupShaderPlane(0);    
        } 
        
        // @ts-ignore
        window.onEffect2 = () => {
            console.log("install effect2!");
            this.setupShaderPlane(1);    
        } 
        // @ts-ignore
        window.onEffect3 = () => {
            console.log("install effect3!");
            this.setupShaderPlane(2);    
        } 

        // @ts-ignore    
        window.onEffect4 = () => {
            console.log("install effect4!");
            this.setupShaderPlane(3);    
        }         
    }
}

var myDrawing: Drawing;
function exec() {
    // find our container
    var div = document.getElementById("drawing");

    if (!div) {
        console.warn("Your HTML page needs a DIV with id='drawing'")
        return;
    }

    // create a Drawing object
    myDrawing = new Drawing(div);
}

exec()