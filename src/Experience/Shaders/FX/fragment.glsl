
#ifdef LINT
precision mediump float;
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
#endif

uniform sampler2D tDiffuse;
uniform float uTime;
uniform float uAmount;
uniform float userFlickerAmount;

#define M_PI 3.14159265358979323846

varying vec4 vColor;
varying vec2 vUv;
varying vec3 vNormal;

const float range=.1;
const float noiseQuality=250.;
const float noiseIntensity=.003;
const float offsetIntensity=.003;
const float colorOffsetIntensity=.5;

float rand(vec2 co)
{
	return fract(sin(dot(co.xy,vec2(12.9898,78.233)))*43758.5453);
}

float verticalBar(float pos,float uvY,float offset)
{
	float edge0=(pos-range);
	float edge1=(pos+range);
	
	float x=smoothstep(edge0,pos,uvY)*offset;
	x-=smoothstep(pos,edge1,uvY)*offset;
	return x;
}

void main()
{
	vec2 uv=vUv;
	float iTime=uTime;
	vec4 original=texture2D(tDiffuse,uv);
	
	for(float i=0.;i<.71;i+=.1313)
	{
		float d=mod(iTime*i,1.7);
		float o=sin(1.-tan(iTime*.24*i));
		o*=offsetIntensity;
		uv.x+=verticalBar(d,uv.y,o);
	}
	
	float uvY=uv.y;
	uvY*=noiseQuality;
	uvY=float(int(uvY))*(1./noiseQuality);
	float noise=rand(vec2(iTime*.00001,uvY));
	uv.x+=noise*noiseIntensity;
	
	vec2 offsetR=vec2(.006*sin(iTime),0.)*colorOffsetIntensity;
	vec2 offsetG=vec2(.0073*(cos(iTime*.97)),0.)*colorOffsetIntensity;
	
	float r=texture2D(tDiffuse,uv+offsetR).r;
	float g=texture2D(tDiffuse,uv+offsetG).g;
	float b=texture2D(tDiffuse,uv).b;
	
	vec4 tex=vec4(r,g,b,1.);
	gl_FragColor=mix(original,tex,uAmount*userFlickerAmount);
	
}

// void main(){
	// 	gl_FragColor=vColor;
	// 	vec4 color=texture2D(tDiffuse,vUv);
	// 	gl_FragColor=color;
// }