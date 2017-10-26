/*

支持纹理的变色以及偏移和缩放

*/

uniform sampler2D _MainTex;
uniform vec3 _Color;
uniform float _offsetX;
uniform float _offsetY;
uniform float _scaleX;
uniform float _scaleY;

varying vec2 vUv;

void main()
{
    // 对主纹理进行采样
    gl_FragColor = texture2D(_MainTex, vec2(_scaleX * (vUv.x + _offsetX), _scaleY * (vUv.y + _offsetY))) * vec4(_Color, 1);
}