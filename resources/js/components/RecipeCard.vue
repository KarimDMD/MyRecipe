<template>
  <!-- Card -->
  <v-card class="my-card" elevation="5" @click="showPopup(index)">
    <v-card-title class="text-center">{{ recipe.title }}</v-card-title>
    <v-card-text class="description">{{ recipe.description }}</v-card-text>
  </v-card>

  <!-- Button Update / Delete -->
  <v-card-actions class="d-flex justify-center">
    <v-btn text color="primary">Modifier</v-btn>
    <v-btn text color="error">Supprimer</v-btn>
  </v-card-actions>

  <!-- Popup Recipe Detail-->
  <v-dialog v-model="popupVisible" max-width="400">
    <v-card>
      <v-card-title class="text-center">{{
        selectedRecipe.title
      }}</v-card-title>
      <v-card-text>
        <p><strong>Description</strong></p>
        <p>{{ selectedRecipe.description }}</p>
        <p><strong>Ingrédients</strong></p>
        <ul class="ingredient-list">
          <li v-for="(ingredient, index) in parsedIngredients" :key="index">
            <div class="ingredient-item">
              <div class="ingredient-left">{{ ingredient.ingredient }}</div>
              <div class="ingredient-right">
                {{ ingredient.quantity }} {{ ingredient.unit }}
              </div>
            </div>
          </li>
        </ul>
        <p><strong>Date de création</strong></p>
        <p>{{ formatDate(selectedRecipe.created_at) }}</p>
      </v-card-text>
      <v-card-actions class="d-flex justify-center">
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
    formatDate(dateString) {
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", options);
    },

    showPopup() {
      this.selectedRecipe = this.recipe;
      this.popupVisible = true;
    },

    closePopup() {
      this.popupVisible = false;
    },

    editRecipe() {},

    deleteRecipe() {},
  },
  computed: {
    parsedIngredients() {
      if (this.selectedRecipe && this.selectedRecipe.ingredients) {
        return JSON.parse(this.selectedRecipe.ingredients);
      }
      return [];
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

.ingredient-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.ingredient-item {
  display: flex;
  justify-content: space-between;
}

.ingredient-left {
  flex: 1;
}

.ingredient-right {
  flex: 1;
  text-align: right;
}
</style>
