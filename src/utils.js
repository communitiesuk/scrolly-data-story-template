export function setColors(themes, theme) {
    for (let color in themes[theme]) {
      document.documentElement.style.setProperty('--' + color, themes[theme][color]);
    }
  }
  
  export function getMotion() {
    let mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)"); // Check if browser prefers reduced motion
      return !mediaQuery || mediaQuery.matches ? false : true; // return true for motion, false for no motion
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
