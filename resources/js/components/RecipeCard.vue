<template>
  <!-- Card -->
  <v-card class="my-card" elevation="5" @click="showDetailPopup(index)">
    <v-card-title class="text-center">{{ recipe.title }}</v-card-title>
    <v-card-text class="description">{{ recipe.description }}</v-card-text>
  </v-card>

  <!-- Btn Modifier / Supprimer -->
  <v-card-actions class="d-flex justify-center">
    <v-btn text color="primary">Modifier</v-btn>
    <v-btn text color="error" @click="showDeletePopup">Supprimer</v-btn>
  </v-card-actions>

  <!-- Popup Supprimer -->
  <v-dialog v-model="deletePopupVisible" max-width="400">
    <v-card>
      <v-card-title class="text-center"
        >Confirmation de suppression</v-card-title
      >
      <v-card-text>
        Êtes-vous sûr de vouloir supprimer cette recette ?
      </v-card-text>
      <v-card-actions class="d-flex justify-center">
        <!-- Ajoutez la classe ici -->
        <v-btn color="primary" @click="deleteRecipe">Valider</v-btn>
        <v-btn color="error" @click="closePopup">Annuler</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Popup Detail Recipe -->
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
  emits: ["recipe-deleted"],
  data() {
    return {
      popupVisible: false,
      deletePopupVisible: false,
      selectedRecipe: null,
      confirmDeleteDialog: false,
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

    // Edit Recipe
    editRecipe() {},

    // Delete Recipe
    deleteRecipe() {
      const recipeId = this.selectedRecipe.id;
      fetch(`/api/recipes/${recipeId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            this.closePopup();
            this.$emit("recipe-deleted", this.recipe.id);
          } else {
            console.error("Erreur lors de la suppression de la recette");
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la suppression de la recette :", error);
        });
    },

    // Popup Management
    showDetailPopup() {
      this.selectedRecipe = this.recipe;
      this.popupVisible = true;
    },

    showDeletePopup() {
      this.selectedRecipe = this.recipe;
      this.deletePopupVisible = true;
    },

    closePopup() {
      this.popupVisible = false;
      this.deletePopupVisible = false;
    },
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
