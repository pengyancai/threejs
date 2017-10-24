uniform float resolution;
uniform sampler2D texture;
varying vec2 vUv;
void main()
{
    vec2 uv = vUv;
    vec3 color = texture2D(texture, uv).rgb;
    gl_FragColor = vec4(color, 1.0);
    //gl_FragColor = vec4(1.0, 0, 0, 1.0);
}