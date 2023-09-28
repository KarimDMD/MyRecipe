<template>
  <v-text-field
    v-model="searchQuery"
    label="Recherche par nom ou ingrédients"
    @input="updateSearch"
    clearable
  ></v-text-field>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
    };
  },
  methods: {
    updateSearch() {
      this.$emit('search', this.searchQuery);
    },
  },
};
</script>
