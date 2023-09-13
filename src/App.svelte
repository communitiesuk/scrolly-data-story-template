<script>
    import { setContext, onMount } from "svelte";
    import { themes } from "./config.js";
    import { setColors } from "./utils.js";
	import ONSHeader from "./layout/ONSHeader.svelte";
	import ONSFooter from "./layout/ONSFooter.svelte";
	import Header from "./layout/Header.svelte";
	import Section from "./layout/Section.svelte";
	import Media from "./layout/Media.svelte";
	import Scroller from "./layout/Scroller.svelte";
	import Filler from "./layout/Filler.svelte";
	import Divider from "./layout/Divider.svelte";
	import Toggle from "./ui/Toggle.svelte";
	import Arrow from "./ui/Arrow.svelte";
	import Em from "./ui/Em.svelte";

    let theme = "light";
	setContext("theme", theme);
	setColors(themes, theme);

	import MoveMap from "./MoveMap.svelte";
	import MapSpread from "./MapSpread.svelte";
	import Choropleths from "./Choropleths.svelte";
    import ZoomMap from "./ZoomMap.svelte";
	import AddPoints from "./AddPoints.svelte";
	
	import MoveData from "./MoveData.svelte";
    import TimeSeries from "./TimeSeries.svelte";
	import ScatterTransition from "./ScatterTransition.svelte";
	import ScatterChartTrends from "./ScatterChartTrends.svelte";
	
	

</script>

<ONSHeader filled={true} center={false} />

<Header bgcolor="#206095" bgfixed={true} theme="dark" center={false} short={true}>
	<h1>Scrolly Data Story Templates</h1>
	<p class="text-big" style="margin-top: 5px">
		Interactive data story templates.		
	</p>
	<p style="margin-top: 20px">
		April 2023
	</p>
</Header>

<div id="navpanel" class="floater">
	<p class="initial"> <strong>Page navigation </strong></p>
	<p class="hovered">
	<b style="color: black"> Map elements </b> <br>
	<a href="#MoveMap"> Move map around </a> <br>
	<a href="#ZoomMap"> Zoom map in </a> <br>
	<a href="#Choropleths"> Choropleths </a> <br>
	<a href="#AddPoints"> Add points </a> <br>
	<a href="#MapSpread"> Show map spread </a> <br>
	<b style="color: black"> Scatter plots </b> <br>
	<a href="#MoveData"> Move data around </a> <br>
	<a href="#ScatterTransition"> Fancy transitions </a> <br>
	<a href="#TimeSeries"> Show time series </a> <br>
</p>
</div>

<Section>
	<h2>Scrolling data storytelling templates</h2>
	<p class="mb">
		In this page, we have a set of interactive data storytelling templates. These can be used as examples to tell various kinds of story with data.
	</p>
	
</Section>


<Section>
	<h2>Move around and highlight places of interest</h2>
	<p class="mb">
		This is a map with a single data source on it. We can move around the map and point out interesting places.
	</p>
	<p>This can be used to tell stories about the differences in the best/worst performing areas and show where they are.</p>
	
</Section>

<MoveMap/>

<Section>
	<h2>Zoom into an area</h2>
	<p class="mb">
		This contains two levels of geography. The map dynamically zooms into a lower level of geography. 
	</p>
	<p>This can be used to draw the link between national patterns and what it going on in local areas.</p>
</Section>

<ZoomMap/>

<Section>
	<h2>Compare metrics</h2>
	<p class="mb">
		This maps shows a few different metrics for the same areas.
	</p>
	<p>This can be used to highlight similarities between the spatial patterns for different metrics -- that the same places are affected by different issues.</p>
</Section>

<Choropleths/>

<Section>
	<h2>Add points to a map</h2>
	<p class="mb">
		This map shows a local area. Then it dynamically adds points on top of the existing map.
	</p>
	<p>This can be used to show the context and then add data for individual projects or sites, which can be used to tell a story about what we're doing about that background context.</p>
</Section>

<AddPoints/>

<Section>
	<h2>Map spread</h2>
	<p class="mb">
		In this template, we show changes moving across a map. In the example, this is local authorities split into quinitiles based on latitude.
	</p>
	<p>This can be used to show changes over time, and used scroll through to show areas which see change.</p>
