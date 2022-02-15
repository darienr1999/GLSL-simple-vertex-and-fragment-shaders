import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface MousePosition {
    x: number;
    y: number;
}

export class DrawingCommon {
    private _boundHandleFrame: (t: DOMHighResTimeStamp) => any;

    // DOM items
    glCanvas = document.createElement('canvas')
	glContext: WebGLRenderingContext;

    // Three.js items
    scene = new THREE.Scene() 
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;

    constructor(public el: HTMLElement){
        // make it a method that's bound to this object
		this._boundHandleFrame = this._handleFrame.bind(this) 

        // let's create a canvas and to draw in
        el.appendChild(this.glCanvas);

        this.glCanvas.id = "threecanvas";

        // define scene view
        this.scene.background = new THREE.Color( 0xcccccc );

        this.camera.position.set(0,0,100)
		this.scene.add(this.camera)

		// Create a canvas and context for the session layer
		let ctx = this.glCanvas.getContext('webgl')
        if (!ctx) {
            throw new Error("Cannot create WebGL render context in common.ts")
        }
        this.glContext = ctx

		// Set up the THREE renderer with the session's layer's glContext
		this.renderer = new THREE.WebGLRenderer({
			canvas: this.glCanvas,
			context: this.glContext,
			antialias: true,
			alpha: true
		})
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( this.glCanvas.offsetWidth, this.glCanvas.offsetHeight );

        // update the camera
        this.camera.aspect = this.glCanvas.offsetWidth / this.glCanvas.offsetHeight;
        this.camera.updateProjectionMatrix();

		// Give extending classes the opportunity to initially populate the scene
		this.initializeScene()

        window.addEventListener('resize', (event) => {
            this.camera.aspect = this.el.offsetWidth / this.el.offsetHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize( this.el.offsetWidth, this.el.offsetHeight );
        });

        // some controls
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.listenToKeyEvents( this.glCanvas ); 


        this.controls.enableDamping = true;
		this.controls.dampingFactor = 0.05;

		this.controls.screenSpacePanning = false;

		this.controls.minDistance = 10;
		this.controls.maxDistance = 100;

		// // lights
		// const dirLight1 = new THREE.DirectionalLight( 0xffffff );
		// dirLight1.position.set( 1, 1, 1 );
		// this.scene.add( dirLight1 );

		// const dirLight2 = new THREE.DirectionalLight( 0x002288 );
		// dirLight2.position.set( - 1, - 1, - 1 );
		// this.scene.add( dirLight2 );

		// const ambientLight = new THREE.AmbientLight( 0x222222 );
		// this.scene.add( ambientLight );

        window.requestAnimationFrame(this._boundHandleFrame)
	}


    // a simple wrapper to reliably get the offset within an DOM element
    // We need this because the mouse position in the mouse event is
    // relative to the Window, but we want to specify draw coordinates
    // relative to the canvas DOM element  
    // see: http://www.jacklmoore.com/notes/mouse-position/
    static offset(e: MouseEvent): MousePosition {
        e = e || <MouseEvent> window.event;

        var target = <Element> (e.target || e.srcElement),
            rect = target.getBoundingClientRect(),
            offsetX = e.clientX - rect.left,
            offsetY = e.clientY - rect.top;

        return {x: offsetX, y: offsetY};
    }

	/*
	Extending classes should override this to set up the scene during class construction
	*/
	initializeScene(){}

	/*
	Extending classes that need to update the layer during each frame should override this method
	*/
	updateScene(time: DOMHighResTimeStamp){}

	_handleFrame(t: DOMHighResTimeStamp){
		const nextFrameRequest = window.requestAnimationFrame(this._boundHandleFrame)

        this.controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

        // Let the extending class update the scene before each render
		this.updateScene(t)

	    this.doRender()
    }

	doRender() {
		this.renderer.render(this.scene, this.camera)
	}
}
