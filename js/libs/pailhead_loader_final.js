/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */
//modified @pailhead 

THREE.PAILHEADLoader = function ( showStatus ) {
	THREE.Loader.call( this, showStatus );
	this.withCredentials = false;
	this.loadedItems = 0;
	this.totalItems = 0;
};

THREE.PAILHEADLoader.prototype = Object.create( THREE.Loader.prototype );

THREE.PAILHEADLoader.prototype.load = function ( url, callback, texturePath, funcPH ) {
	var scope = this;

	scope.totalItems++;
	texturePath = texturePath && ( typeof texturePath === "string" ) ? texturePath : this.extractUrlBase( url );
	// console.log(scope.totalItems);//ovo se desi odmah

	this.loadAjaxJSON( this, url, callback, texturePath, false);
}

THREE.PAILHEADLoader.prototype.loadAjaxJSON = function ( context, url, callback, texturePath, callbackProgress) {
	var xhr = new XMLHttpRequest(); //pocinjemo ovde
	var length = 0; // duzina nula

	xhr.onreadystatechange = function () {

		if ( xhr.readyState === xhr.DONE ) {

			if ( xhr.status === 200 || xhr.status === 0 ) {

				if ( xhr.responseText ) {
					var json = JSON.parse( xhr.responseText );
					var result = context.parse( json, texturePath );
					// callback( result.geometry, result.materials );
					callback( result.geometry);//ovo vraca geometriju
					

					////////////////////////////////////////////////////////////////////////////////////
					context.loadedItems++;
					context.onLoadComplete();

					var rlength = xhr.getResponseHeader( "Content-Length" );
					var maxLengthName = 12;

					while(rlength.length<maxLengthName){
						rlength = "." + rlength;
					}
					var maxSize = 29;
					var consoleUrlOutput = url;
					while (consoleUrlOutput.length<maxSize){
						consoleUrlOutput = "."+consoleUrlOutput;
					}
					console.log("OBJ::: LOADED MODEL" + consoleUrlOutput);
					console.log("OBJ::: MODEL SIZE............." + rlength +" BYTES");
					// context.loadedItems++;
					console.log("OBJ::: MODEL.........................."+context.loadedItems +" OUT OF " + context.totalItems);
					// console.log(context);
					
					// context.onLoadComplete(scope.callbackDone);
					////////////////////////////////////////////////////////////////////////////////////

				} else {
					console.warn( "THREE.JSONLoader: [" + url + "] seems to be unreachable or file there is empty" );
				}
				// in context of more complex asset initialization
				// do not block on single failed file
				// maybe should go even one more level up
				// function loadCompleted(){
					// console.log("Loading " + context.loadedItems + " out of " + context.totalItems);
				// }
				// context.onLoadComplete();
			} else {
				console.error( "THREE.JSONLoader: Couldn't load [" + url + "] [" + xhr.status + "]" );
			}
			
		} else if ( xhr.readyState === xhr.LOADING ) {
			if ( callbackProgress ) {
				if ( length === 0 ) {
					length = xhr.getResponseHeader( "Content-Length" );//zasto se ovo menja
				}
				callbackProgress( { total: length, loaded: xhr.responseText.length } );
				// console.log(callbackProgress);
			}
		} else if ( xhr.readyState === xhr.HEADERS_RECEIVED ) {
			// console.log('headers received for ' + xhr.getResponseHeader( "Content-Length" ));
			console.log('OBJ::: headers received for ' + url);
			// var jsonSize = xhr.getResponseHeader( "Content-Length" );
			var maxSize = 30;
			var consoleUrlOutput = url;
			while (consoleUrlOutput.length<maxSize){
				consoleUrlOutput = consoleUrlOutput+".";
			}
			maxSize = 11;
			var consoleUrlSize = xhr.getResponseHeader( "Content-Length" );

			while (consoleUrlSize.length<maxSize){
				consoleUrlSize = "."+consoleUrlSize;
			}
			// console.log('TOTAL JSON MESHES.....'+ context.totalItems)
			// console.log(consoleUrlOutput+consoleUrlSize);
			if ( callbackProgress !== undefined ) {
				length = xhr.getResponseHeader( "Content-Length" );
			}
		} else if (xhr.readyState == xhr.UNSENT){
			console.log('OBJ:: unsent');//ovo ne radi
		}
	};
	xhr.open( "GET", url, true );
	xhr.withCredentials = this.withCredentials;
	xhr.send( null );
};

