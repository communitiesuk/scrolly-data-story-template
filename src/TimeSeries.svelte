<script>

// CORE IMPORTS
	import { onMount } from "svelte";
	import { getMotion } from "./utils.js";
	import Scroller from "./layout/Scroller.svelte";
	
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
	let xKey = "jitter"; // xKey for scatter chart
	let yKey = "GVA2020"; // yKey for scatter chart
	let zKey = "LAD_name"; // zKey (color) for scatter chart
	let rKey = null; // rKey (radius) for scatter chart
    let explore = false; // Allows chart/map interactivity to be toggled on/off
	

    	// Functions for chart and map on:select and on:hover events
	

export function doHover_chart(e) {
  hovered = e.detail.id;
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
				jitter: d.jitter,
				LAD_name: d["LAD name"],
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
				xKey = "jitter";
				yKey = "GVA2020";
				zKey = "LAD_name";
                rKey = null;
				explore = false;
			},
			chart02: () => {
				xKey = "jitter";
				yKey = "GVA2015";
				zKey = "LAD_name";
                rKey = null;
				explore = false;
			},
			chart03: () => {
				xKey = "jitter";
				yKey = "GVA2010";
				zKey = "LAD_name";
                rKey = null;
				explore = false;
			},
			chart04: () => {
				xKey = "jitter";
				yKey = "GVA2005";
				zKey = "LAD_name";
                rKey = null;
				explore = false;
			},
			chart05: () => {
				xKey = "jitter";
				yKey = "GVA2020";
				zKey = "LAD_name";
                rKey = null;
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
			
			<div class="col-full height-full">
				
					<div class="chart">
						<ScatterChart
						height="calc(100vh - 150px)"
						data={data.lsoa.indicators}
						colors={explore ? ['lightgrey'] : colors.cat2}
                        padding.top = 40
						{xKey} {yKey} {zKey} {rKey} idKey="code" labelKey="name"
						r={[5]}
                        yMax = 950
						yScale = 'log'
						xMax = 7
						xMin = 0
						xTicks = []
						ySuffix=" million"
						yFormatTick={d => d.toLocaleString()}
						legend={zKey != null} labels
						select={explore} selected={explore ? selected : null} 
						hover {hovered} on:hover={doHover_chart}
						colorSelect="#206095" colorHighlight="#999" overlayFill
						{animation}/>
						<div class="label label-y outline" style="left: 0%; top: 15%;">GVA (log scale)</div>
						<div class="label label-title" style="top: 90%;">GVA for LSOAs</div>
					</div>
				
			</div>
		</figure>
	</div>
	<div slot="foreground">
		<section data-id="chart01">
			<div class="col-medium">
				<a id="TimeSeries" style="color: black"><br><br></a>
				<p>
					This shows 2020 GVA for LSOAs in Teesside, dived up into Local Authorities.
				</p>
			</div>
		</section>
		<section data-id="chart02">
			<div class="col-medium">
				<p>
					This is the 2015 data for the same set of LSOAs.
				</p>
			</div>
		</section>
		<section data-id="chart03">
			<div class="col-medium">
				<p>
					And then we move back to 2010.
				</p>
			</div>
		</section>
		<section data-id="chart04">
			<div class="col-medium">
				<p>
					And 2005.
				</p>
			</div>
		</section>
		<section data-id="chart05">
			<div class="col-medium">
				<p>
					Finally, we can revert back to the 2020 values again.
				</p>
			</div>
		</section>
	</div>
</Scroller>
{/if}

<style>
	.label {
		position: absolute;
		font-size: 14px;
		color: #666;
	}
    .label-title {
    color: #333;
    font-weight: bold;
}
.label-y {
    position: absolute;
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