import { csvParse, autoType } from 'd3-dsv';
import { feature } from 'topojson-client';
import { bbox, union } from '@turf/turf';
import { map_variable_lookup } from './config';


export function setColors(themes, theme) {
    for (let color in themes[theme]) {
      document.documentElement.style.setProperty('--' + color, themes[theme][color]);
    }
  }
  
  export function getMotion() {
    let mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)"); // Check if browser prefers reduced motion
      return !mediaQuery || mediaQuery.matches ? false : true; // return true for motion, false for no motion
  }
  
  //Data collection functions.
  export async function getData(url) {
    let response = await fetch(url);
    let string = await response.text();
    let data = await csvParse(string, autoType);
    return data;
  }
  
  export async function getTopo(url, layer) {
    let response = await fetch(url);
    let json = await response.json();
    let geojson = await feature(json, layer);
    return geojson;
  }
  
  export async function getPoint(url) {
    let response = await fetch(url);
    let json = await response.json();
    return json;
  }
  
  export function getPointTopo(url){
    getPoint(url).then(geo => {
      return geo;
    });
  }

  export function getColor(value, breaks, colors) {
    let color;
    let found = false;
    let i = 1;
    while (found == false) {
      if ((value <= breaks[i])  || (i == breaks.length + 1)) {
        color = colors[i - 1];
        found = true;
      } else {
        i ++;
      }
    }
    return color ? color : 'rgb(232, 237, 234)';
  }


  	// Functions for map component
	export function fitBounds(bounds , map_id) {
    let animation = getMotion(); // Set animation preference depending on browser preference
		if (map_id) {
			map_id.fitBounds(bounds, {animate: animation, padding: 30});
		}
	}
	export function fitById(id, map_id, geo) {
		if (geo && id) {
			let feature = geo.features.find(d => d.properties.GeoCode == id);
			let bounds = bbox(feature.geometry);
			fitBounds(bounds, map_id);
		}
	}
	export function fitFeatures(codes, map_id, geo) {
		if (map_id) {
			if (!Array.isArray(codes)) {
				codes = [codes];
			}
			let features = geo.features.filter(f => codes.includes(f.properties.GeoCode));
			let polygon = union(...features);
			let bounds = bbox(polygon);
			fitBounds(bounds, map_id);
		}
	}

