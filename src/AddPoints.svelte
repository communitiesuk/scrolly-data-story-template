<script>

// CORE IMPORTS
	import { setContext, onMount } from "svelte";
	import { getMotion } from "./utils.js";
	import { themes } from "./config.js";
	import Scroller from "./layout/Scroller.svelte";
	import ColourScaleLegend from "./map_components/ColourScaleLegend.svelte";
	
    // DEMO-SPECIFIC IMPORTS
	//import bbox from "@turf/bbox";
	import { getData, setColors, getTopo, getPoint, getColor, fitBounds, fitById, fitFeatures} from "./utils.js";
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
	const topojson = "./data/tees_lsoas.json";
    const point_json = "./data/LA_centroid.json"
	const mapstyle = "https://bothness.github.io/ons-basemaps/data/style-omt.json";

// Data
    let data = {lsoa: {}, point: {}};
	let metadata = {lsoa: {}, point: {}};
	let geojson;
    let point_geo;
	let LA_opac = 0.7;
	// Element bindings
	let map; // Bound to mapbox 'map' instance once initialised
	// State
	let selected; // Selected area (chart or map)
	let mapHighlighted = []; // Highlighted area (map only)
	let mapKey = "GVA2020"; // Key for data to be displayed on map
	let explore = false; // Allows chart/map interactivity to be toggled on/off

    let hov = ''; 
    let hover_dict = {};
    let hovered_lsoa; // Hovered lsoa (chart or map)
    let hovered_point;

    	// Functions for chart and map on:select and on:hover events
	export function doSelect(e, map_id, geo) {
		selected = e.detail.id;
		if (e.detail.feature) fitById(selected, map_id, geo); // Fit map if select event comes from map
	}
	
	export function doHover(e) {
		hovered_lsoa = '';
        hovered_point = '';
		if (e.detail.id !== null){
			let feature_id =  e.detail.id;
      if (e.detail.feature.source == 'lsoa'){
				hovered_lsoa = feature_id; 
			}
            else if (e.detail.feature.source == 'point'){
                hovered_point = feature_id;
            }
			else{
				hovered = feature_id;
			}
		}
		hover_dict = {"lsoa": hovered_lsoa, "point": hovered_point};	
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
    $: hovered_lsoa;
    $: hover_dict;

//For the scatter/jitter plots, let's attempt to do lsoa and MSOA in the same frame.
getData('./data/data_lsoa.csv')
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
			metadata.lsoa.array = meta;
			metadata.lsoa.lookup = lookup;
			let indicators = arr.map((d, i) => ({
				...meta[i],
                GVA2020: d.GVA2020,
                GVA2020_faint: d.GVA2020,
                GVA2015: d.GVA2015,
                GVA2010: d.GVA2010,
                GVA2005: d.GVA2005,
                workplace_pop: d.workplace_pop,
			}));

            ['GVA2020', 'GVA2015', 'GVA2010', 'GVA2005', 'workplace_pop', 'GVA2020_faint'].forEach(key => {
                indicators.forEach((d, i) => indicators[i][key + '_color'] = getColor(d[key], map_variable_lookup[key].scale, map_variable_lookup[key].scale_colours));
				});
			
				data.lsoa.indicators = indicators;
			});

            getData(`./data/data_points.csv`)
		.then(arr => {
			let meta = arr.map(d => ({
				code: d.code,
				name: d.name,
			}));
			let lookup = {};
			meta.forEach(d => {
				lookup[d.code] = d;
			});
			metadata.point.array = meta;
			metadata.point.lookup = lookup;
		});

//DATA inputs
    getTopo(topojson, 'data').then(geo => {
		geojson = geo;
	}); 
    getPoint(point_json).then(geo => {
		point_geo = geo;
	});

