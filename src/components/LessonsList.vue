<template>
  <div class="lessons">
    <h3>Lessons List</h3>
    <div>
      <label>Sort:</label>
      <select :value="sortCriteria" @change="$emit('update:sortCriteria', $event.target.value)">
        <option value="LessonName">Name</option>
        <option value="LessonPrice">Price</option>
        <option value="LessonLocation">Location</option>
        <option value="LessonSpace">Spaces Available</option>
      </select>
      <select :value="sortOrder" @change="$emit('update:sortOrder', $event.target.value)">
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
    <div class="row">
      <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 mt-3" v-for="lesson in lessons" :key="lesson.id">
        <div class="lesson-box">
          <img :src="lesson.LessonImg" alt="Lesson Image" class="lesson-img" style="width: 50px; height: 50px;">
          <div>
            <b>{{ lesson.LessonName }}</b><br>
            <b>Location: {{ lesson.LessonLocation }}</b><br>
            <b>Price: £{{ lesson.LessonPrice }}</b><br>
            <span v-if="lesson.LessonSpace > 0">
              <p><b>Space: {{ lesson.LessonSpace }}</b></p>
              <button @click="addToCart(lesson)" class="btn btn-success">Add to Cart</button>
            </span>
            <span v-else>
              <b>Out of Stock</b>
              <button disabled class="btn btn-secondary">Add to Cart</button>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'LessonsList',
  props: ['lessons', 'sortCriteria', 'sortOrder'],
  computed: {
    sortedAndFilteredLessons() {
      return this.lessons
        .filter(lesson => {
          return lesson.LessonName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                 lesson.LessonLocation.toLowerCase().includes(this.searchQuery.toLowerCase());
        })
        .sort((a, b) => {
          let modifier = 1;
          if (this.sortOrder === 'desc') modifier = -1;
          return a[this.sortCriteria] < b[this.sortCriteria] ? -1 * modifier : 1 * modifier;
        });
    }
  },
  methods: {
    addToCart(lesson) {
      this.$emit('add-to-cart', lesson);
    },
  },
};
</script>


