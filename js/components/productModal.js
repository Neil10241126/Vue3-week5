const apiUrl = 'https:/vue3-course-api.hexschool.io';
const apiPath = 'neil-api-test1';

export default {
  props: ['id', 'addToCart', 'loadingStatue', 'openModal'],
  template: '#userProductModal',
  data() {
    return {
      tempProduct: {},
      modal: {},
      qty: 1,
    };
  },
  methods: {
    hide() {
      this.modal.hide();
    },
  },
  watch: {
    id() {
      if (this.id) {
        axios.get(`${apiUrl}/v2/api/${apiPath}/product/${this.id}`)
          .then((res) => {
            this.tempProduct = res.data.product;
            this.modal.show();
            this.openModal('');
          });
      }
    },
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
  },
};