// FUNCTIONS (INCL. SCROLLER ACTIONS)
      
      
	// Actions for Scroller components
	const actions = {
		map: { // Actions for <Scroller/> with id="map"
		map01: () => {
				fitBounds(mapbounds.teesside, map);
				mapKey = "GVA2020";
				mapHighlighted = [];
				explore = false;
			},
            map02: () => {
				fitBounds(mapbounds.teesside, map);
				mapKey = "GVA2020_faint";
				mapHighlighted = [];
				explore = false;
			}		}
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


{#if geojson && data.lsoa.indicators}
<Scroller {threshold} bind:index bind:offset bind:id={id['map']} splitscreen={true}>
	<div slot="background">
		<figure>
            <div id="points-legend" class="legend" style="display: none; left: 60%, width: 35%; position: absolute">
				<h4>Local Authorities</h4>
				<div><span style="background-color: #DF0667"></span>Middlesbrough</div>
				<div><span style="background-color: #A8BD3A"></span>Darlington</div>
				<div><span style="background-color: #FBC900"></span>Stockton-on-Tees</div>
				<div><span style="background-color: #27A0CC"></span>Hartlepool</div>
				<div><span style="background-color: #206095"></span>Redcar and Cleveland</div>
				<div><span style="background-color: #0F8243"></span>County Durham</div>
				
			</div>
			<div class="col-full height-full">
			<Map style={mapstyle} bind:map interactive={false} location={{bounds: mapbounds.teesside}}>
				<MapSource
					id="lsoa"
					type="geojson"
					data={geojson}
					promoteId="GeoCode"
					maxzoom={13}>
					<MapLayer
						id="lsoa-fill"
						idKey="code"
						colorKey={mapKey + "_color"}
						data={data.lsoa.indicators}
						type="fill"
						select {selected} on:select={(e) => doSelect(e, map, geojson)} clickIgnore={!explore}
						hover {hovered_lsoa} on:hover={doHover}
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
								hovered_lsoa ? `${metadata.lsoa.lookup[hovered_lsoa].name}<br/><strong>${data.lsoa.indicators.find(d => d.code == hovered_lsoa)[mapKey].toLocaleString()} ${units[mapKey]}</strong>` : ''
							}
					/>
					</MapLayer>
					<MapLayer
						id="lsoa-line"
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
                <MapSource
                id="point"
                type="geojson"
                data={point_geo}
                promoteId="GeoCode"
                maxzoom={13}>
                    {#if offset > 0.1 && index > 0} 
                        {document.getElementById('points-legend').style = 'display: block; left: 60%, width: 35%; position: absolute'}
                        <MapLayer
                            id="point-circle"
                            idKey="GeoCode"
                            type="circle"
                            hover {hovered_point} on:hover={doHover}
                            paint={{
                                'circle-color': ['match', ['get', 'LAD21NM'],        
                                'Middlebrough', '#DF0667',                
                                'Darlington', '#A8BD3A', 
                                'Stockton-on-Tees', '#FBC900',
                                'Hartlepool', '#27A0CC',
                                'Redcar and Cleveland', '#206095',
                                'County Durham', '#0F8243',   
                                'red'], 
                                'circle-radius':20
                                }}
                            >
                            <MapTooltip content = {
								hovered_point ? `${metadata.point.lookup[hovered_point].name}` : ''
							}
					/>
                </MapLayer>
                    {/if}
                    {#if index==0 && map.getLayer('point-circle')}
                    {document.getElementById('points-legend').style = 'display: none; left: 60%, width: 35%; position: absolute'}
                    {map.removeLayer('point-circle')}
                    {/if}					
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
                <a id="AddPoints" style="color: black"><br><br></a>
				<p>
					This is the LSOA data for GVA.
				</p>
			</div>
		</section>
		<section data-id="map02">
			<div class="col-medium">
				<p>
                    We can add points on top. In this case, these are the centroids of Local Authorities, which aren't especially interesting. However, we can introduce a hover which tells us the name of each point alongside the legend which we can bring up on this transition.
				</p>
			</div>
		</section>
	</div>
</Scroller>
{/if}

<style>
.legend {
	background-color: #fff;
	border-radius: 3px;
	top: 30px;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
	padding: 10px;
	position: absolute;
	left: 10px;
	z-index: 1;	
}	 
	.legend h4 {
	margin: 0 0 10px;
	} 
	.legend div span {
	border-radius: 50%;
	display: inline-block;
	height: 10px;
	margin-right: 5px;
	width: 10px;
	}

</style>