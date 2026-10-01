/** Projeção leve de latitude/longitude para SVG. Não representa malha viária. */
export function geoProject(records,{width=900,height=445,padding=38}={}){
 const valid=records.filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lng));
 const lat0=valid.reduce((s,p)=>s+p.lat,0)/(valid.length||1);
 const factor=Math.max(.02,Math.cos(lat0*Math.PI/180));
 const xs=valid.map(p=>p.lng*factor),ys=valid.map(p=>-p.lat);
 const midX=(Math.min(...xs,0)+Math.max(...xs,0))/2,midY=(Math.min(...ys,0)+Math.max(...ys,0))/2;
 // Avoid 0 as a geographic anchor when all points are in another region.
 const minX=xs.length?Math.min(...xs):0,maxX=xs.length?Math.max(...xs):0;
 const minY=ys.length?Math.min(...ys):0,maxY=ys.length?Math.max(...ys):0;
 const spanX=Math.max(maxX-minX,.004*factor),spanY=Math.max(maxY-minY,.004);
 const scale=Math.min((width-2*padding)/spanX,(height-2*padding)/spanY);
 const centerX=(minX+maxX)/2,centerY=(minY+maxY)/2;
 const point=p=>({x:+(width/2+(p.lng*factor-centerX)*scale).toFixed(2),
                  y:+(height/2+(-p.lat-centerY)*scale).toFixed(2)});
 return {width,height,point,extent:{minLat:valid.length?-maxY:0,maxLat:valid.length?-minY:0,minLng:valid.length?minX/factor:0,maxLng:valid.length?maxX/factor:0}};
}
