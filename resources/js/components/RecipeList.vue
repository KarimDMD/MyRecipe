<template>
  <div>
    <v-container class="my-4">
	<search-bar @search="filterRecipes" />
      <v-row>
        <v-col
          v-for="recipe in filteredRecipes"
          :key="recipe.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <recipe-card :recipe="recipe"></recipe-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>


<script>
import RecipeCard from "./RecipeCard.vue";
import SearchBar from "./SearchBar.vue"

export default {
	components: {
		RecipeCard,
		SearchBar,
	},
	data() {
		return {
			recipes: [],
			filteredRecipes: [],
		};
	},
	methods: {
		filterRecipes(query) {
		this.filteredRecipes = this.recipes.filter((recipe) => {
			const nameMatch = recipe.title.toLowerCase().includes(query.toLowerCase());
			const ingredientsMatch = recipe.ingredients.toLowerCase().includes(query.toLowerCase());
			return nameMatch || ingredientsMatch;
		});
		},
	},
	created() {
		fetch('/api/recipes')
			.then((response) => response.json())
			.then((data) => {
				this.recipes = data;
				this.filterRecipes('');
			})
			.catch((error) => {
				console.error('Erreur lors de la récupération des recettes :', error);
			});
  	},
};
</script>

