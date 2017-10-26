varying vec2 vUv;
void main()
{
    vUv = uv;
    vec3 posChanged = position;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(posChanged, 1.0);
}