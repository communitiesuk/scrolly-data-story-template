<script>

// CORE IMPORTS
	import { setContext, onMount } from "svelte";
	import { getMotion } from "./utils.js";
	import { themes } from "./config.js";
	import Scroller from "./layout/Scroller.svelte";
	import Em from "./ui/Em.svelte";
	//import ColourScaleLegend from "./map_components/ColourScaleLegend.svelte";
	
    // DEMO-SPECIFIC IMPORTS
	//import bbox from "@turf/bbox";
	import { getData, setColors, getTopo, getColor, fitBounds, fitById, fitFeatures} from "./utils.js";
	import { map_variable_lookup, colors, units, mapbounds } from "./config.js";
    import { ScatterChart, LineChart, BarChart } from "@onsvisual/svelte-charts";

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


// Data
    let data = {lsoa: {}};
	let metadata = {lsoa: {}};
	let LA_opac = 0.7;
	// Element bindings
	// State
	let selected; // Selected area (chart or map)
	
    let hov = ''; 
    let hover_dict = {};
    let hovered_lsoa; // Hovered lsoa (chart or map)

    let hovered;
	let xKey = "GVA2020"; // xKey for scatter chart
	let yKey = null; // yKey for scatter chart
	let zKey = null; // zKey (color) for scatter chart
	let rKey = 0.5; // rKey (radius) for scatter chart
    let explore = false; // Allows chart/map interactivity to be toggled on/off
	

    	// Functions for chart and map on:select and on:hover events
	

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
                GVA2015: d.GVA2015,
                GVA2010: d.GVA2010,
                GVA2005: d.GVA2005,
                workplace_pop: d.workplace_pop,
			}));

            ['GVA2020', 'GVA2015', 'GVA2010', 'GVA2005', 'workplace_pop'].forEach(key => {
                indicators.forEach((d, i) => indicators[i][key + '_color'] = getColor(d[key], map_variable_lookup[key].scale, map_variable_lookup[key].scale_colours));
				});
			
				data.lsoa.indicators = indicators;
			});


// FUNCTIONS (INCL. SCROLLER ACTIONS)
      
      
	// Actions for Scroller components
	const actions = {
		chart: { // Actions for <Scroller/> with id="map"
		chart01: () => {
				xKey = "GVA2020";
				yKey = null;
				zKey = null;
				explore = false;
			},
            chart02: () => {
				xKey = "GVA2020";
				yKey = "workplace_pop";
				zKey = null;
				explore = false;
			},
            chart03: () => {
				xKey = "GVA2010";
				yKey = "workplace_pop";
				zKey = null;
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

{#if data.lsoa.indicators}
<Scroller {threshold} bind:id={id['chart']} splitscreen={true}>
	<div slot="background">
		<figure>
<!--			<div class="label" style="left: 30%; top: 10%;">&larr; Less deprived</div>
			<div class="label" style="left: 65%; top: 10%;">More deprived &rarr;</div>
	-->		
			<div class="col-wide height-full">
				
					<div class="chart">
						<ScatterChart
						height="calc(100vh - 150px)"
						data={data.lsoa.indicators}
						colors={explore ? ['lightgrey'] : colors.cat}
						{xKey} {yKey} {zKey} {rKey} idKey="code" labelKey="name"
						r={[5]}
						ySuffix=" years"
						yFormatTick={d => d.toLocaleString()}
						legend={zKey != null} labels
						select={explore} selected={explore ? selected : null} 
						hover {hovered} on:hover={doHover_chart}
						colorSelect="#206095" colorHighlight="#999" overlayFill
						{animation}/>
						{#if yKey=='male_HLE'}
						<div class="label label-y outline" style="left: calc(20px + 5%); top: 80px;">Higher healthy life expectancy &rarr;</div>
						{:else if yKey == "male_le"}
						<div class="label label-y outline" style="left: calc(20px + 5%); top: 80px;">Higher life expectancy &rarr;</div>
						{:else}
						<div class="label label-y outline" style="left: calc(20px + 5%); top: 80px;">Higher life expectancy &rarr;</div>
						{/if}
						
						<div class="label label-title" style="top: 92%;">
							{#if yKey == "male_HLE"}
							Male Healthy Life Expectancy at birth (2018-2020) for English local authorities, grouped by Index of Multiple Deprivation decile (2019)
							{:else if yKey == "male_le"}
							Male Life Expectancy at birth (2016-2020) for MSOAs in Hull against Index of Multiple Deprivation (2019)
							{:else}
							Male Life Expectancy at birth (2016-2020) for MSOAs in Hull against Index of Multiple Deprivation (2019)
							{/if}
						</div>
					</div>
				
			</div>
		</figure>
	</div>
	<div slot="foreground">
		<section data-id="chart01">
			<div class="col-medium">
				<a id="SubSect_NatJitter" style="color: black"><br><br></a>
				<h2>Nationally, health inequalities are correlated with spatial inequalities and deprivation </h2>
				<p>
					Spatial inequalities severely limit the UK's productivity and opportunities for economic growth.   
				</p>
				<p>
					The areas in England with the lowest levels of healthy life expectancy are also the areas with the highest levels of deprivation.  
				</p>
				<p>
					The chart shows healthy male life expectancy for local areas in England, grouped by their Index of Multiple Deprivation.
				</p>
			</div>
		</section>
		<section data-id="chart02">
			<div class="col-medium">
				<a id="SubSect_LocalJitter" style="color: black"><br><br></a>
				<h2>Locally, health inequalities are correlated with spatial inequalities and deprivation </h2>
				<p>
					At local level, those areas with the lowest levels of life expectancy are also the areas with the highest levels of deprivation.  
				</p>
				<p>
					The chart shows male life expectancy for MSOAs in Hull, grouped by their Index of Multiple Deprivation.
				</p>
			</div>
		</section>
		<section data-id="chart03">
			<div class="col-medium">
				<a id="SubSect_LocalScatter" style="color: black"><br><br></a>
				<h2>Locally, health inequalities are correlated with spatial inequalities and deprivation </h2>
				<p>
					At local level, those areas with the lowest levels of life expectancy are also the areas with the highest levels of deprivation.  
				</p>
				<p>
					The chart shows male life expectancy for MSOAs in Hull against their Index of Multiple Deprivation.
				</p>
			</div>
		</section>
	</div>
</Scroller>
{/if}

<style>
.label-title {
    color: #333;
    font-weight: bold;
}
.label-y {
    top: 0px;
    text-align: right;
    -webkit-writing-mode: vertical-rl;
    -ms-writing-mode: tb-rl;
    writing-mode: vertical-rl;
    -webkit-transform: rotate(-180deg);
    -ms-transform: rotate(-180deg);
    transform: rotate(-180deg);
}
</style>