<template>
  <div>
	<v-app>
		<!-- Barre de navigation (AppBar) -->
		<v-app-bar app>
			<v-toolbar-title>MyRecipe</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn color="primary">Ajouter une recette</v-btn>
		</v-app-bar>
	</v-app>
  </div>
</template>

<script>
export default {
  data() {
    return {
      recipes: [],
      searchQuery: "",
    };
  },
  methods: {
    async loadRecipes() {
      try {
        const response = await axios.get("/recipes");
        this.recipes = response.data;
      } catch (error) {
        console.error("Erreur lors du chargement des recettes : ", error);
      }
    },
    async searchRecipes() {
      try {
        const response = await axios.get("/recipes/search", {
          params: { query: this.searchQuery },
        });
        this.recipes = response.data;
      } catch (error) {
        console.error("Erreur lors de la recherche des recettes : ", error);
      }
    },
  },
  created() {
    this.loadRecipes();
  },
};
</script>

