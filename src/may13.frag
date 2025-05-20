precision highp float;

out vec4 fragColor;
uniform vec2 u_resolution;
uniform float radius;
uniform float alpha;

float sdfSphere(vec3 p, vec3 center){
    return length(p-center)-radius;
}

float sdBox( vec3 p, vec3 b )
{
  vec3 q = abs(p-vec3(0,-0.5,1)) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float smin( float a, float b, float k )
{
    k *= log(2.0);
    float x = b-a;
    return a + x/(1.0-exp2(x/k));
}

float sdf(vec3 p){
    return sdfSphere(p, vec3(0.0));
}

vec3 rayStep(vec3 p, vec3 ray){
    return p+sdf(p)+ray;
}

vec3 rayMarching(vec3 pos, vec3 ray){
    for (int i=0; i<50; i++){
        if (sdf(pos)<0.005){
            return pos;
        }
        pos = pos + sdf(pos)*ray;
    }
    return vec3(10000.0);
}

vec3 normal(vec3 p){
    float eps=0.001;
    float fx=((sdf(p+vec3(eps,0,0))-sdf(p))/eps);
    float fy=((sdf(p+vec3(0,eps,0))-sdf(p))/eps);
    float fz=((sdf(p+vec3(0,0,eps))-sdf(p))/eps);
    return normalize(vec3(fx,fy,fz));
}

void main(){
    vec2 p = gl_FragCoord.xy/u_resolution.x;

    p = 2.0*p - 1.0;
    vec3 camera = vec3(0.0, 0.0, 20.0);
    vec3 cdir = vec3(0.0,0.0,-1.0);
    vec3 up = vec3(0.0,1.0,0.0);
    vec3 right = normalize(cross(cdir,up));
    float depth = 20.0;
    vec3 ray = p.x*right + p.y*up + depth*cdir;
    ray = normalize(ray);
    vec3 lightray = normalize(vec3(0,1,1));

    vec3 pos = rayMarching(camera, ray);
    if (sdf(pos)<0.02){
        float diff = dot(lightray, normal(pos));
        fragColor=vec4(diff,diff,alpha*diff, 1.0);
    }
    else{
        fragColor=vec4(0.0,0.0,0.0,1.0);
    }
}
