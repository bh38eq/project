var eventBus = new Vue()

Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
        <ul>
            <li v-for="detail in details">{{ detail }}</li>
        </ul>
    `
})

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="product">
        <div class="product-image">
            <img v-bind:src="image">
        </div>

        <div class="product-info">
            <h1>{{ title }}</h1>
            <p>{{ prodDetail }}</p>
            <a v-bind:href="link" target="blank">More products</a>
            <!-- <p v-if="onSale">In Stock</p>
            <p v-else>Out of Stock</p> -->
            <!-- <p v-if="onSale > 10">In Stock</p>
            <p v-else-if="onSale <= 10 && onSale > 10">Almost sold out</p>
            <p v-else :class="{ styleTxt: !onSale }">Out of Stock</p> -->
            <p>Shipping: {{ shipping }}</p>
            <span v-if="onSale">On Sale!</span>
            <span v-else>Not on sale!</span>

            <info-tabs :shipping="shipping" :details="details"></info-tabs>

            <div v-for="(variant, index) in variants" :key="variant.variantId" class="color-box"
                :style="{ backgroundColor: variant.variantColor }" @mouseover="updateProduct(index)">
            </div>

            <ul>
                <li v-for="size in sizes">{{ size }}</li>
            </ul>

            <button @click="addToCart" :disabled="!onSale" :class="{ disabledButton: !onSale }">Add to Cart</button>
            <button @click="removeToCart">Remove to Cart</button>
        </div>
        <product-tabs :reviews="reviews"></product-tabs>
    </div>
    `,
    data() {
        return {
            brand: 'Vue',
            product: 'Socks',
            prodDetail: 'A pair of warm, fuzzy socks',
            selectedVariant: 0,
            link: 'https://www.google.com/search?q=socks&client=firefox-b-d&source=lnms&tbm=isch&sa=X&ved=0ahUKEwi9iKaY29jhAhVS1eAKHV0VCewQ_AUIDigB&biw=1366&bih=639',
            //inventory: 100,
            //onSale: false,
            details: [
                "80% cotton",
                "20% polyester",
                "Gender-neutral",
            ],

            variants: [
                {
                    variantId: 2234,
                    variantColor: "green",
                    variantImage: "../assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: "blue",
                    variantImage: "../assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }
            ],
            reviews: [],
            sizes: [
                "S",
                "XS",
                "M",
                "XM",
                "L",
                "XL",
            ],
            onSAle: true,
        }
    },

    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        removeToCart() {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
        },
        updateProduct(index) {
            this.selectedVariant = index
            console.log(index)
        },
    },

    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        onSale() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        shipping() {
            if (this.premium) {
                return "Free"
            }
            return 2.99
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    },
})

Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">

        <p class="error" v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>

        <p>
            <label for="name">Name: </label>
            <input id="name" v-model="name">
        </p>
        
        <p>
            <label for="review">Review:</label>
            <textarea id="review" v-model="review"></textarea>
        </p>
        
        <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
        </p>

        <p>Would you recommend this product?</p>
            <label>Yes</label>
            <input type="radio" value="Yes" v-model="recommend"/>
            <label>No</label>
            <input type="radio" value="No" v-model="recommend"/>

        <p>
            <input type="submit" value="Submit">
        </p>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            this.errors = []
                if(this.name && this.review && this.rating && this.recommend) {
                    let productReview = {
                        name: this.name,
                        review: this.review,
                        rating: this.rating,
                        recommend: this.recommend
                    }
                    eventBus.$emit('review-submitted', productReview)
                    this.name = null
                    this.review = null
                    this.rating = null
                    this.recommend = null
                } 

                else {
                    if(!this.name) this.errors.push("Name required.")
                    if(!this.review) this.errors.push("Review required.")
                    if(!this.rating) this.errors.push("Rating required.")
                    if(!this.rating) this.errors.push("Recommendation required.")
                }
        }
    },
})

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        }
    },
    template: `
        <div>
            <div>
                <span class="tab" :class="{ activeTab: selectedTab === tab }" v-for="(tab, index) in tabs" :key="index" @click="selectedTab = tab">{{ tab }}</span>
            </div>

            <div v-show="selectedTab === 'Reviews'">
                <h2>Reviews</h2>
                <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul v-else>
                    <li v-for="(review, index) in reviews" :key="index">
                        <p>{{ review.name }}</p>
                        <p>Rating:{{ review.rating }}</p>
                        <p>{{ review.review }}</p>
                    </li>
                </ul>
            </div>
            <div v-show="selectedTab === 'Make a Review'">
                <product-review ></product-review>
            </div>
        </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    }
})

Vue.component('info-tabs', {
    props: {
        shipping: {
            required: true
        },
        details: {
            type: Array,
            required: true
        }
    },
    template: `
        <div>  
            <ul>
                <span class="tabs" :class="{ activeTab: selectedTab === tab }" v-for="(tab, index) in tabs" @click="selectedTab = tab" :key="tab">{{ tab }}</span>
            </ul>
            <div v-show="selectedTab === 'Shipping'">
                <p>{{ shipping }}</p>
            </div>
            <div v-show="selectedTab === 'Details'">
                <ul>
                    <li v-for="detail in details">{{ detail }}</li>
                </ul>
            </div>
        </div>
`,
data() {
  return {
    tabs: ['Shipping', 'Details'],
    selectedTab: 'Shipping'
  }
}
})

var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        },
        removeItem(id) {
            for (var i = this.cart.length - 1; i >= 0; i--) {
                if (this.cart[i] === id) {
                    this.cart.splice(i, 1);
                }
            }
        }
    },
})