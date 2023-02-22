import productModal from './components/productModal.js';

const { createApp } = Vue;
const apiUrl = 'https:/vue3-course-api.hexschool.io';
const apiPath = 'neil-api-test1';

Object.keys(VeeValidateRules).forEach((rule) => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

const app = createApp({
  data() {
    return {
      products: [],
      productId: '',
      cart: [],
      loadingStatue: '',
      user: {
        email: '',
        name: '',
        tel: '',
        address: '',
        message: '',
      },
    };
  },
  components: {
    productModal,
  },
  methods: {
    getProducts() {
      axios.get(`${apiUrl}/v2/api/${apiPath}/products`)
        .then((res) => {
          this.products = res.data.products;
        });
    },
    openModal(id) {
      this.productId = id;
      this.loadingStatue = id;
    },
    addToCart(product_id, qty = 1) {
      this.loadingStatue = product_id;
      const data = {
        product_id,
        qty,
      };
      axios.post(`${apiUrl}/v2/api/${apiPath}/cart`, { data })
        .then((res) => {
          this.$refs.modal.hide();
          this.getCartList();
          this.loadingStatue = '';
        });
    },
    getCartList() {
      axios.get(`${apiUrl}/v2/api/${apiPath}/cart`)
        .then((res) => {
          this.cart = res.data.data;
        });
    },
    changeCartNum(product_id, qty) {
      this.loadingStatue = product_id;
      const data = {
        product_id,
        qty,
      };
      axios.put(`${apiUrl}/v2/api/${apiPath}/cart/${product_id}`, { data })
        .then(() => {
          this.getCartList();
          this.loadingStatue = '';
        });
    },
    deleteCartItem(id) {
      this.loadingStatue = id;
      axios.delete(`${apiUrl}/v2/api/${apiPath}/cart/${id}`)
        .then(() => {
          this.getCartList();
        });
    },
    deleteCartAll() {
      axios.delete(`${apiUrl}/v2/api/${apiPath}/carts`)
        .then(() => {
          alert('該筆訂單已全部刪除');
          this.getCartList();
        });
    },
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/;
      return phoneNumber.test(value) ? true : '需要正確的電話號碼';
    },
    sendOrder() {
      const data = {
        user: this.user,
        message: '這是留言',
      };
      axios.post(`${apiUrl}/v2/api/${apiPath}/order`, { data })
        .then((res) => {
          alert(res.data.message);
          this.$refs.form.resetForm();
          this.user.message = '';
          this.getCartList();
        });
    },
  },
  mounted() {
    this.getProducts();
    this.getCartList();
  },
});

// 元件全域註冊
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.mount('#app');
