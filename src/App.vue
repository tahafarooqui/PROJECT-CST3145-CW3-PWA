<template>
  <div>
    <Navbar
      :title="title"
      :cart="cart"
      :totalItemsInCart="totalItemsInCart"
      :searchQuery="searchQuery"
      :searchSuggestions="searchSuggestions"
      @update-searchQuery="updateSearchQuery"
      @update-search="updateSearchSuggestions"
      @suggestion-selected="selectSuggestion"
      @home-clicked="handleHomeLinkClick"
      @toggle-cart="toggleCart"
    />
    <ShoppingCart 
      v-if="showCart" 
      :cart="cart" 
      :total="total"
      @remove-from-cart="removeFromCart" 
      @checkout="checkout"
      @decrement-qty="decrementQty"
      @increment-qty="incrementQty"
    />
    <div v-else>
      <LessonsList
        :lessons="lessons"
        :sortCriteria="sortCriteria"
        :sortOrder="sortOrder"
        @update:sortCriteria="sortCriteria = $event"
        @update:sortOrder="sortOrder = $event"
        @add-to-cart="addToCart"
      />
    </div>
  </div>
</template>

  <script>
  import Navbar from './components/Navbar.vue';
  import LessonsList from './components/LessonsList.vue';
  import ShoppingCart from './components/ShoppingCart.vue';
  import { BASE_URL } from '@/apiConfig';

  export default {
    name: 'App',
    components: {
      Navbar,
      LessonsList,
      ShoppingCart,
    },
    data() {
      return {
        title: 'Vue Web Based Mobile App',
        lessons: [],
        cart: [],
        total: 0,
        showCart: false,
        username: '',
        contact: '',
        isUsernameValid: false,
        isContactValid: false,
        sortCriteria: 'LessonName',
        sortOrder: 'asc',
        searchQuery: '',
        searchSuggestions: [],
        isCheckoutEnabled: false,
      };
    },
    computed: {
      totalItemsInCart() {
        return this.cart.reduce((acc, item) => acc + item.LessonSpace, 0);
      }
    },
    watch: {
      username(val) {
        this.updateUsernameValidation();
      },
      contact(val) {
        this.updateContactValidation();
      },
    },
			methods: {
			    // Method to prevent closing the dropdown when clicking on a suggestion
				preventClose(event) {
					event.stopPropagation();
				},
	 
				// Fetch lessons with sorting and searching parameters
				fetchLessons() {
					const queryParams = new URLSearchParams({
						sort: this.sortCriteria,
						order: this.sortOrder,
						search: this.searchQuery
					}).toString();

					fetch(`${BASE_URL}lessons/all-lessons?${queryParams}`)
						.then(response => response.json())
						.then(data => {
							this.lessons = data;
						})
						.catch(error => console.error('Error fetching lessons:', error));
				},	
				// Create an order
				createOrder(orderData) {
					fetch(`${BASE_URL}orders/create-order`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(orderData)
					})
					.then(response => response)
					.then(data => {
						console.log('Order created:', data);
						alert('Order successfully placed!');
						
						// Call method to update LessonSpace for each lesson in the order
						this.updateLessonsAfterOrder(orderData.items);						
						
						// Reset the cart after order
						this.cart = [];
						this.calculateTotal();
					})
					.catch(error => {
						console.error(error);
						alert('Failed to place order');
					});
				},	

				updateLessonsAfterOrder(orderedItems) {

					// Map orderedItems to format required for bulk update
					const updates = orderedItems.map(item => ({
						lessonId: item._id,
						newSpace: item.TotalLessonSpace - item.LessonSpace // Calculate the new LessonSpace
					}));
					
		 
					// Send a single PUT request for bulk update
					fetch(`${BASE_URL}lessons/update-lessons`, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(updates)
					})
					.then(response => response.json())
					.then(data => {
						console.log('Lessons updated:', data);
					})
					.catch(error => {
						console.error('Error updating lessons:', error);
					});
				},
				
				// Method to add a lesson to the shopping cart
				addToCart(lesson) {
					// Check if there is available space for the lesson
					const existingIndex = this.cart.findIndex(item => item._id === lesson._id);

					if (lesson.LessonSpace > 0) {
						// Check if the lesson is already in the cart
						if (existingIndex !== -1) {
							// Increase the quantity if the lesson is already in the cart
							this.cart[existingIndex].LessonSpace++;
						} else {
							// Add the lesson to the cart with quantity 1
							this.cart.push({
								_id: lesson._id,
								LessonName: lesson.LessonName,
								LessonLocation: lesson.LessonLocation,
								LessonPrice: lesson.LessonPrice,
								TotalLessonSpace: lesson.LessonSpace,
								LessonSpace: 1,
							});
						}

						// Decrease the available space for the lesson
						lesson.LessonSpace--;

						// Recalculate the total amount in the cart
						this.calculateTotal();
					}
				},

				// Method to remove a lesson from the shopping cart
				removeFromCart(item) {
					// Find the index of the item in the cart
					const existingIndex = this.cart.findIndex(cartItem => cartItem._id === item._id);

					if (existingIndex !== -1) {
						// Remove the item from the cart
						this.cart.splice(existingIndex, 1);

						// Revert the LessonSpace for the removed item
						this.lessons.find(lesson => lesson._id === item._id).LessonSpace += item.LessonSpace;

						// Recalculate the total amount in the cart
						this.calculateTotal();
					}
				},

				// Method to increase the quantity of a lesson in the cart
				incrementQty(item) {
					const lesson = this.lessons.find(lesson => lesson._id === item._id);

					if (lesson) {
						// Increase the quantity in the cart and decrease the available LessonSpace
						item.LessonSpace++;
						lesson.LessonSpace--;

						// Revert if LessonSpace becomes negative
						if (lesson.LessonSpace < 0) {
							item.LessonSpace--;
							lesson.LessonSpace++;
						}

						// Recalculate the total amount in the cart
						this.calculateTotal();
					}
				},

				// Method to decrease the quantity of a lesson in the cart
				decrementQty(item) {
					const lesson = this.lessons.find(lesson => lesson._id === item._id);

					if (lesson && item.LessonSpace > 1) {
						// Decrease the quantity in the cart and increase the available LessonSpace
						item.LessonSpace--;
						lesson.LessonSpace++;

						// Recalculate the total amount in the cart
						this.calculateTotal();
					}
				},

				// Method to calculate the total amount in the cart
				calculateTotal() {
					this.total = this.cart.reduce((acc, item) => acc + item.LessonPrice *  item.LessonSpace, 0);
				},

				// Method to toggle between lessons and cart view
				toggleCart() {
					// Show cart only if there are items in it
					if (this.cart.length > 0) {
						this.showCart = !this.showCart;
					}         
				},

					handleHomeLinkClick() {
					// Show cart only if there are items in it
						this.showCart = false;
        }, 
				
				// Method to update search suggestions based on user input
				updateSearchSuggestions() {
					const query = this.searchQuery.toLowerCase();

					if (query === '') {
						// Display full list of suggestions when the query is empty
						this.searchSuggestions = this.lessons.map(lesson => lesson.LessonName);
					} else {
						// Filter and display suggestions based on the query
						const filteredLessons = this.lessons.filter(lesson =>
							lesson.LessonName.toLowerCase().includes(query) ||
							lesson.LessonLocation.toLowerCase().includes(query)
						);

						this.searchSuggestions = filteredLessons.map(lesson => lesson.LessonName);
					}
				},			

	
				
				
				// Updated method to handle suggestion selection
				selectSuggestion(suggestion) {
					this.searchQuery = suggestion;
					// Update the search input value
					this.$refs.searchInput.value = suggestion;
					// Trigger the search suggestions update
					this.updateSearchSuggestions();
				},

				updateSearchQuery(suggestion) {
					this.searchQuery = suggestion;
				},
				
				
				// Method to update the validity of the username
				updateUsernameValidation() {
					const trimmedUsername = this.username.trim();
					this.isUsernameValid = /^[A-Za-z]+$/.test(trimmedUsername) && !/\d/.test(trimmedUsername) ;
					
					  // If the current username does not meet the conditions, update it
					if (!this.isUsernameValid) {
						// Remove any non-alphabetic characters from the username
						this.username = trimmedUsername.replace(/[^A-Za-z]/g, '');
					}				
					
				},



				// Method to update the validity of the contact
				updateContactValidation() {
					const trimmedContact = this.contact.trim();
					this.isContactValid = /^[1-9]+$/.test(trimmedContact) && trimmedContact.length <= 12;
					
					  // If the current username does not meet the conditions, update it
						// If the current contact does not meet the conditions, update it
						if (!this.isContactValid) {
							// Remove any non-numeric characters from the contact
							this.contact = trimmedContact.replace(/\D/g, '');
						}
			
					
					
				},



			  // Method to check if the username and contact are valid
			  isValidUser() {
				this.updateUsernameValidation();
				this.updateContactValidation();

				// Update the isCheckoutEnabled flag based on the validity of the user
				this.isCheckoutEnabled = this.isUsernameValid && this.isContactValid;

				// Return the overall validation result
				return this.isCheckoutEnabled;
			  },

			  // Method to enable/disable the checkout button based on user validation
			  updateCheckoutButton() {
				this.isValidUser();
			  },

				// Updated checkout method with validation
				checkout() {
					if (this.isValidUser()) {
						// Implement your checkout logic here
						alert('Successfully booked!');

						// Prepare order data
						const orderData = {
							username: this.username,
							contact: this.contact,
							items: this.cart,
							totalAmount: this.total
						};
						
						// Create the order
						this.createOrder(orderData);

						// Reset the cart and user details after successful checkout
						this.cart = [];
						this.username = '';
						this.contact = '';

						// Recalculate the total amount in the cart
						this.calculateTotal();
						this.showCart = false;
													
						
					} else {
						// Display an error message if the username or contact is not valid
						alert('Please provide a valid name (letters only) and contact (numbers only).');
                }
				}				
				
			},
			created() {
				this.fetchLessons(); // Call fetchLessons to load and sort the lessons when the app is created
			},				
			// Fetch lessons when the application is created
			computed: {
				// Computed property to get the total number of items in the cart
				totalItemsInCart() {
					return this.cart.length;
				},						
				// Computed property to get the lessons (already sorted and filtered from the backend)
				sortedLessons() {
					return this.lessons;
				}			
			},
 
		  // Watchers to react to changes in data properties
			watch: {
				// Watch for changes in the username or contact and update the checkout button accordingly
				  username: 'updateUsernameValidation',
				  contact: 'updateContactValidation',
				// Watch for changes in both username and contact and update the checkout button
				username: {
					handler: 'updateCheckoutButton',
					deep: true,
				},
				contact: {
					handler: 'updateCheckoutButton',
					deep: true,
				},
				sortCriteria() {
					this.fetchLessons();
				},
				sortOrder() {
					this.fetchLessons();
				},
				searchQuery() {
					this.fetchLessons();
				},
				updateSearchQuery(suggestion) {
					this.updateSearchQuery();
				},

			}
};
</script>

