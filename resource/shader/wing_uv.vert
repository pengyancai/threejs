uniform vec2 _FlowVector1;
uniform vec2 _FlowVector2;
uniform float _Time;

uniform float _Tex1_Tiling;
uniform float _Tex1_Offset;
uniform float _Tex2_Tiling;
uniform float _Tex2_Offset;
uniform float _AlphaMask_Tiling;
uniform float _AlphaMask_Offset;

varying vec4 vUv;
varying vec2 uv_mask;

void main()
{
    vec2 Tex1_Tiling = vec2(_Tex1_Tiling, _Tex1_Tiling);
    vec2 Tex1_Offset = vec2(_Tex1_Offset, _Tex1_Offset);

    vec2 Tex2_Tiling = vec2(_Tex2_Tiling, _Tex2_Tiling);
    vec2 Tex2_Offset = vec2(_Tex2_Offset, _Tex2_Offset);

    vec2 AlphaMask_Tiling = vec2(_AlphaMask_Tiling, _AlphaMask_Tiling);
    vec2 AlphaMask_Offset = vec2(_AlphaMask_Offset, _AlphaMask_Offset);

    vUv.xy = (uv * Tex1_Tiling + Tex1_Offset) + _FlowVector1 * _Time;
    vUv.zw = (uv * Tex2_Tiling + Tex2_Offset) + _FlowVector2 * _Time;
    uv_mask = (uv * AlphaMask_Tiling + AlphaMask_Offset);

    vec3 posChanged = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(posChanged, 1.0);
}