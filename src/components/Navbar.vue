<template>
  <nav class="navbar navbar-expand-lg bg-light">
    <div class="container">
        <a class="navbar-brand text-success" href="#" @click="handleHomeLinkClick">{{ title }}</a>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
              aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#" @click="handleHomeLinkClick">Home</a>
          </li>
          <li class="nav-item">
            <button @click="toggleCart" class="btn btn-primary position-relative" :disabled="cart.length === 0">
              <i class="bi bi-cart"></i>
              <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {{ totalItemsInCart }}
                <span class="visually-hidden">Cart Items</span>
              </span>
            </button>
          </li>
        </ul>
        <form class="d-flex" role="search">
              <!-- Navbar content -->
              <input
								class="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                :value="searchQuery"
                @input="handleSearchInput($event.target.value)"
              >
              <ul v-if="searchSuggestions.length" class="dropdown-menu dropdown-menu-end w-30">
                <li v-for="suggestion in searchSuggestions"  :key="suggestion">
                  <a class="dropdown-item" @click.prevent="selectSuggestion(suggestion)">{{ suggestion }}</a>
                </li>
              </ul>
        </form>
      </div>
    </div>
  </nav>
</template>


<script>
import { debounce } from "lodash-es";

export default {
  name: 'Navbar',
  props: ['title', 'cart', 'totalItemsInCart', 'searchQuery', 'searchSuggestions'],
  mounted() {
    this.debouncedSearch = debounce(this.updateSearchSuggestions, 300);
  },
  methods: {
    handleHomeLinkClick() {
      this.$emit('home-clicked');
    },
    handleSearchInput(query) {
      this.$emit('update-searchQuery', query);
      this.debouncedSearch();
    },
    toggleCart() {
      this.$emit('toggle-cart');
    },
    selectSuggestion(suggestion) {
      this.$emit('suggestion-selected', suggestion);
    },
    updateSearchSuggestions() {
      this.$emit('update-search');
    },
  }
};
</script>