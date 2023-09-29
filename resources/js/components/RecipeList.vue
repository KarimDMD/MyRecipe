<template>
  <div>
    <v-container class="my-4">
      <!-- SearchBar -->
      <search-bar @search="filterRecipes" />

      <!-- Btn Ajouter Recette -->
      <v-row class="d-flex justify-center align-center">
        <v-col
          cols="12"
          sm="6"
          md="4"
          lg="3"
          class="d-flex justify-center align-center"
        >
          <v-btn color="primary" @click="showRecipeForm"
            >Ajouter une recette</v-btn
          >
        </v-col>
      </v-row>

      <!-- Card -->
      <v-row>
        <v-col
          v-for="recipe in filteredRecipes"
          :key="recipe.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <recipe-card
            :recipe="recipe"
            @recipe-deleted="handleRecipeDeleted"
          ></recipe-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Form -->
    <v-dialog v-model="formVisible" max-width="500">
      <recipe-form @recipe-added="onRecipeAdded" @cancel="hideRecipeForm" />
    </v-dialog>
  </div>
</template>


<script>
import RecipeCard from "./RecipeCard.vue";
import SearchBar from "./SearchBar.vue";
import RecipeForm from "./RecipeForm.vue";

export default {
  components: {
    RecipeCard,
    SearchBar,
    RecipeForm,
  },
  data() {
    return {
      recipes: [],
      filteredRecipes: [],
      formVisible: false,
      ingredients: [""],
    };
  },
  methods: {
    filterRecipes(query) {
      this.filteredRecipes = this.recipes.filter((recipe) => {
        const nameMatch = recipe.title
          .toLowerCase()
          .includes(query.toLowerCase());
        const ingredientsMatch = recipe.ingredients
          .toLowerCase()
          .includes(query.toLowerCase());
        return nameMatch || ingredientsMatch;
      });
    },
    showRecipeForm() {
      this.formVisible = true;
    },
    hideRecipeForm() {
      this.formVisible = false;
    },
    onRecipeAdded(newRecipe) {
      this.recipes.push(newRecipe);
      this.filteredRecipes.push(newRecipe);
      this.formVisible = false;
    },
    handleRecipeDeleted(deletedRecipeId) {
      this.recipes = this.recipes.filter(
        (recipe) => recipe.id !== deletedRecipeId
      );
      this.filteredRecipes = this.filteredRecipes.filter(
        (recipe) => recipe.id !== deletedRecipeId
      );
    },
  },
  created() {
    fetch("/api/recipes")
      .then((response) => response.json())
      .then((data) => {
        this.recipes = data;
        this.filterRecipes("");
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des recettes :", error);
      });
  },
};
</script>

