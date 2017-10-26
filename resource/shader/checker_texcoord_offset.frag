/*

checker纹理的变色以及偏移和缩放

*/

uniform vec3 _Color1;
uniform vec3 _Color2;
uniform float _offsetX;
uniform float _offsetY;
uniform float _scaleX;
uniform float _scaleY;

varying vec2 vUv;

void main()
{
    vec2 inputUv = vUv;
    inputUv = vec2(_scaleX * (inputUv.x + _offsetX), _scaleY * (inputUv.y + _offsetY));
    vec2 uv1 = floor(fract(dot(inputUv, vec2(1, 0)))+vec2(0.5, 0.5));
    vec2 uv2 = floor(fract(dot(inputUv, vec2(0, 1)))+vec2(0.5, 0.5));
    uv1 = mix(uv1, vec2(1.0 - uv1.x, 1.0 - uv1.y), uv2);
    // gl_FragColor = vec4(uv1, uv1);
    
    gl_FragColor = mix(vec4(_Color1, 1.0), vec4(_Color2, 1.0), vec4(uv1, uv1));
}