function noiseTex(texSize, alpha){


	if(alpha){
		var subPixel = 4; 
	} else {
		var subPixel = 3;
	}

	// var arraySize = texSize * texSize * 4;//rgba
	var arraySize = texSize * texSize * subPixel;//rgba
	console.log('noiseTex() arraySize = ' + arraySize);
	var pixelArray = new Uint8Array(arraySize);
	console.log('noiseTex() pixelArray = ' + pixelArray);
	

	for (var i = 0; i < texSize; i++){//udji u red
		for (var k = 0; k < texSize; k++){//udji u kolonu
			
			// console.log('pixel ' + ((i*texSize)+k) );


			for (var j = 0; j < subPixel; j++){
				var index = subPixel*(i*texSize+k) + j;//w00t!
				var r = Math.random();
				// var r = 255;
				r *= 255;
				// console.log(r);
				pixelArray[index] = r;
				// console.log('index ' + index + '= ' + pixelArray[index]);
			}
		}
	}
	var tex = new THREE.DataTexture(
		pixelArray , 
		texSize ,
		texSize ,
		alpha ? THREE.RGBAFormat : THREE.RGBFormat
	);
	tex.minFilter = THREE.NearestFilter;
	tex.magFilter = THREE.NearestFilter;
	tex.needsUpdate=true;
	tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
	return tex;
}