THREE.PAILHEADLoader.prototype.parse = function ( json, texturePath ) {

	var scope = this,
	bufferGeom = new THREE.BufferGeometry(),
	scale = ( json.scale !== undefined ) ? 1.0 / json.scale : 1.0;


	parseModelBuffer();
	bufferGeom.computeBoundingSphere();
	// console.log(bufferGeom);

	function parseModelBuffer() {

		//get stuff

		var PH_vertices = json.vertices,
		PH_faceIndecis = json.PH_FaceIndex,
		PH_uvIndecis = json.PH_UVindex,
		PH_normalIndecis = json.PH_customIndex,
		PH_tangents = json.PH_tangent,
		PH_binormals = json.PH_binormal,
		PH_normals = json.PH_normal,
		PH_UVs = json.uvs,
		PH_colors = json.ph_colors,
		PH_cIndex = json.PH_cIndex,

		PH_uvLayers = json.uvs.length;
		var TOTAL_FACES = PH_faceIndecis.length;
		var HAS_COLORS = false;

		if(PH_cIndex){
			HAS_COLORS = PH_cIndex.length > 0;

		}

		var i,j,k,l;

		bufferGeom.addAttribute( 'position', Float32Array , TOTAL_FACES * 3, 3 );
		bufferGeom.addAttribute( 'normal', Float32Array , TOTAL_FACES * 3, 3 );
		bufferGeom.addAttribute( 'ph_tangent', Float32Array , TOTAL_FACES * 3, 3 );
		bufferGeom.addAttribute( 'ph_binormal', Float32Array , TOTAL_FACES * 3, 3 );
		var vertAtt = bufferGeom.attributes.position.array;
		var normAtt = bufferGeom.attributes.normal.array;
		var binormAtt = bufferGeom.attributes.ph_binormal.array;
		var tangAtt = bufferGeom.attributes.ph_tangent.array;

		if( HAS_COLORS ){

			bufferGeom.addAttribute( 'ph_colors', Float8Array , TOTAL_FACES * 3, 3 );
			var colsAtt = bufferGeom.attributes.ph_colors.array;
		}

		var uvAtt = [];
		for( i = 0 ; i < PH_uvLayers ; i++ ){
			var attName = 'ph_uv' + i;
			bufferGeom.addAttribute( attName , Float32Array , TOTAL_FACES * 3, 2 );
			var thisUvAttr = bufferGeom.attributes[ attName ];
			uvAtt[i] = thisUvAttr.array;
		}

		for( i = 0; i < TOTAL_FACES; i++){

			var faceIndex = i*3; //ovo je linearno svaki vec3 vec2 po fejsovima

			for (j=0; j<3; j++){ //prodji kroz tri tacke svakog trougla

				var faceVertInd = faceIndex + j; //ovim linearno punim svaki buffer

				var vertInd = PH_faceIndecis[ faceVertInd ]; 
				var normInd = PH_normalIndecis[ faceVertInd ]; 

				if(HAS_COLORS)
					var colsInd = PH_cIndex[ faceVertInd ]; 

				//stuff with 3
				for (k=0; k<3; k++){
					var faceVComponentInd = faceVertInd * 3 + k;

					var vertOffset = vertInd * 3 + k;
					vertAtt[faceVComponentInd] = PH_vertices[ vertOffset ];

					var normOffset = normInd * 3 + k;
					normAtt[	faceVComponentInd ] = PH_normals[ normOffset ];
					binormAtt[	faceVComponentInd ] = PH_binormals[ normOffset ];
					tangAtt[	faceVComponentInd ] = PH_tangents[ normOffset ];

					if(!HAS_COLORS)
						continue;

					var colsOffset = colsInd * 3 + k; 
					colsAtt[ 	faceVComponentInd ] = PH_colors[ colsOffset ];
				}

				//stuff with 2
				for(l=0; l<PH_uvLayers; l++){
					var uvInd = PH_uvIndecis[ faceVertInd ];//za sada jer nemam u fajlu eksportovan indeks u arrayu
					// var uvInd = PH_uvIndecis[ l ][ faceVertInd ];//
					for (k=0; k<2; k++){

						var faceUVcIndex = faceVertInd * 2 + k;//main uv buffer 
						var uvOff = uvInd * 2 + k;
						uvAtt[ l ][faceUVcIndex] = PH_UVs[ l ][ uvOff ];
					}
				}
			}
		}
	}

	if ( json.materials === undefined ) {
		// return { geometry: geometry };
		return { geometry: bufferGeom };
	} else {
		console.log("OBJ:: CATASTROPHIQUE FAILURE!!!");
	}
}