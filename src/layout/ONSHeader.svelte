<script>
    import {themes} from "../config.js";
    import {getContext} from "svelte";

    export let theme = getContext("theme");
    export let filled = false;
    export let center = true;
</script>

<nav
    style="border-bottom-color: {themes[theme]['muted']}; {filled
        ? 'background-color: ' + themes[theme]['background'] + ';'
        : ''}"
>
    <div class="col-wide middle" class:center>
        <a
            href="https://www.gov.uk/government/organisations/ministry-of-housing-communities-local-government"
        >
            <picture>
                <img
                    alt="Ministry of Housing, Communities & Local Government"
                    src="./img/MHCLG_TEAL_AW.png"
                />
            </picture>
        </a>
    </div>
</nav>

<style>
    nav {
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        position: relative;
        height: 150px;
        margin-bottom: -46px;
        border-bottom: 1px solid #777;
        z-index: 1;
    }

    picture {
        position: relative;
        top: -3px;
        padding: 0 5px;
    }

    img {
        width: 270px;
    }

    a img:hover {
        cursor: pointer;
    }
</style>