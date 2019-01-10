/*jshint esversion: 6 */

export const vertBasicShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

/** 
 * fragment shader used for main page slider with light 
 */
export const fragSliderWithLight = `
varying vec2 vUv;
uniform float dispFactor;
uniform sampler2D disp;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform float angle1;
uniform float angle2;
uniform float intensity1;
uniform float intensity2;
uniform float uMouseX;
uniform float uMouseY;
uniform float pixelRatio;

mat2 getRotM(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}
void main() {
    vec2 uGlobalCursorPosition = vec2(uMouseX, uMouseY);
    vec2 delta = uGlobalCursorPosition - vec2(gl_FragCoord.x, gl_FragCoord.y);
    float dist = delta.x*delta.x + delta.y*delta.y;
    float intens = exp(-dist/(40000.0 * pixelRatio)) * (1.0 - 0.05) + 0.8;
    vec4 light = vec4(.0,.0,.0,1) + vec4(vec3(1.0,1.0,0.98) * intens, 1);

    vec4 disp = texture2D(disp, vUv);
    vec2 dispVec = vec2(disp.r, disp.g);
    vec2 distortedPosition1 = vUv + getRotM(angle1) * dispVec * intensity1 * dispFactor;
    vec2 distortedPosition2 = vUv + getRotM(angle2) * dispVec * intensity2 * (1.0 - dispFactor);
    vec4 _texture1 = texture2D(texture1, distortedPosition1);
    vec4 _texture2 = texture2D(texture2, distortedPosition2);
    gl_FragColor = mix(_texture1, _texture2, dispFactor) * light;
}
`;

export const fragSlider = `
varying vec2 vUv;
uniform float dispFactor;
uniform sampler2D disp;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform float angle1;
uniform float angle2;
uniform float intensity1;
uniform float intensity2;
uniform float pixelRatio;

mat2 getRotM(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}
void main() {
    vec4 disp = texture2D(disp, vUv);
    vec2 dispVec = vec2(disp.r, disp.g);
    vec2 distortedPosition1 = vUv + getRotM(angle1) * dispVec * intensity1 * dispFactor;
    vec2 distortedPosition2 = vUv + getRotM(angle2) * dispVec * intensity2 * (1.0 - dispFactor);
    vec4 _texture1 = texture2D(texture1, distortedPosition1);
    vec4 _texture2 = texture2D(texture2, distortedPosition2);
    gl_FragColor = mix(_texture1, _texture2, dispFactor);
}
`;

/**
 * simple liquid distortion shader effect
 */
export const fragLiquidDistortion = `
varying vec2 vUv;
uniform float dispFactor;
uniform sampler2D texture;
uniform float angle;
uniform float pixelRatio;
uniform float frequency;
uniform float amplitude;
uniform float speed;

void main() {
    float distortionX=sin(vUv.y*frequency+angle*500.0*speed)*amplitude;
    float distortionY=cos(vUv.x*frequency+angle*700.0*speed)*amplitude;
    vec4 color=texture2D(texture,vec2(vUv.x+distortionX, vUv.y+distortionY+0.1));
    
    gl_FragColor = color * dispFactor;
}
`;