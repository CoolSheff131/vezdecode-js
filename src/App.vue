<template>
  <div id="app">
    <Header>
      <CloseButton />
    </Header>
    <Content :header="true" :footer="false" :scroll="true" :scrollbar="true">
      
      <!-- <div class="mt-6 text-center">
        <Button class="w-28" @setBarcode="setBarcode">
          <template slot="text">Read QR</template>
        </Button>
      </div> -->
      <div class="mx-2 mt-6 text-xl  text-center">
        <b>Баллы: {{points}}</b>
      </div>

      <ul>
        <li v-for="product in products" :key="product.id">
        <span>
          Название: {{ product.name }}
        </span>
        <span>
          Стоимость: {{ product.cost }}
        </span>
        <button :disabled="product.cost> points" v-on:click="buyProduct(product)">
          Купить
        </button>
        </li>
      </ul>

      <!-- <div v-if="barcode" class="mx-2 mt-6 text-center">
        <b>Result:</b>
        <br />
        {{ this.barcode.result }}
      </div> -->
      <div>
    
  </div>
      <!--<Shimmer />-->
      <!--<SurveyCard-->
      <!--url="http://"-->
      <!--imgUrl=""-->
      <!--name="SurveyCard"-->
      <!--description="SurveyCard"-->
      <!--/>-->
    </Content>
    <!--<Footer>content footer</Footer>-->
    <Modal :isVisible="modal.show" :qrCodeValue="value" @onClose="modal.show = false" />
    <!--<Spinner v-if="spinner" />-->
  </div>
</template>

<script lang="ts">
import Header from "./components/Header";
import CloseButton from "./components/CloseButton";
import Content from "./components/Content";
import Button from "./components/Button";

// import SurveyCard from "./components/SurveyCard";
// import Shimmer from "./components/Shimmer";
// import Spinner from "./components/Spinner";
import Modal from "./components/Modal";
// import Footer from "./components/Footer";
export default {
  name: "App",
  components: {
    
    // SurveyCard,
    // Shimmer,
    // Spinner,
    Modal,
    // Footer,
    Content,
    Header,
    CloseButton,
    Button,
  },
  data() {
    return {
      barcode: "",
      points: 220,
      userId: 1,
      modal: {
        show: false,
      },
      products: [
        {id: 1, name: 'Товар 1', cost: 20},
        {id: 2, name: 'Товар 2', cost: 20},
        {id: 3, name: 'Товар 3', cost: 20},
        {id: 4, name: 'Товар 4', cost: 20},
        {id: 5, name: 'Товар 5', cost: 20},
        {id: 6, name: 'Товар 6', cost: 20},
        {id: 7, name: 'Товар 7', cost: 20},
        {id: 8, name: 'Товар 8', cost: 20},
        {id: 9, name: 'Товар 9', cost: 200},
      ],
      value: 'https://example.com',
        
      spinner: true,
    };
  },
  methods: {
    buyProduct(product){
      this.value = `${this.userId} ${product.id}`
      this.points -= product.cost
      this.modal.show = true
    },
    setBarcode(barcode) {
      this.barcode = barcode;
    },
  },
};
</script>
