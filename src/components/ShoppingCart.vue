<template>
  <div class="cart">
    <br>
    <div class="row">
      <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-3">
        <!-- User Details section -->
        <div class="user-dets">
          <h3>User Details</h3>
          <!-- Form for user details -->
          <div class="mt-3 mb-5" style="max-width: 520px;">
            <label for="username">Username: (Enter without space & numbers)</label>
            <input type="text" id="username" class="form-control" v-model="$parent.username" maxlength="20">
            
            <label for="contact">Contact: (Only numbers are allowed)</label>
            <input type="text" id="contact" class="form-control" v-model="$parent.contact" maxlength="12">
          </div>
          
          <!-- Display order details with dynamic content -->
          <h5>Order Details:</h5>
          Username: <b>{{ $parent.username }}</b><br>
          Phone: <b>{{ $parent.contact }}</b><br>
          Total Items in cart: <b>{{ totalItemsInCart }}</b><br>
          Total Amount: <b>£{{ total }}</b>
        </div>
        
        <!-- Checkout button -->
        <button @click="checkout" :disabled="!$parent.isCheckoutEnabled" class="btn btn-primary checkout-btn">Checkout</button>
      </div>
      
      <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-3">
        <!-- Heading for Shopping Cart -->
        <h3 class="text-center">Shopping Cart</h3>
        
        <!-- List of items in the cart -->
        <ul class="cart-item">
          <li v-for="item in cart" :key="item.id">
            <!-- Display item details and quantity manipulation buttons -->
            <h5>{{ item.LessonName }} in £{{ item.LessonPrice }}</h5>
            <h5 class="mt-1 mb-2">Location: {{ item.LessonLocation }}</h5>
            <h5 class="mt-1 mb-2">Spaces: {{ item.LessonSpace }}</h5>
            <h5 class="mt-1 mb-2">Total: £{{ item.LessonPrice * item.LessonSpace }}</h5>
            <!-- Buttons to decrement, increment, and remove items from the cart -->
            <button @click="decrementQty(item)" class="btn btn-secondary">-</button>
            <button @click="incrementQty(item)" class="btn btn-secondary">+</button>
            <button @click="removeFromCart(item)" class="btn btn-danger">Remove</button>
          </li>
        </ul>
        
        <!-- Display total price of items in the cart -->
        <h3 class="mt-2">Total Price: £{{ total }}</h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShoppingCart',
  props: ['cart', 'total'],
  computed: {
    totalItemsInCart() {
      return this.cart.reduce((acc, item) => acc + item.LessonSpace, 0);
    }
  },
  methods: {
    removeFromCart(item) {
      this.$emit('remove-from-cart', item);
    },
    checkout() {
      this.$emit('checkout');
    },
    decrementQty(item) {
      this.$emit('decrement-qty', item);
    },
    incrementQty(item) {
      this.$emit('increment-qty', item);
    }
  }
}
</script>
