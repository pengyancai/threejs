function pattTex(texSize){

	var arraySize = texSize * texSize * 4;//rgba
	var pixelArray = new Uint8Array(arraySize);
	
	for (var i = 0; i < texSize; i++){//udji u red
		for (var k = 0; k < texSize; k++){//udji u kolo
			// for (var j = 0; j < 4; j++){
				var index = 4*(i*texSize+k) ;//w00t!
				// console.log( index );
				var r1 = Math.random();
				// console.log(r1);
				r1 *= 255;
				pixelArray[index] = r1;
				
				index++;
				r1 = Math.random();
				pixelArray[index] = r1 * 255;

				index++;
				var r4 = Math.cos(r1 * 2 * Math.PI);
				r4 = r4 * .5 + .5; 
				r4 *= 255;
				pixelArray[index] = r4;
				
				index++;
				var r4 = Math.sin(r1 * 2 * Math.PI);
				r4 = r4 * .5 + .5; 
				r4 *= 255;
				pixelArray[index] = r4;


				// console.log(r);
				// console.log('index ' + index + '= ' + pixelArray[index]);
			// }
		}
	}
	var tex = new THREE.DataTexture(
		pixelArray , 
		texSize ,
		texSize ,
		THREE.RGBAFormat
	);
	tex.minFilter = THREE.NearestFilter;
	tex.magFilter = THREE.NearestFilter;
	tex.needsUpdate=true;
	tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
	return tex;
}