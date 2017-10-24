uniform float time;
varying vec2 vUv;
void main()
{
    vUv = uv;
    vec3 posChanged = position;
    posChanged.x = posChanged.x * (abs(sin(time*1.0)));
    posChanged.y = posChanged.y * (abs(cos(time*1.0)));
    posChanged.z = posChanged.z * (abs(sin(time*1.0)));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(posChanged, 1.0);
}