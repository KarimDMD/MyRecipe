<template>
  <v-card class="pa-4">
    <v-card-title class="mb-4">Ajouter une recette</v-card-title>
    <v-form @submit.prevent="addRecipe" ref="form">
      <!-- Ttile -->
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
      <!-- Ingredients -->
      <v-row
        v-for="(ingredient, index) in ingredients"
        :key="index"
        class="align-center"
        style="margin-bottom: -35px"
      >
        <v-col cols="4">
          <v-text-field
            v-model="ingredient.ingredient"
            label="Ingrédient"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="ingredient.quantity"
            label="Quantité"
            required
            type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="ingredient.unit"
            label="Unité"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="2" class="d-flex align-center">
          <v-btn
            v-if="index > 0"
            color="error"
            @click="removeIngredient(index)"
          >
            X
          </v-btn>
        </v-col>
      </v-row>
      <v-btn color="primary" @click="addIngredient" style="margin-top: 25px">
        Ajouter un ingrédient
      </v-btn>

      <!-- Btn Ajouter / Annuler -->
      <v-card-actions class="d-flex justify-center">
        <v-btn type="submit" color="primary" :disabled="!isFormValid"
          >Ajouter</v-btn
        >
        <v-btn color="error" @click="cancel">Annuler</v-btn>
      </v-card-actions>

      <!-- Confirmation Popup -->
      <v-dialog v-model="dialogVisible" max-width="400">
        <v-card>
          <v-card-title class="text-center">{{ dialogTitle }}</v-card-title>
          <v-card-text>{{ dialogMessage }}</v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="closeDialog">Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-form>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      description: "",
      ingredients: [{ ingredient: "", quantity: null, unit: "" }],
      dialogVisible: false,
      dialogTitle: "",
      dialogMessage: "",
      isFormValid: true,
    };
  },
  methods: {
    addRecipe() {
      if (this.$refs.form.validate()) {
        const newRecipe = {
          title: this.title,
          description: this.description,
          ingredients: JSON.stringify(this.ingredients),
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

            this.dialogTitle = "Recette ajoutée";
            this.dialogMessage = "La recette a été ajoutée avec succès.";
            this.dialogVisible = true;

            this.$emit("recipe-added", data);
          })
          .catch((error) => {
            console.error("Erreur lors de l'ajout de la recette :", error);

            this.dialogTitle = "Erreur";
            this.dialogMessage =
              "Une erreur s'est produite lors de l'ajout de la recette.";
            this.dialogVisible = true;
          });
      }
    },

    addIngredient() {
      this.ingredients.push({ ingredient: "", quantity: null, unit: "" });
    },

    removeIngredient(index) {
      this.ingredients.splice(index, 1);
    },

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
      if (v.length < 3 || v.length > 20) {
        return "Le titre doit avoir entre 3 et 20 caractères max";
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
  },
};
</script>
