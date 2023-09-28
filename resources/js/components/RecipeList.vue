<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col
          v-for="recipe in recipes"
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
  </v-app>
</template>

<script>
import RecipeCard from "./RecipeCard.vue";

export default {
	components: {
		RecipeCard,
	},
	data() {
		return {
		 recipes: [],
		};
	},
	created() {
    fetch('/api/recipes')
      .then((response) => response.json())
      .then((data) => {
        this.recipes = data;
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des recettes :', error);
      });
  },
};
</script>

