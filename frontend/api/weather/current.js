const WMO_CODES = {
  0:'Clear',1:'Sunny',2:'Partly Cloudy',3:'Overcast',45:'Fog',48:'Fog',
  51:'Drizzle',53:'Drizzle',55:'Drizzle',56:'Freezing Drizzle',57:'Freezing Drizzle',
  61:'Rain',63:'Rain',65:'Heavy Rain',66:'Freezing Rain',67:'Freezing Rain',
  71:'Light Snow',73:'Snow',75:'Heavy Snow',77:'Snow Grains',
  80:'Rain Showers',81:'Rain Showers',82:'Heavy Rain Showers',
  85:'Snow Showers',86:'Snow Showers',
  95:'Thunderstorm',96:'Thunderstorm with Hail',99:'Thunderstorm with Hail',
};
function wmo(c){ return WMO_CODES[c]||'Unknown'; }
export const config = { runtime: 'edge' };
export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city');
  if (!city) return new Response(JSON.stringify({error:'city required'}),{status:400});
  try {
    const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=10&language=en&format=json`);
    const geoData = await geo.json();
    if (!geoData.results?.length) return new Response(JSON.stringify({error:'City not found'}),{status:404});
    const r = geoData.results.find(x=>x.country==='India')||geoData.results[0];
    const {latitude,longitude,timezone} = r;
    const weather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=${encodeURIComponent(timezone)}&forecast_days=1`);
    const wd = await weather.json();
    const cw = wd.current_weather;
    const location = {city:r.name,state:r.admin1?.name||'',country:r.country,latitude,longitude,timezone,display_name:`${r.name}, ${r.admin1?.name||''}, ${r.country}`.replace(/, ,/g,',').replace(/^, |, $/,'')};
    const current = {temperature:cw.temperature,condition:wmo(cw.weathercode),weatherCode:cw.weathercode,windSpeed:cw.windspeed,windDirection:cw.winddirection,precipitationProbability:0,precipitation:0,humidity:0};
    return new Response(JSON.stringify({location,current}),{headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}});
  } catch(e){ return new Response(JSON.stringify({error:e.message}),{status:500}); }
}
