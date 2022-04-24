
#ifdef LINT
precision mediump float;
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
#endif

uniform sampler2D tDiffuse;
uniform float uTime;

#define M_PI 3.14159265358979323846

varying vec4 vColor;
varying vec2 vUv;
varying vec3 vNormal;

const float range=.1;
const float noiseQuality=250.;
const float noiseIntensity=.003;
const float offsetIntensity=.003;
const float colorOffsetIntensity=.5;

/* Color palette */
#define BLACK vec3(0.,0.,0.)
#define WHITE vec3(1.,1.,1.)
#define RED vec3(1.,0.,0.)
#define GREEN vec3(0.,1.,0.)
#define BLUE vec3(0.,0.,1.)
#define YELLOW vec3(1.,1.,0.)
#define CYAN vec3(0.,1.,1.)
#define MAGENTA vec3(1.,0.,1.)
#define ORANGE vec3(1.,.5,0.)
#define PURPLE vec3(1.,0.,.5)
#define LIME vec3(.5,1.,0.)
#define ACQUA vec3(0.,1.,.5)
#define VIOLET vec3(.5,0.,1.)
#define AZUR vec3(0.,.5,1.)

/* Controls */
uniform float noiseAmount;
uniform float noiseScale;
uniform float noiseSpeed;
uniform float userNoiseAmount;

vec3 rgb2hsv(vec3 c)
{
	vec4 K=vec4(0.,-1./3.,2./3.,-1.);
	vec4 p=mix(vec4(c.bg,K.wz),vec4(c.gb,K.xy),step(c.b,c.g));
	vec4 q=mix(vec4(p.xyw,c.r),vec4(c.r,p.yzx),step(p.x,c.r));
	
	float d=q.x-min(q.w,q.y);
	float e=1.e-10;
	return vec3(abs(q.z+(q.w-q.y)/(6.*d+e)),d/(q.x+e),q.x);
}

vec3 hsv2rgb(vec3 c)
{
	vec4 K=vec4(1.,2./3.,1./3.,3.);
	vec3 p=abs(fract(c.xxx+K.xyz)*6.-K.www);
	return c.z*mix(K.xxx,clamp(p-K.xxx,0.,1.),c.y);
}

float noise(vec2 p)
{
	return fract(sin(dot(p,vec2(12.9898,78.233)))*noiseQuality);
}

void main(){
	gl_FragColor=vColor;
	
	vec2 p=vUv*noiseScale;
	p.x+=uTime*noiseSpeed;
	p.y+=uTime*noiseSpeed;
	// float n=2.*((noise(p)*noiseAmount)-.5);
	float n=((noise(p)*noiseAmount))*userNoiseAmount;
	
	vec4 color=texture2D(tDiffuse,vUv);
	color.rgb/=color.a;
	// Apply contrast
	color.rgb+=n;
	
	color.rgb*=color.a;
	
	gl_FragColor=color;
	// gl_FragColor=vec4(AZUR,1.);
}