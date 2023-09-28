<template>
    <!-- Card -->
    <v-card class="my-card" elevation="5" @click="showPopup(index)">
        <v-card-title class="text-center">{{ recipe.title }}</v-card-title>
        <v-card-text class="description">{{ recipe.description }}</v-card-text>

        <v-card-text>
            <strong>Ingrédients</strong>
            <p>{{ parseIngredients(recipe.ingredients).join(', ') }}</p>
        </v-card-text>
    </v-card>

    <!-- Button Update / Delete -->
    <v-card-actions class="d-flex justify-center">
        <v-btn text color="primary">Modifier</v-btn>
        <v-btn text color="error">Supprimer</v-btn>
    </v-card-actions>

    <!-- Popup Recipe Detail-->
    <v-dialog v-model="popupVisible" max-width="400">
        <v-card>
        <v-card-title class="text-center">{{ selectedRecipe.title }}</v-card-title>
        <v-card-text>
            <p><strong>Description</strong></p>
            <p>{{ selectedRecipe.description }}</p>
            <p><strong>Ingrédients</strong></p>
            <p>{{ parseIngredients(selectedRecipe.ingredients).join(', ') }}</p>
            <p><strong>Date de création</strong></p>
            <p>{{ formatDate(selectedRecipe.created_at) }}</p>
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" @click="closePopup">Fermer</v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
</template>


<script>
export default {
  props: {
    recipe: Object,
  },
   data() {
    return {     
        popupVisible: false,
        selectedRecipe: null,
    };
  },
  methods: {
    parseIngredients(ingredients) {
        const cleanedIngredients = ingredients.replace(/^\[|\]$/g, '');
        const ingredientArray = cleanedIngredients.split(',');
        const trimmedIngredients = ingredientArray.map((ingredient) => ingredient.trim().replace(/^"|"$/g, ''));
        return trimmedIngredients;
    },

    formatDate(dateString) {
      const options = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', options);
    },

    showPopup() {
      this.selectedRecipe = this.recipe;
      this.popupVisible = true;
    },

    closePopup() {
      this.popupVisible = false;
    },

    editRecipe() {
    },

    deleteRecipe() {
    },
  },
};
</script>

<style scoped>
.my-card {
  height: auto;
}

.description {
  max-height: 3em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-center {
  text-align: center;
}
</style>



