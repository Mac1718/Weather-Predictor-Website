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
    const now = Date.now();
    const weather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m&timezone=${encodeURIComponent(timezone)}&forecast_days=3`);
    const wd = await weather.json();
    const {time,temperature_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m} = wd.hourly;
    const hourly = time.map((t,i)=>{
      const dt = new Date(t+'Z');
      if (dt.getTime() < now - 3600000) return null;
      return {time:dt.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:false}),temperature:Math.round(temperature_2m[i]??0),precipitationProbability:precipitation_probability?.[i]??0,precipitation:precipitation?.[i]??0,windSpeed:Math.round(wind_speed_10m?.[i]??0),weatherCode:weather_code?.[i]??0,condition:wmo(weather_code?.[i]??0)};
    }).filter(Boolean).slice(0,24);
    const location = {city:r.name,state:r.admin1?.name||'',country:r.country,latitude,longitude,timezone,display_name:`${r.name}, ${r.admin1?.name||''}, ${r.country}`.replace(/, ,/g,',').replace(/^, |, $/,'')};
    return new Response(JSON.stringify({location,hourly}),{headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}});
  } catch(e){ return new Response(JSON.stringify({error:e.message}),{status:500}); }
}
