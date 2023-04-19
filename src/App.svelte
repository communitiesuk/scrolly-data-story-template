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