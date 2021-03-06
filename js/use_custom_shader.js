$(document).ready( function(){
    var scene, camera, renderer;
    var lopta, kola;

    init();
    animate();

    function init()
    {
        var NUM_SAMPLES = 24;

        //SCENE
        scene = new THREE.Scene();

        // set up camera
        camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 2322);
        camera.position.set(8*2,1*2,-3*2);
        camera.position.multiplyScalar(6.0);
        camera.lookAt(scene.position);

        var manager = new THREE.LoadingManager();
        manager.onProgress = function ( item, loaded, total )
        {
        };
        var loaderPAILHEAD = new THREE.PAILHEADLoader(manager);
        var loaderIMG = new THREE.ImageLoader( manager );

        var texSmooth = new THREE.Texture();
        var texIslands = new THREE.Texture();
        texIslands.wrapS = texSmooth.wrapT = THREE.RepeatWrapping;
        texIslands.wrapT = texSmooth.wrapS = THREE.RepeatWrapping;
        var texTocakFelnaDiff = new THREE.Texture();
        texTocakFelnaDiff.wrapT = texTocakFelnaDiff.wrapS = THREE.RepeatWrapping;
        var texTocakFelnaSpec = new THREE.Texture();
        texTocakFelnaSpec.wrapT = texTocakFelnaSpec.wrapS = THREE.RepeatWrapping;
        var texTocakGumaDiff = new THREE.Texture();
        texTocakGumaDiff.wrapT = texTocakGumaDiff.wrapS = THREE.RepeatWrapping;

        loaderIMG.load( 'resource/images/tocakGumaNM.png', function ( image ){
            texSmooth.image = image;
            texSmooth.needsUpdate = true;
            texSmooth.name = "texSmooth";
        });
        loaderIMG.load( 'resource/images/tocakFelnaNM.png', function ( image ){
            texIslands.image = image;
            texIslands.needsUpdate = true;
            texIslands.name = "texIslands";
        });
        loaderIMG.load( 'resource/images/tocakFelnaDF.png', function ( image ){
            texTocakFelnaDiff.image = image;
            texTocakFelnaDiff.needsUpdate = true;
            texTocakFelnaDiff.name = "texTocakFelnaDiff";
        });
        loaderIMG.load( 'resource/images/tocakGumaDF.png', function ( image ){
            texTocakGumaDiff.image = image;
            texTocakGumaDiff.needsUpdate = true;
            texTocakGumaDiff.name = "texTocakGumaDiff";
        });
        loaderIMG.load( 'resource/images/tocakFelnaSP.png', function ( image ){
            texTocakFelnaSpec.image = image;
            texTocakFelnaSpec.needsUpdate = true;
            texTocakFelnaSpec.name = "texTocakFelnaSpec";
        });
        loaderIMG.load( 'resource/images/tocakFelnaSP.png', function ( image ){
            texTocakFelnaSpec.image = image;
            texTocakFelnaSpec.needsUpdate = true;
            texTocakFelnaSpec.name = "texTocakFelnaSpec";
        });

        var urlsAmbCube = [
            'resource/images/cubemaps/CamryAmbCM_c00.bmp',
            'resource/images/cubemaps/CamryAmbCM_c01.bmp',
            'resource/images/cubemaps/CamryAmbCM_c02.bmp',
            'resource/images/cubemaps/CamryAmbCM_c03.bmp',
            'resource/images/cubemaps/CamryAmbCM_c04.bmp',
            'resource/images/cubemaps/CamryAmbCM_c05.bmp'
        ];
        var cubeAmb = THREE.ImageUtils.loadTextureCube(urlsAmbCube); //load txtures
        var cubeSpec = THREE.ImageUtils.loadCompressedTextureCube("resource/images/cubemaps/OutputCube2.dds"); //load txtures
        cubeAmb.minFilter = THREE.LinearFilter;
        cubeSpec.minFilter = THREE.LinearFilter;

        var rands = [];
        for (var i = 0; i< NUM_SAMPLES; i++){
            var r1 = Math.random();
            var r2 = Math.random();
            rands.push(
                new THREE.Vector4(
                    r1,
                    r2,
                    Math.cos(2 * Math.PI * r2),
                    Math.sin(2 * Math.PI * r2)
                )
            );

        }
        var noiz = noiseTex(64, true);
        var patt = pattTex(64);
        var attributes = {
            ph_binormal: {	type: 'v3', value: null },
            ph_tangent: { type: 'v3', value: null },
            ph_uv0: { type: 'v2', value: null }
        };
        var uniformsMain= {
            _specAdjust:{
                type: "f",
                value: 1
            },
            //textures
            _texDiffuse: {
                type: 't', // a float
                value: null
            },
            _texSpec: {
                type: 't', // a float
                value: null
            },
            _texNormal: {
                type: 't', // a float
                value: null
            },
            _uPhongRands:{
                type: "v4v",
                value: rands
            },
            _screenStuff:{
                type: "v4",
                value: new THREE.Vector4()
            },
            _sampleTex:{
                type: "t",
                value: null
            },
            _noiseTex:{
                type: "t",
                value: null
            },
            //cube maps
            _cubeSpec : {
                type: "t",
                value: null
            },
            _refGamma :{
                type: "f",
                value: 1.9
            },
            _refPower :{//cubemap power
                type: "f",
                value: 0.56
            },
            _refRPow:{//rim power
                type: 'f',
                value: 5
            },
            _refRBias:{
                type: 'f',
                value: 0
            },
            _cubeAmb : {
                type: "t",
                value: null
            },
            _ambPow : {
                type: "f",
                value: 0.53
            },
            _ambGamma :{
                type: "f",
                value: 0.37
            },
            _elapsedTime:{
                type: 'f',
                value: 0.0
            },
            _color:{
                type: 'v3',
                value: new THREE.Vector3(1,1,1)
            },
            _specColor:{
                type: 'v3',
                value: new THREE.Vector3(1,1,1)
            },
            _specPower:{
                type: 'f',
                value: 0.45
            },
            _glossiness:{
                type: 'f',
                value: 9.3
            },
            _lightIntensity:{
                type: 'f',
                value: 0.716
            },
            _choiceNormal:{
                type: "i",
                value: 1
            },
            _choiceOutput:{
                type: "i",
                value:0
            },
            _mipBias:{
                type: "f",
                value: 0
            }
        }
        var noiz2screen = {
            x: 1/(64),
            y: 1/(64),
            z: 1/ window.innerWidth,
            w: 1/ window.innerHeight
        };

        //create the material
        var materialSimple = new THREE.ShaderMaterial({
            uniforms: uniformsMain,
            attributes: attributes,
            vertexShader: $('#baseVertex').text(),
            fragmentShader:
            "#define SAMPLE_NUM " + NUM_SAMPLES + "\n" +
            "#define SAMPLE_NUM_INV " + (1/NUM_SAMPLES) + "\n" +
            $('#surfaceFancy').text(),
        });

        loaderPAILHEAD.load( "resource/models/tocak_felna.js", function( geometry )
        {
            lopta = new THREE.Mesh( geometry, materialSimple.clone());

            lopta.material.uniforms = new THREE.UniformsUtils.clone(uniformsMain);
            lopta.material.uniforms._glossiness.value = uniformsMain._glossiness.value;

            lopta.material.uniforms._specPower.value = 1;
            lopta.material.uniforms._lightIntensity.value = .3;
            lopta.material.uniforms._color.value.set(1,0,0);
            lopta.material.uniforms._specColor.value.set(1,1,0);
            lopta.material.uniforms._ambPow.value = 1.39;
            lopta.material.uniforms._ambGamma.value = 1.16;
            lopta.material.uniforms._refRBias.value = .733;
            lopta.material.uniforms._refRPow.value = .813;
            lopta.material.uniforms._refPower.value = 1.57;
            lopta.material.uniforms._refGamma.value = 2.07;
            lopta.material.uniforms._glossiness.value = 16.5;
            lopta.material.uniforms._specPower.value = 1.329;
            lopta.material.uniforms._mipBias.value = 1;
            lopta.material.uniforms._specAdjust.value = 1.3;

            lopta.material.uniforms._texNormal.value = texIslands;
            lopta.material.uniforms._texDiffuse.value = texTocakFelnaDiff;
            lopta.material.uniforms._texSpec.value = texTocakFelnaSpec;

            lopta.material.uniforms._cubeAmb.value = cubeAmb;
            lopta.material.uniforms._cubeSpec.value = cubeSpec;
            lopta.material.uniforms._uPhongRands.value = rands;

            lopta.material.uniforms._noiseTex.value = noiz;
            lopta.material.uniforms._sampleTex.value = patt;
            lopta.material.uniforms._screenStuff.value.x = noiz2screen.x;
            lopta.material.uniforms._screenStuff.value.y = noiz2screen.y;
            lopta.material.uniforms._screenStuff.value.z = noiz2screen.z;
            lopta.material.uniforms._screenStuff.value.w = noiz2screen.w;

            scene.add(lopta);
        });
        loaderPAILHEAD.load( "resource/models/tocak_guma.js", function( geometry )
        {
            kola = new THREE.Mesh( geometry, materialSimple.clone());

            kola.material.uniforms._glossiness.value = 9.5;
            kola.material.uniforms._specPower.value = 1.529;
            kola.material.uniforms._lightIntensity.value = 1.36;
            kola.material.uniforms._texNormal.value = texSmooth;
            kola.material.uniforms._color.value.set(0,1,0);
            kola.material.uniforms._specColor.value.set(1,1,0);
            kola.material.uniforms._specAdjust.value = 6;
            kola.material.uniforms._mipBias.value = 1;
            kola.material.uniforms._ambPow.value = 1.13536;
            kola.material.uniforms._ambGamma.value = .763;
            kola.material.uniforms._refRBias.value = .0428;
            kola.material.uniforms._refRPow.value = .36;
            kola.material.uniforms._refPower.value = 8.37;
            kola.material.uniforms._cubeAmb.value = cubeAmb;
            kola.material.uniforms._cubeSpec.value = cubeSpec;
            kola.material.uniforms._texDiffuse.value = texTocakGumaDiff;
            kola.material.uniforms._texSpec.value = texTocakGumaDiff;
            kola.material.uniforms._uPhongRands.value = rands;
            kola.material.uniforms._noiseTex.value = noiz;
            kola.material.uniforms._sampleTex.value = patt;
            kola.material.uniforms._screenStuff.value.x = noiz2screen.x;
            kola.material.uniforms._screenStuff.value.y = noiz2screen.y;
            kola.material.uniforms._screenStuff.value.z = noiz2screen.z;
            kola.material.uniforms._screenStuff.value.w = noiz2screen.w;

            scene.add(kola);
        });

        if ( Detector.webgl )
        {
            renderer = new THREE.WebGLRenderer();
        }
        else
        {
            renderer = new THREE.CanvasRenderer();
        }
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.gammaInput = true;
        renderer.gammaOutput = true;

        document.body.appendChild(renderer.domElement);
        window.addEventListener('resize', function ()
        {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);
        }, false);
    }

    function animate()
    {
        requestAnimationFrame( animate );

        if (lopta instanceof THREE.Object3D && kola instanceof THREE.Object3D)
        {
            lopta.rotation.y += 0.01;
            kola.rotation.y = lopta.rotation.y;
        }

        renderer.render( scene, camera );
    }
});