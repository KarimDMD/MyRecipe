import './bootstrap';

import { createApp } from "vue/dist/vue.esm-bundler"

import { createVuetify } from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import RecipeList from "./components/RecipeList.vue"

const vuetify = createVuetify({
    components,
    directives
});

const app = createApp({
    components: {
        RecipeList,
    }
})

app.use(vuetify);

app.mount("#app");