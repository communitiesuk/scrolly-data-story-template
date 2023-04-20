<script>
    import { colors, units, map_variable_lookup} from "../config.js";
	export let map_key;
	export let hov;
	export let highlighted_val = map_variable_lookup[map_key]['scale'][0];
	export let scale_text = '';
	export let imd_rank_text = '';

    let higher_lower_than_average = 0;
    let average_text = '';
    let percent_diff_from_average = '';
	let display_text;
	let legend_val;
	let scale_labels;
	let scale_colours;
	let max_val;
	let min_val;
	let average_val;
	let number_blocks = 5;
	let percent = 20;

	function getBand(value, breaks) {
  let found = false;
  let i = 1;
  while (found == false) {
    if ((value <= breaks[i])  || (i == breaks.length + 1)) {
      found = true;
    } else {
      i ++;
    }
  }
  return (i-1);
}
	
	$: max_val = map_variable_lookup[map_key]['scale'][map_variable_lookup[map_key]['scale'].length - 1]
	$: min_val = map_variable_lookup[map_key]['scale'][0]
	$: average_val = map_variable_lookup[map_key]['avg']
	$: scale_labels = map_variable_lookup[map_key]['scale_string']
	$: scale_colours = map_variable_lookup[map_key]['scale_colours'] ? map_variable_lookup[map_key]['scale_colours'] : colors.seq_5

	$: band = getBand(highlighted_val, map_variable_lookup[map_key]['scale'])
	$: offset = (highlighted_val<min_val)? map_variable_lookup[map_key]['scale'][0]: (0.2*band+ 0.2*(highlighted_val - map_variable_lookup[map_key]['scale'][band]) / (map_variable_lookup[map_key]['scale'][band+1] - map_variable_lookup[map_key]['scale'][band]));
	$: avg_band = getBand(average_val, map_variable_lookup[map_key]['scale'])
	$: offset_average = (0.2*avg_band+ 0.2*(average_val - map_variable_lookup[map_key]['scale'][avg_band]) / (map_variable_lookup[map_key]['scale'][avg_band+1] - map_variable_lookup[map_key]['scale'][avg_band]));

//	$: offset = (highlighted_val<min_val)? min_val: ((highlighted_val - min_val) / (max_val - min_val));
//	$: offset_average = ((average_val - min_val) / (max_val - min_val));
    $: percent_diff_from_average = (map_key == 'net_trust' || map_key == 'net_trust_LSOA')? (highlighted_val - average_val).toFixed(1): percent_diff_from_average = (100 * ((highlighted_val) / average_val - 1)).toFixed(1)
    $: higher_lower_than_average = (percent_diff_from_average > 0)? '% higher than ': '% lower than'
    $: higher_lower_than_average = (percent_diff_from_average == 0)? 'equal to': higher_lower_than_average
	$: imd_rank_text = (map_key == "IMD_LSOA" || "IMD")? imd_rank_text : ''
    $: average_text = (hov && map_key !== "GVA_LSOA1")? 'This is ' + ((isNaN(percent_diff_from_average) || percent_diff_from_average == 0)? ' ': Math.abs(percent_diff_from_average)) + higher_lower_than_average + ' the UK average.': ''
	$: display_text = (map_key !== "GVA_LSOA1")? scale_text: '\n';
	$: legend_val = (hov && map_key !== "GVA_LSOA1")? highlighted_val + ' ' + units[map_key]: '';
	$: number_blocks = map_variable_lookup[map_key]['scale'].length;
	$: percent = ((number_blocks >8) ? 12.5 : 20); //Use 8 or 5 blocks.
</script>

<style>
	.container {
		left: 50%;
		width: 47%;
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
	<div class='legend-scale' >
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
