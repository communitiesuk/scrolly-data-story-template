<script>

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
	<p>
		<Toggle label="Animation {animation ? 'on' : 'off'}" mono={true} bind:checked={animation}/>
	</p>
	<div style="margin-top: 90px;">
		<Arrow color="white" {animation}>Scroll to begin</Arrow>
	</div>
</Header>


<Section>
	<h2>Section 1</h2>
	<p class="mb">
		Example text.
	</p>
	
</Section>