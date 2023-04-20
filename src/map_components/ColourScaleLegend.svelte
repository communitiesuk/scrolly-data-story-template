<script>
   import { map_variable_lookup, colors, units } from "../config.js";
	export let scale_text = '';
	export let max_val = 100;
    export let min_val = 0;
	export let highlighted_val = min_val;
	export let average_val = 20;
	export let scale_labels = [];
    export let higher_lower_than_average = 0;
    export let average_text = '';
	export let imd_rank_text = '';
    export let is_hovered = false;
    export let percent_diff_from_average = '';
	export let scale_colours = ['#eff3ff', '#bdd7e7', '#6baed6', '#3182bd', '#08519c'];
    export let map_key;
	let display_text;
	let legend_val;

	$: offset = ((highlighted_val - min_val) / (max_val - min_val));
	$: offset_average = ((average_val - min_val) / (max_val - min_val));
    $: percent_diff_from_average = (map_key == 'net_trust' || map_key == 'net_trust_LSOA')? (highlighted_val - average_val).toFixed(1): percent_diff_from_average = (100 * ((highlighted_val) / average_val - 1)).toFixed(1)
    $: higher_lower_than_average = (percent_diff_from_average > 0)? '% higher than ': '% lower than'
    $: higher_lower_than_average = (percent_diff_from_average == 0)? 'equal to': higher_lower_than_average
	$: imd_rank_text = (map_key == "IMD_LSOA" || "IMD")? imd_rank_text : ''
    $: average_text = (is_hovered && map_key !== "GVA_LSOA")? 'This is ' + ((isNaN(percent_diff_from_average) || percent_diff_from_average == 0)? ' ': Math.abs(percent_diff_from_average)) + higher_lower_than_average + ' the UK average.': ''
	$: display_text = (map_key !== "GVA_LSOA")? scale_text: '\n';
	$: legend_val = (is_hovered && map_key !== "GVA_LSOA")? highlighted_val + ' ' + units[map_key]: '';
</script>

<style>
	.container {
		left: 60%;
		width: 35%;
		position: absolute;
		height: 80px;
		padding: 5px;
        background-color: rgba(255, 255, 255, 0.8);
	}
	.marker {
		position: absolute;
		top: 40%;
		height: 20%;
		width: 4px;
		background-color: white;
		border: 0.8px solid black;
	}
	.avg_marker {
		position: absolute;
		top: 35%;
		height: 30%;
		width : 2px;
		background-color: Gainsboro;
		border: 0.8px solid ;
	}
	.legend-scale ul{
 		padding: 0;
		margin: 0px;
		margin-top: 5px;
	}
	.legend-scale ul li {
    display: block;
    float: left;
    width: 20%;
    margin-bottom: 5px;
    text-align: center;
    font-size: 45%;
    list-style: none;
    }
	.legend-labels li span {
    display: block;
    float: left;
    height: 15px;
    width: 100%;
    }
</style>
<div class="container">
<div style = "margin: 0px; position: relative; font-size: 45%; white-space: pre-line;"> <strong> {display_text} {legend_val} </strong> <br> {(imd_rank_text)? imd_rank_text: average_text}</div>
		<div class="marker" style="left: {100 * offset}%"/>
		<div class="avg_marker" style="left: {100 * offset_average}%"/>
	<div class='legend-scale'>
		<ul class='legend-labels'>
			{#each scale_colours as colour}
				<li><span style='background:{colour};'></li>
			{/each}
		</ul>
				<ul class='legend-labels'>
			{#each scale_labels as label, i}
				<li>{label}</li>
			{/each}
		</ul>
	</div>
</div>
