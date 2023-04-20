<script>

// CORE IMPORTS
	import { setContext, onMount } from "svelte";
	import { getMotion } from "./utils.js";
	import { themes } from "./config.js";
	import Scroller from "./layout/Scroller.svelte";
	import Em from "./ui/Em.svelte";
	import ColourScaleLegend from "./map_components/ColourScaleLegend.svelte";
	
    // DEMO-SPECIFIC IMPORTS
	//import bbox from "@turf/bbox";
	import { getData, setColors, getTopo, getColor, fitBounds, fitById, fitFeatures} from "./utils.js";
	import { map_variable_lookup, colors, units, mapbounds } from "./config.js";
	import { Map, MapSource, MapLayer, MapTooltip } from "@onsvisual/svelte-maps";
	// CORE CONFIG (COLOUR THEMES)
	// Set theme globally (options are 'light', 'dark' or 'lightblue')
	let theme = "light";
	setContext("theme", theme);
	setColors(themes, theme);
	// CONFIG FOR SCROLLER COMPONENTS
	const threshold = 0.65;
	// State
	let animation = getMotion(); // Set animation preference depending on browser preference
	let id = {}; // Object to hold visible section IDs of Scroller components
	let idPrev = {}; // Object to keep track of previous IDs, to compare for changes
	onMount(() => {
		idPrev = {...id};
	});
	let offset;
	let index;

    // Constants
	const topojson = "./data/LAD.json";
	const mapstyle = "https://bothness.github.io/ons-basemaps/data/style-omt.json";

