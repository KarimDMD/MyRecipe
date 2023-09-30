<template>
  <!-- Card -->
  <v-card
    class="my-card custom-card"
    elevation="5"
    @click="showDetailPopup(index)"
  >
    <img
      src="https://img.freepik.com/photos-gratuite/vue-laterale-pommes-terre-viande-sauce-tomate-roquette-salade-grecque-soupe-table_141793-2866.jpg?w=1380&t=st=1696087444~exp=1696088044~hmac=323365425eda27e571463d5ac05f7c4157ce94d0a52a6eb6ea3d1c7e6dcbb8eb"
      alt="Food"
    />
    <v-card-title class="text-center" style="color: #789664">{{
      recipe.title
    }}</v-card-title>
    <v-card-text class="description">{{ recipe.description }}</v-card-text>
  </v-card>

  <!-- Btn Modifier / Supprimer -->
  <v-card-actions class="d-flex justify-center">
    <v-btn text color="#DCAF3A" @click="showEditPopup">Modifier</v-btn>
    <v-btn text color="error" @click="showDeletePopup">Supprimer</v-btn>
  </v-card-actions>

  <!-- Popup Edit Form -->
  <v-dialog v-model="editPopupVisible" max-width="500">
    <recipe-form
      ref="editForm"
      @cancel="closePopup"
      @recipe-updated="closePopup"
      :recipeToEdit="selectedRecipe"
    />
  </v-dialog>

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
        <v-btn color="#DCAF3A" @click="deleteRecipe">Valider</v-btn>
        <v-btn color="error" @click="closePopup">Annuler</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Popup Detail Recipe -->
  <v-dialog v-model="popupVisible" max-width="400">
    <v-card>
      <v-card-title class="text-center" style="color: #439775; font-size: 28px">
        {{ selectedRecipe.title }}
      </v-card-title>
      <v-card-text>
        <p><strong style="color: #439775">Description</strong></p>
        <p>{{ selectedRecipe.description }}</p>
        <p class="mt-3"><strong style="color: #439775">Ingrédients</strong></p>
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
        <p class="mt-3">
          <strong style="color: #439775">Date de création</strong>
        </p>
        <p>{{ formatDate(selectedRecipe.created_at) }}</p>
      </v-card-text>
      <v-card-actions class="d-flex justify-center">
        <v-btn color="#DCAF3A" @click="closePopup">Fermer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import RecipeForm from "./RecipeForm.vue";

export default {
  components: {
    RecipeForm,
  },

  props: {
    recipe: Object,
  },

  emits: ["recipe-deleted"],

  data() {
    return {
      popupVisible: false,
      editPopupVisible: false,
      deletePopupVisible: false,
      selectedRecipe: null,
      confirmDeleteDialog: false,
    };
  },

  methods: {
    // Format Date
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

    showEditPopup() {
      this.selectedRecipe = this.recipe;
      this.editPopupVisible = true;
    },

    showDeletePopup() {
      this.selectedRecipe = this.recipe;
      this.deletePopupVisible = true;
    },

    closePopup() {
      this.popupVisible = false;
      this.editPopupVisible = false;
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

.custom-card {
  max-width: 500px;
  height: auto;
}

.custom-card img {
  width: 100%;
  height: auto;
}
</style>
