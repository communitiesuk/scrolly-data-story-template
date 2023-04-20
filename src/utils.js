import { csvParse, autoType } from 'd3-dsv';
import { feature } from 'topojson-client';
import { bbox, union } from '@turf/turf';

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
