# Scrollytelling Data Story Template

A component-based scrollytelling template made with Svelte.

![demo_gif_small](https://github.com/user-attachments/assets/b333340b-ac34-461a-8715-ae37a48ce581)

View the live template article [here]([https://website-name.com](https://ubiquitous-cheesecake-33c5f3.netlify.app/)!

We have adapted code produced by the ONS for use in MHCLG.

This is a template which demostrates the main features of scrollytelling articles and can be used as a starting point for your own data stories.


## Getting started

The best way to start is to clone the repo to your machine.

Next, open the folder and install the dependencies to get started.

```bash
cd your-project
npm install
```

If you run into problems installing the node components, this may be caused by `self signed` certificates. 
The suboptimial, but it works, solution is to disable the configuration setting which checks for this.
```bash
npm config set strict-ssl false
```

Then try again. If there's an error about packages already existing, remove them first.
```bash
rm -rf node_modules/
```

You can then start a local development server to see live changes as you edit the template. It will run on <http://localhost:5000/> and should update every time you save changes to a file.

```bash
npm run dev
```

Finally. When you're done creating your project, you can compile it. (You'll find the compiled code in the `public` folder).

```bash
npm run build
```

## How to edit

It should be possible to start hacking this template without knowing Svelte, but if you want to go further, it's worth working through their [tutorial](https://svelte.dev/tutorial).

For the most part, you shouldn't need to edit anything outside of the `/src` folder. Most of the code you'll need to edit is contained in the `App.svelte` file, which contains all of the HTML structure and content, as well as some JS functions to initialise the interactive elements. You'll also probably need to edit `config.js`, and may want to add your own functions to `utils.js`. The rest of the source files are the components, which are unlikley to need editing.

If you need to add images or data files for charts, maps, etc, you can put these directly into the `img` and `data` folder within the `/public` folder (where the compiled code will go). This folder also contains an `index.html` file, where you'll want to edit the title and meta tags.

## About the components

#### &lt;ONSHeader/&gt; & &lt;ONSFooter/&gt;
Minimal MHCLG-branded page headers and footers based on existing ONS templates.

#### &lt;Header/&gt;
A full height component for the top of the article, with an optional background image which can be static (as in the demo) or scroll with the text.

#### &lt;Section/&gt;
Unstyled component. Mostly for text content, but can take any HTML if needed.

#### &lt;Scroller/&gt;
This is a really important component that allows for dynamic scroll-triggered content with interactions coded in Javascript. It is coded by Rich Harris (the creator of Svelte), and is [documented here](https://github.com/sveltejs/svelte-scroller), but has been re-styled with CSS in this template (see notes below).

#### &lt;Filler/&gt;
This is for full screen captions etc, typically used to introduce an article or to provide a break/transition between sections.

#### &lt;Divider/&gt;
A horizontal divider that can be used between sections. You can also use it as a blank spacer by calling it with the `hr` parameter disabled, like this `<Divider hr={false}/>`

## Other notes

#### Theming and styling
The demo has two built-in colour themes ("light" and "dark"), defined at the top of the `src/config.js` file. You can also add your own themes here. One theme is selected at the top of the `App.svelte` file, but can be overridden on individual components by adding a `theme` parameter. Eg. `<Divider theme="dark"/>`.

The global styling for the template is contained in the `public/global.css` file. This shouldn't need to be edited, but you may want to make use of the classes  that it contains.

If you need to add component-specific styling within your project, you can do this by adding classes within the `<style></style>` tags of the `App.svelte` file, or by using inline styles.

#### Using the &lt;Scroller/&gt; component
This component will take a bit of time to get your head around. Within each Scoller component you'll find two parent elements, `<div  slot="background"/>` and `<div  slot="foreground">`. The background div contains the full-screen map, chart or media that you are animating/manipulating, and the foreground slot contains a series of `<section/>` elements, which contain the text captions.

The essential thing to understand is that each section is automatically tracked and bound to an `index` value (in Javascript), starting from zero. In the demo, these indices are bound to an array, and each Scroller has an associated array of Javascript functions (there are two in the demo, `chartActions` and `mapActions`)  that control the interactions for each caption. If there is no interaction for a particular caption, then it needs a `null` value in this array, or a repetion of the previous function (depending what interaction you need).

The Scroller component has other features not used in the demo, including tracking the exact progress between captions, or within a whole Scroller section, which can be used for more complex continuous interactions (rather than step-based). All of the features are [documented here](https://github.com/sveltejs/svelte-scroller).
