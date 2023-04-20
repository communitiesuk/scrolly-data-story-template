import { csvParse, autoType } from 'd3-dsv';
import { feature } from 'topojson-client';
import { bbox, union } from '@turf/turf';
import { map_variable_lookup } from './config';

export let hov = ''; 
export let hover_dict = {};

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

	// Functions for chart and map on:select and on:hover events
	export function doSelect(e, map_id, geo) {
		selected = e.detail.id;
		if (e.detail.feature) fitById(selected, map_id, geo); // Fit map if select event comes from map
	}
	
	export function doHover(e) {
		hovered_lad = '';
		hovered_msoa = '';	
		hovered_point = ''; 
		if (e.detail.id !== null){
			let feature_id =  e.detail.id;
			if (e.detail.feature.source == 'lad'){
				hovered_lad = feature_id; 
			}
			else if (e.detail.feature.source == 'msoa'){
				hovered_msoa = feature_id; 
			}
			else if (e.detail.feature.source == 'point'){
				hovered_point = feature_id;
			}
			else{
				hovered = feature_id;
			}
		}
		hover_dict = {"msoa": hovered_msoa, "lad": hovered_lad, "point": hovered_point};	
	}

export function doHover_chart(e) {
  hovered = e.detail.id;
}

export let hover_data_finder = function(mapKey){
  let geography_key = map_variable_lookup[mapKey].geography;
  hov = hover_dict[geography_key]
  if (hov){
    let hover_data = data[geography_key].indicators?.find(d => d.code == hov)[mapKey]
    if (hover_data == '0'){
      return "Data unavailable";
    }
    else{
      return Number(hover_data);
    }
  }
  return "";
}
export let hover_name_finder = function(mapKey){
  let geography_key = map_variable_lookup[mapKey].geography;
  hov = hover_dict[geography_key]
  if (hov) {
    return metadata[geography_key].lookup[hov].name
  } else {
    return "";
  }
}