// Data
    let data = {lad: {}};
	let metadata = {lad: {}};
	let geojson;
	let LA_opac = 0.7;
	// Element bindings
	let map; // Bound to mapbox 'map' instance once initialised
	// State
	let selected; // Selected area (chart or map)
	let mapHighlighted = []; // Highlighted area (map only)
	let mapKey = "lat1"; // Key for data to be displayed on map
	let explore = false; // Allows chart/map interactivity to be toggled on/off

    let hov = ''; 
    let hover_dict = {};
    let hovered_lad; // Hovered lad (chart or map)

    	// Functions for chart and map on:select and on:hover events
	export function doSelect(e, map_id, geo) {
		selected = e.detail.id;
		if (e.detail.feature) fitById(selected, map_id, geo); // Fit map if select event comes from map
	}
	
	export function doHover(e) {
		hovered_lad = '';
		if (e.detail.id !== null){
			let feature_id =  e.detail.id;
      if (e.detail.feature.source == 'lad'){
				hovered_lad = feature_id; 
			}
			else{
				hovered = feature_id;
			}
		}
		hover_dict = {"lad": hovered_lad};	
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

    //Need these to be reactive.
    $: hover_name_finder(mapKey);
	$: hover_data_finder(mapKey);
    $: map_variable_lookup;
    $: hovered_lad;
    $: hover_dict;

//For the scatter/jitter plots, let's attempt to do LAD and MSOA in the same frame.
getData('./data/data_lad.csv')
	.then(arr => {
		let meta = arr.map(d => ({
				code: d.code,
				name: d.name,
				parent: d.parent ? d.parent : null
			}));
			let lookup = {};
			meta.forEach(d => {
				lookup[d.code] = d;
			});
			metadata.lad.array = meta;
			metadata.lad.lookup = lookup;
			let indicators = arr.map((d, i) => ({
				...meta[i],
                lat1: d.lat1,
                lat2: d.lat2,
                lat3: d.lat3,
                lat4: d.lat4,
                lat5: d.lat5,
			}));

            ['lat1', 'lat2', 'lat3', 'lat4', 'lat4'].forEach(key => {
					indicators.forEach((d, i) => indicators[i][key + '_color'] = getColor(d[key], map_variable_lookup.lat.scale, map_variable_lookup.lat.scale_colours));
				});
			
				data.lad.indicators = indicators;
			});

//DATA inputs
getTopo(topojson, 'data').then(geo => {
		geojson = geo;
	}); 

// FUNCTIONS (INCL. SCROLLER ACTIONS)
      
      
	// Actions for Scroller components
	const actions = {
		map: { // Actions for <Scroller/> with id="map"
		map01: () => {
				fitBounds(mapbounds.uk, map);
				mapKey = "lat1";
				mapHighlighted = [];
				explore = false;
			},
            map02: () => {
				fitBounds(mapbounds.uk, map);
				mapKey = "lat2";
				mapHighlighted = [];
				explore = false;
			},
            map03: () => {
				fitBounds(mapbounds.uk, map);
				mapKey = "lat3";
				mapHighlighted = [];
				explore = false;
			},
            map04: () => {
				fitBounds(mapbounds.uk, map);
				mapKey = "lat4";
				mapHighlighted = [];
				explore = false;
			},
            map05: () => {
				fitBounds(mapbounds.uk, map);
				mapKey = "lat5";
				mapHighlighted = [];
				explore = false;
			}
		}
	};
	// Code to run Scroller actions when new caption IDs come into view
	function runActions(codes = []) {
		codes.forEach(code => {
			if (id[code] != idPrev[code]) {
				if (actions[code][id[code]]) {
					actions[code][id[code]]();
				}
				idPrev[code] = id[code];
			}
		});
	}
	$: id && runActions(Object.keys(actions)); // Run above code when 'id' object changes

    
</script>

<!-- HTML part -->


{#if geojson && data.lad.indicators}
<Scroller {threshold} bind:index bind:offset bind:id={id['map']} splitscreen={true}>
	<div slot="background">
		<figure>
			<div class="col-full height-full">
			<Map style={mapstyle} bind:map interactive={false} location={{bounds: mapbounds.uk}}>
				<MapSource
					id="lad"
					type="geojson"
					data={geojson}
					promoteId="GeoCode"
					maxzoom={13}>
					<MapLayer
						id="lad-fill"
						idKey="code"
						colorKey={mapKey + "_color"}
						data={data.lad.indicators}
						type="fill"
						select {selected} on:select={(e) => doSelect(e, map, geojson)} clickIgnore={!explore}
						hover {hovered_lad} on:hover={doHover}
						highlight highlighted={mapHighlighted}
						paint={{
						'fill-color': ['case',
							['!=', ['feature-state', 'color'], null], ['feature-state', 'color'],
							'rgba(255, 255, 255, 0)'
						],
						'fill-opacity': 0.8
						}}
					>
					<MapTooltip content = {
								hovered_lad ? `${metadata.lad.lookup[hovered_lad].name}<br/><strong>${data.lad.indicators.find(d => d.code == hovered_lad)[mapKey].toLocaleString()} ${units[mapKey]}</strong>` : ''
							}
					/>
					</MapLayer>
					<MapLayer
						id="lad-line"
						type="line"
						paint={{
							'line-color': ['case',
								['==', ['feature-state', 'hovered'], true], 'orange',
								['==', ['feature-state', 'selected'], true], 'black',
								['==', ['feature-state', 'highlighted'], true], 'red',
								'rgba(105,105,105,0.3)'
							],
							'line-width': ['case',
								['==', ['feature-state', 'highlighted'], true], 2.5,
								0.8
						]
						}}
					/>
				/>
				</MapSource>
	
			</Map>
			</div>
			<ColourScaleLegend 
				map_key = {mapKey}
				hov = {hover_dict[map_variable_lookup[mapKey].geography]}
				highlighted_val = {(hover_dict[map_variable_lookup[mapKey].geography])? ((hover_data_finder(mapKey) == 'Data unavailable')? '-' : hover_data_finder(mapKey)): ''}
				scale_text =  {(hover_dict[map_variable_lookup[mapKey].geography])? map_variable_lookup[mapKey]['full_name'] + ' for ' + hover_name_finder(mapKey) + ': ': '\n'}
				
			/>
		</figure>
	</div>
	<div slot="foreground">
		<section data-id="map01">
			<div class="col-medium">
				<a id="SubSect_HLE" style="color: black"><br><br></a>
				<h2>Low levels of healthy life expectancy</h2>
				<p>
					The map shows local authority districts in the UK, shaded according to the expected average years of male ‘Healthy Life Expectancy’ (HLE) in each area.
				</p>
				<p>
					<Em color={colors.seq_5[4]}>Dark blue</Em> areas have the lowest (worst) levels of HLE, <Em color={colors.seq_5[0]}>light yellow</Em> the highest. Areas such as Rutland have 19 more years of healthy life expectancy than areas such as Hull.
				</p>
			</div>
		</section>
		<section data-id="map02">
			<div class="col-medium">
				<a id="SubSect_LE" style="color: black"><br><br></a>
				<h2>Low levels of life expectancy</h2>
				
				<p>
					The map shows Middle Super Output Areas (MSOAs) in Hull, shaded according to the expected average years of male life expectancy at birth in each area.  
				</p>
				<p>
					
					<Em color={colors.seq_5[4]}>Dark blue</Em> areas have the lowest (worst) levels of life expectancy, <Em color={colors.seq_5[0]}>light yellow</Em> the highest. Local areas such as Kingston upon Hull 012 (University & Newland North) have 11 more years of life expectancy than areas such as Kingston upon Hull 030 (Boulevard & St Andrew's Quay).  
				</p>
			</div>
		</section>
		<section data-id="map03">
			<div class="col-medium">
				<a id="SubSect_prevdeath" style="color: black"><br><br></a>
				<h2>High levels of preventable deaths </h2>
				
				<p>
					The map shows MSOAs in Hull, shaded according to the average rate of preventable deaths in each area, compared to the average for England. 
				</p>
				<p>
					<Em color={colors.seq_5[4]}>Dark blue</Em> areas have the highest (worst) levels of preventable deaths, <Em color={colors.seq_5[0]}>light yellow</Em> the lowest.  
				</p>
			</div>
		</section>
		<section data-id="map04">
			<div class="col-medium">
				<a id="SubSect_obesity" style="color: black"><br><br></a>
				<h2>High levels of child obesity</h2>
				<p>
					The map shows MSOAs in Hull, shaded according to the average levels of child obesity in each area.  
				</p>
				<p>
					Again, <Em color={colors.seq_5[4]}>dark blue</Em> areas have the highest (worst) levels of child obesity, <Em color={colors.seq_5[0]}>light yellow</Em> the lowest. 
				</p>
			</div>
		</section>
		<section data-id="map05">
			<div class="col-medium">
				<a id="SubSect_obesity" style="color: black"><br><br></a>
				<h2>High levels of child obesity</h2>
				<p>
					The map shows MSOAs in Hull, shaded according to the average levels of child obesity in each area.  
				</p>
				<p>
					Again, <Em color={colors.seq_5[4]}>dark blue</Em> areas have the highest (worst) levels of child obesity, <Em color={colors.seq_5[0]}>light yellow</Em> the lowest. 
				</p>
			</div>
		</section>
	</div>
</Scroller>
{/if}

