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
	let xKey = "rank"; // xKey for scatter chart
	let yKey = "GVA"; // yKey for scatter chart
	let zKey = null; // zKey (color) for scatter chart
	let rKey = null; // rKey (radius) for scatter chart
    let explore = false; // Allows chart/map interactivity to be toggled on/off
    let plot_yMax = 79;
    let ySuffix=" million";
	

    	// Functions for chart and map on:select and on:hover events
	

export function doHover_chart(e) {
  hovered = e.detail.id;
}

    //Need these to be reactive.
    $: map_variable_lookup;
    $: hovered_lsoa;
    $: hover_dict;

//For the scatter/jitter plots, let's attempt to do lsoa and MSOA in the same frame.
getData('./data/data_scatter.csv')
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
                GVA: d.GVA,
                rank: d.rank,
			}));
		
				data.lsoa.indicators = indicators;
			});


// FUNCTIONS (INCL. SCROLLER ACTIONS)
      
      
	// Actions for Scroller components
	const actions = {
		chart: { // Actions for <Scroller/> with id="map"
		chart01: () => {
				xKey = "rank";
				yKey = "GVA";
                ySuffix="";
				zKey = null;
                rKey = null;
                plot_yMax = 79;
				explore = false;
			},
			chart02: () => {
				xKey = "rank";
				yKey = "GVA2020";
                ySuffix=" million";
				zKey = null;
                rKey = null;
                plot_yMax = 950;
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
                        yMax = {plot_yMax}
                        yMin = 0
						ySuffix={ySuffix}
						yFormatTick={d => d.toLocaleString()}
						legend={zKey != null} labels
						select={explore} selected={explore ? selected : null} 
						hover {hovered} on:hover={doHover_chart}
						colorSelect="#206095" colorHighlight="#999" overlayFill
						{animation}/>
						<div class="label label-y outline" style="left: 0%; top: 15%;">
                            {#if yKey == "GVA"}
                             GVA per job filled
                             {:else}
                            Total GVA
                             {/if}
                             </div>
                        {#if yKey == "GVA2020"}    
						<div class="label label-title" style="top: 90%;">GVA for LSOAs</div>
                        {:else}
						<div class="label label-title" style="top: 90%;">GVA per job filled for Local Authorities</div>
                        {/if}
					</div>
				
			</div>
		</figure>
	</div>
	<div slot="foreground">
		<section data-id="chart01">
			<div class="col-medium">
                <a id="ScatterTransition" style="color: black"><br><br></a>
				<p>
					This charts shows the distribution of GVA per job filled by local authority district. The y-axis is the GVA, and we have arranged local authorities in order of GVA along the x axis.
                    Hovering over the points shows the local authority name.
				</p>
			</div>
		</section>
		<section data-id="chart02">
			<div class="col-medium">
				<p>
					And this is a similar plot, but for LSOAs in Teesside. The transition moves the LAD data away and replaces it with the LSOA data.
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