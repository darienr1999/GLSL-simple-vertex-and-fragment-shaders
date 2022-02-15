// Automatically provided by three.js
//
// uniform mat4 viewMatrix;
// uniform vec3 cameraPosition;
// uniform bool isOrthographic;

varying vec3 v_normal;
varying vec2 v_texcoord;
varying vec4 positionSpace;
varying vec4 color;

uniform vec3 u_color;
uniform sampler2D u_colorTexture;
uniform vec3 u_ambient;
uniform float slider;

void main() {
    // make up a light vector and use it for diffuse lighting
    vec3 light = vec3( 0.5, 0.2, 1.0 );
    light = normalize( light );

    // dot product of light and sorface normal
    float dProd = max(0.0,dot( v_normal, light ));

    // calculate a gray scaling value from the texture, using the typical brightness formula of rgb
    vec4 tcolor = texture2D( u_colorTexture, v_texcoord );
    vec4 gray = vec4( vec3( tcolor.r * 0.3 + tcolor.g * 0.59 + tcolor.b * 0.11 ), 1.0 );

    // calculate the diffuse color by multiplying the surface color by the dot product
    vec4 diffuse = vec4( u_color, 1.0 ) * dProd;
    vec4 ambient = vec4( u_ambient, 1.0 );

    // final color is diffuse + ambient * the gray scale of the texture

   //ivec2 size = textureSize(u_colorTexture);
    
    //float two = 5.0;
    float two = floor(5.0 + (slider * 15.0));
    float number = floor(v_texcoord.x * two) + floor(v_texcoord.y * two);

    if (mod(number, 2.0) == 0.0) {
        gl_FragColor = vec4(1,1,1,1);
    } else {
        gl_FragColor = vec4(0,0,0,1);
    }

    

   
    
    


    

}
