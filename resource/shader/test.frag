/*

支持两个贴花纹理的变色以及偏移和旋转

*/

uniform sampler2D _MainTex;
uniform vec3 _Color;
uniform vec2 _uvOffset1;
uniform vec2 _uvOffset2;
uniform float _Angle1;
uniform float _Angle2;
uniform vec3 _DecalCol;
uniform sampler2D _DecalTex;

varying vec2 vUv;

vec2 Rotating(vec2 uv , float angle)
{
	vec2 uv_rotation = uv - vec2(0.5, 0.5);   //uv原点转移到UV中心点
	// θ旋转角度  UV旋转 (xcosθ - ysinθ,xsinθ+ycosθ)
	uv_rotation = vec2(uv_rotation.x * cos(-angle) - uv_rotation.y * sin(-angle), uv_rotation.x * sin(-angle) + uv_rotation.y * cos(-angle));
	//UV中心转移回原来原点位置
	uv_rotation += vec2(0.5, 0.5); 
	return uv_rotation;
}
void main()
{
    vec2 uv_MainTex = vUv;
    vec2 uv_DecalTex = vUv;
    
    // 对主纹理进行采样
    vec4 c = texture2D(_MainTex, uv_MainTex) * vec4(_Color, 1);
	
	// 对两个细节纹理的UV进行偏移和旋转的计算
	vec2 uv_d1 =  Rotating(uv_DecalTex + _uvOffset1, _Angle1);
	vec2 uv_d2 =  Rotating(uv_DecalTex + _uvOffset2, _Angle2);
    
	// 对两个细节纹理进行采样
    float decal1 = texture2D(_DecalTex, uv_d1 ).a;  
	float decal2 = texture2D(_DecalTex, uv_d2 ).a;  

	// 混合细节纹理
    c.rgb = mix (c.rgb, c.rgb *_DecalCol.rgb, decal1 + decal2);
    
    gl_FragColor = c;
}