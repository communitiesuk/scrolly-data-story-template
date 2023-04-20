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
	import Chorpleths from "./Chorpleths.svelte";
    import ZoomMap from "./ZoomMap.svelte";

</script>

<ONSHeader filled={true} center={false} />

<Header bgcolor="#206095" bgfixed={true} theme="dark" center={false} short={true}>
	<h1>Scolly Data Story Demo</h1>
	<p class="text-big" style="margin-top: 5px">
		Interactive data story demonstration.		
	</p>
	<p style="margin-top: 20px">
		March 2023
	</p>
</Header>

<Section>
	<h2>National picture</h2>
	<p class="mb">
		Example text.
	</p>
	
</Section>

<ZoomMap/>

<Section>
	<h2>Zoom into an Area</h2>
	<p class="mb">
		Example text.
	</p>
</Section>

<Section>
	<h2>Compare Metrics</h2>
	<p class="mb">
		Example text.
	</p>
</Section>

<Section>
	<h2>Highlight places of interest</h2>
	<p class="mb">
		Example text.
	</p>
</Section>


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