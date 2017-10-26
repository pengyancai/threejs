/*



*/

uniform vec3 light;
uniform vec3 color1;
uniform vec3 color2;

varying vec3 vNormal;

void main()
{
    float diffuse = dot(normalize(light), vNormal);
    float dir = length(vNormal * vec3(0.0, 0.0, 1.0));
    if (dir < 0.5)
    {
        gl_FragColor = vec4(color2, 1.0);
    }
    else
    {
        if (diffuse > 0.8)
        {
            diffuse = 1.0;
        }
        else if (diffuse > 0.5)
        {
            diffuse = 0.6;
        }
        else if (diffuse > 0.2)
        {
            diffuse = 0.4;
        }
        else
        {
            diffuse = 0.2;
        }
        gl_FragColor = vec4( color1 * diffuse, 1.0);
    }
}
