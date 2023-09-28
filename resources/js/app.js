import './bootstrap';
import Vue from 'vue';

Vue.component('create-recipe', require('./components/CreateRecipe.vue').default);
Vue.component('recipe-list', require('./components/RecipeList.vue').default);
Vue.component('edit-recipe', require('./components/EditRecipe.vue').default);
Vue.component('delete-recipe', require('./components/DeleteRecipe.vue').default);