</Section>

<MapSpread/>

<Section>
	<h2>Move data around and add new variables</h2>
	<p class="mb">
		This is a scatter chart which goes through adjustments of what we show on the axes.
	</p>
	<p>This can be used to show patterns emerging as we contrast with different sources of data.</p>
</Section>

<MoveData/>

<Section>
	<h2>Add trend lines to scatter charts</h2>
	<p class="mb">
		This is a scatter chart which has user defined trend lines.
	</p>
</Section>

<ScatterChartTrends/>

<Section>
	<h2>An animated transition between plots</h2>
	<p class="mb">
		This is an example of changing between two related datasets. In this case, we use the same x-axis, so the local authority and LSOA data move straight up and down to transition from one frame to the next.
	</p>
	<p>This is a transition to draw together two datasets into a single scrolling element.</p>
</Section>

<ScatterTransition/> 

<Section>
	<h2>Time series scrolling</h2>
	<p class="mb">
		This is an example of using scrolling to explore time series on an interactive scatter chart. 
	</p>
</Section>

<TimeSeries/>

<Divider/>

<ONSFooter />
<style>

	:global(svelte-scroller-foreground) {
		pointer-events: none !important;
		max-width: 100% !important;
    	overflow-x: hidden !important;
	}
	:global(svelte-scroller-foreground section div) {
		pointer-events: all !important;
	}
	:global(svelte-scroller-background) {
		overflow-x: hidden !important;
	}
	button {
		cursor: pointer;
		font-size: 14px;
		font-weight: bold;
		margin-top: 5px;
	}
	select {
		max-width: 350px;
	}
	.chart {
		margin-top: 45px;
		width: calc(100% - 5px);
	}
	.chart-full {
		margin: 0 20px;
	}
	.chart-sml {
		font-size: 0.85em;
	}
	.media {
		background-color: #f0f0f0;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		-ms-flex-flow: column;
		flex-flow: column;
		-webkit-box-pack: center;
		-ms-flex-pack: center;
		justify-content: center;
		text-align: center;
		color: #aaa;
	}
	.img {
		float:right;
		height:auto;
	} 
	.legend {
	background-color: #fff;
	border-radius: 3px;
	top: 30px;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
	padding: 10px;
	position: absolute;
	right: 10px;
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
		top: 0px;
		text-align: right;
		-webkit-writing-mode: vertical-rl;
		-ms-writing-mode: tb-rl;
		writing-mode: vertical-rl;
		-webkit-transform: rotate(-180deg);
		-ms-transform: rotate(-180deg);
		transform: rotate(-180deg);
	}
	.floater{
  position:fixed;
  top: 3px;
  left: 3px;
  z-index: 100;
  background-color: #fff;
  border: 2px solid #253494;
  font-size: 12px;
  padding: 5px;
-webkit-transition: all 0.3s ease-out;
-moz-transition: all 0.3s ease-out;
-ms-transition: all 0.3s ease-out;
-o-transition: all 0.3s ease-out;
transition: all 0.3s ease-out;
}
.floater .hovered { display:none }
.floater:hover .hovered { display: block; }
.floater p { display: inline }
.floater:hover p { display: inline }
.floater:hover {
  position:fixed;
  top: 3px;
  left: 3px;
  z-index: 100;
  background-color: #fff;
  border: 2px solid #253494;
  font-size: 16px;
  padding: 5px;
}
.floater:active p { display: inline }
.floater:active{
		
		position:fixed;
		top: 3px;
		left: 3px;
		z-index: 100;
		background-color: #fff;
		border: 2px solid #253494;
		font-size: 16px;
		padding: 5px;
	  }
	  
body {
    overflow-x: hidden !important;
}
.container {
    max-width: 100% !important;
    overflow-x: hidden !important;
}
:global() {
    scroll-behavior: smooth;
}
</style>

<!---

/* 
Note this syntax is what I want to use for this, from svelte REPL testing.
<script>
	import Component2 from "./Component2.svelte";
	import C3 from "./Component3.svelte";
	let name = 'World'
</script>

<h1>Hello {name}!</h1>

<h2>
	This now does what I have in Component 2
</h2>
<Component2/>

<h2>
	This now does what I have in Component 3
</h2>
<C3/>
*/


-->