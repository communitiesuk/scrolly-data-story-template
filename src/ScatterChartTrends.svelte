<script>

// CORE IMPORTS
    import { onMount } from "svelte";
    import { getMotion } from "./utils.js";
    import Scroller from "./layout/Scroller.svelte";
    
    // DEMO-SPECIFIC IMPORTS
    //import bbox from "@turf/bbox";
    import { getData, setColors, getTopo, getColor, fitBounds, fitById, fitFeatures} from "./utils.js";
    import { map_variable_lookup, colors, units, mapbounds } from "./config.js";
    import { ScatterChartTrendLines, LineChart, BarChart } from "@onsvisual/svelte-charts";


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
    let xKey = "GVA1998"; // xKey for scatter chart
    let yKey = "GVA2000"; // yKey for scatter chart
    let zKey = "ITL1_name"; // zKey (color) for scatter chart
    let rKey = null; // rKey (radius) for scatter chart
    let explore = false; // Allows chart/map interactivity to be toggled on/off

    import dataScatterTrend from '../public/data/trend_data';
    

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
                GVA2018: d.GVA2018,
                GVA2015: d.GVA2015,
                GVA2010: d.GVA2010,
                GVA2005: d.GVA2005,
                GVA2000: d.GVA2000,
                GVA1998: d.GVA1998,
                workplace_pop: d.workplace_pop,
                ITL1_name: d.ITL1_name,
            }));
            
                data.lsoa.indicators = indicators;
            });


// FUNCTIONS (INCL. SCROLLER ACTIONS)
        
        
    // Actions for Scroller components
    const actions = {
        chart: { // Actions for <Scroller/> with id="map"
        chart01: () => {
                xKey = "GVA1998";
                yKey = "GVA2000";
                zKey = "ITL1_name";
                rKey = null;
                explore = false;
            },
            chart02: () => {
                xKey = "GVA1998";
                yKey = "GVA2018";
                zKey = "ITL1_name";
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
            <div class="label" style="left: 20%; top: 85%;">&larr; Lower GVA</div>
            <div class="label" style="left: 65%; top: 85%;">Higher GVA &rarr;</div>
            
            <div class="col-full height-full">
                
                    <div class="chart">
                        <ScatterChartTrendLines
                        height="calc(100vh - 150px)"
                        data={data.lsoa.indicators}
                        trendData={dataScatterTrend}
                        colors={explore ? ['lightgrey'] : colors.cat}
                        padding.top = 40
                        {xKey} {yKey} {zKey} {rKey} idKey="code" labelKey="name"
                        r={[5]}
                        yMax={1000}
                        ySuffix=" people"
                        yFormatTick={d => d.toLocaleString()}
                        select={explore} selected={explore ? selected : null} 
                        hover {hovered} on:hover={doHover_chart}
                        colorSelect="#206095" colorHighlight="#999" overlayFill
                        {animation}/>
                        {#if yKey=='workplace_pop'}
                        <div class="label label-y outline" style="left: 0%; top: 15%;">Workplace Population</div>
                        
                        {/if}
                        <div class="label label-title" style="top: 90%;">
                            {#if yKey == "workplace_pop"}
                            GVA against workplace population for LSOAs
                            {:else}
                            GVA for LSOAs
                            {/if}
                        </div>
                    </div>
                
            </div>
        </figure>
    </div>
    <div slot="foreground">
        <section data-id="chart01">
            <div class="col-medium">
                <a id="MoveData" style="color: black"><br><br></a>
                <p>
                    Scatter chart trend line 1 text
                </p>
            </div>
        </section>
        <section data-id="chart02">
            <div class="col-medium">
                <p>
                    Scatter chart trend line 2 text
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