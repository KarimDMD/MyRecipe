<template>
  <v-card class="pa-4">
    <v-card-title class="mb-4" color="#DCAF3A">
      {{ isEditing ? "Modifier la recette" : "Ajouter une recette" }}
    </v-card-title>
    <!-- FORM -->
    <v-form @submit.prevent="isEditing ? editRecipe() : addRecipe()" ref="form">
      <!-- Titre -->
      <v-text-field
        v-model="title"
        label="Titre"
        :rules="[titleRule]"
        required
      ></v-text-field>

      <!-- Description -->
      <v-text-field
        v-model="description"
        label="Description"
        :rules="[descriptionRule]"
        required
      ></v-text-field>

      <!-- Ingrédients -->
      <v-row class="align-center">
        <v-col cols="6">
          <v-text-field
            v-model="newIngredient.ingredient"
            label="Ingrédient"
            :rules="[ingredientRule]"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="newIngredient.quantity"
            label="Quantité"
            :rules="[quantityRule]"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="newIngredient.unit"
            label="Unité"
            :rules="[unitRule]"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-btn color="#DCAF3A" @click="addIngredient" class="mb-3">
        Ajouter un ingrédient
      </v-btn>

      <!-- Liste des ingrédients -->
      <p class="mb-3" v-if="ingredients.length > 0">
        <strong style="color: #789664">Ingrédients</strong>
      </p>
      <v-row
        v-for="(ingredient, index) in ingredients"
        :key="index"
        class="align-center"
      >
        <v-col cols="7" md="6">
          <p>{{ ingredient.ingredient }}</p>
        </v-col>
        <v-col cols="1" md="2">
          <p>{{ ingredient.quantity }}</p>
        </v-col>
        <v-col cols="2" md="2">
          <p>{{ ingredient.unit }}</p>
        </v-col>
        <v-col cols="2" md="2" class="d-flex align-center">
          <v-btn color="#DCAF3A" @click="removeLastIngredient(index)">X</v-btn>
        </v-col>
      </v-row>

      <!-- Ajouter un message d'erreur -->
      <v-alert
        v-if="!isFormValid"
        type="error"
        dense
        class="d-flex justify-center align-center mt-3"
      >
        Veuillez ajouter au moins un ingrédient.
      </v-alert>

      <!-- Btn Ajouter / Annuler -->
      <v-card-actions class="d-flex justify-center">
        <v-btn type="submit" color="#DCAF3A">
          {{ isEditing ? "Valider" : "Ajouter" }}
        </v-btn>
        <v-btn color="error" @click="cancel">Annuler</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { createEventBus } from "../event-bus.js";
const eventBus = createEventBus();

export default {
  props: {
    recipeToEdit: Object,
  },

  data() {
    return {
      isEditing: false,
      title: "",
      description: "",
      ingredientText: "",
      newIngredient: {
        ingredient: "",
        quantity: "",
        unit: "",
      },
      ingredients: [],
      isFormValid: true,
    };
  },

  created() {
    if (this.recipeToEdit) {
      this.title = this.recipeToEdit.title;
      this.description = this.recipeToEdit.description;
      this.ingredients = JSON.parse(this.recipeToEdit.ingredients);
      this.isEditing = true;
    }
  },

  methods: {
    // ADD Recipe
    addRecipe() {
      if (
        this.$refs.form.validate() &&
        this.title &&
        this.description &&
        this.ingredients.length > 0
      ) {
        const newRecipe = {
          title: this.title,
          description: this.description,
          ingredients: JSON.stringify([...this.ingredients]),
        };

        fetch("/api/recipes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newRecipe),
        })
          .then((response) => response.json())
          .then((data) => {
            this.title = "";
            this.description = "";
            this.ingredients = [{ ingredient: "", quantity: null, unit: "" }];

            this.$emit("recipe-added", data);
          })
          .catch((error) => {
            console.error("Erreur lors de l'ajout de la recette :", error);
          });
      } else {
        if (this.ingredients.length === 0) {
          this.isFormValid = false;
        }
      }
    },

    // EDIT Recipe
    editRecipe() {
      if (
        this.$refs.form.validate() &&
        this.title !== "" &&
        this.description !== "" &&
        this.ingredients.length > 0
      ) {
        const currentDate = new Date().toISOString();

        const updatedRecipe = {
          id: this.recipeToEdit.id,
          title: this.title,
          description: this.description,
          ingredients: JSON.stringify(this.ingredients),
          created_at: currentDate,
        };

        fetch(`/api/recipes/${this.recipeToEdit.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedRecipe),
        })
          .then((response) => response.json())
          .then((data) => {
            eventBus.emit("recipe-updated", updatedRecipe);

            this.$emit("cancel");
          })
          .catch((error) => {
            console.error(
              "Erreur lors de la mise à jour de la recette :",
              error
            );
          });
      } else {
        if (this.ingredients.length === 0) {
          this.isFormValid = false;
        }
      }
    },

    // Manage Ingredients
    addIngredient() {
      if (
        this.$refs.form.validate() &&
        this.newIngredient.ingredient &&
        this.newIngredient.quantity &&
        this.newIngredient.unit
      ) {
        this.ingredients.push({ ...this.newIngredient });
        this.newIngredient = { ingredient: "", quantity: "", unit: "" };
        this.updateIngredientText();
      }
    },

    removeLastIngredient(index) {
      this.ingredients.splice(index, 1);
      this.updateIngredientText();
    },

    updateIngredientText() {
      this.ingredientText = this.ingredients
        .map(
          (ingredient) =>
            `${ingredient.ingredient} ${ingredient.quantity} ${ingredient.unit}`
        )
        .join("\n");
    },

    // Cancel and Close
    cancel() {
      this.$emit("cancel");
    },
    closeDialog() {
      this.dialogVisible = false;
      this.cancel();
    },

    // RULES
    titleRule(v) {
      if (!v) {
        return "Un titre est requis";
      }
      if (v.length < 3 || v.length > 30) {
        return "Le titre doit avoir entre 3 et 30 caractères max";
      }
      return true;
    },

    descriptionRule(v) {
      if (!v) {
        return "Une description est requise";
      }
      if (v.length < 3 || v.length > 100) {
        return "La description doit avoir entre 3 et 100 caractères max";
      }
      return true;
    },

    ingredientRule(v) {
      if (!v || v.length < 3 || v.length > 30) {
        return "L'ingrédient doit avoir entre 3 et 30 caractères.";
      }
      return true;
    },

    quantityRule(v) {
      if (v <= 0) {
        return "La quantité doit être supérieure à zéro.";
      }
      return true;
    },

    unitRule(v) {
      if (v.length < 1 || v.length > 10) {
        return "L'unité doit avoir entre 1 et 10 caractères.";
      }
      return true;
    },
  },
};
</script>
