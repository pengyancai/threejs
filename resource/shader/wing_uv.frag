uniform sampler2D _Tex1;
uniform sampler2D _Tex1_mask;
uniform sampler2D _Tex2;
uniform sampler2D _AlphaMask;
uniform vec3 _Color;

varying vec4 vUv;
varying vec2 uv_mask;

void main()
{
    vec4 col = texture2D(_Tex1, vUv.xy) * vec4(_Color, 1.0);

    float col_mask = texture2D(_Tex1_mask, vUv.xy).r;
    float tex2a = texture2D(_Tex2, vUv.zw).r;
    float alphaMask = texture2D(_AlphaMask, uv_mask).r;
    
    col.a = (col_mask + tex2a) * alphaMask;
    col.rgb *= col.rgb * col.a * 2.0;//暴雪技术分享的一个特效算法，看起来效果的确不错
    gl_FragColor = col;
}