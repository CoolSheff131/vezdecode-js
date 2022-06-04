<template>
  <div id="app">
    <Header>
      <CloseButton />
    </Header>
    <Content :header="true" :footer="false" :scroll="true" :scrollbar="true">
      <div v-if="userChange !== null">
      <h1>{{userChange.name}}</h1>
        <input type="number" v-model="newUserPoints"></input>
        <button v-on:click="cancelChangeUser()">Отмена</button>
        <button v-on:click="changeUser()">Изменить</button>
      </div>
      <Spinner v-if="isLoadingUsers" />
      <ul v-else>
        <li v-for="user in allUsers" :key="user.id">
          <span> Имя: {{ user.name }} </span>
          <span> Баллы: {{ user.points }} </span>
          <button v-on:click="startChangeUser(user)">Изменить</button>
        </li>
      </ul>
      <div class="mt-6 text-center">
        <Button class="w-280" @setBarcode="setBarcode">
          <template slot="text">Сканировать QR-код из задания за 10</template>
        </Button>
      </div>

      <Spinner v-if="isLoadingUsers" />
      <div v-else>
        <h1>Для покупок выберите пользователя</h1>
        <select v-model="currentUser">
          <option v-for="user in allUsers" :key="user.id" v-bind:value="user">{{ user.name }}</option>
        </select>

      </div>

      <div :v-if="currentUser !== null" class="mx-2 mt-6 text-xl text-center">
        <b>{{ currentUser && currentUser.name }}</b>
        <hr />
        <b>{{ currentUser && `Баллы: ${currentUser.points}` }}</b>
      </div>
      <Spinner v-if="isLoadingProducts" />
      <ul v-else>
        <li v-for="product in products" :key="product.id">
          <span> Название: {{ product.name }} </span>
          <span> Стоимость: {{ product.cost }} </span>
          <button
          v-if="currentUser"
            :disabled=" product.cost > currentUser.points"
            v-on:click="buyProduct(product)"
          >
            Купить
          </button>
        </li>
      </ul>
    </Content>
    <Modal :isVisible="modal.show" :qrCodeValue="qrValue" @onClose="modal.show = false" />
    
  </div>
</template>

<script lang="ts">
import Header from './components/Header';
import CloseButton from './components/CloseButton';
import Content from './components/Content';
import Button from './components/Button';

// import SurveyCard from "./components/SurveyCard";
// import Shimmer from "./components/Shimmer";
import Spinner from "./components/Spinner";
import Modal from './components/Modal';
// import Footer from "./components/Footer";
export default {
  name: 'App',
  components: {
    // SurveyCard,
    // Shimmer,
    Spinner,
    Modal,
    // Footer,
    Content,
    Header,
    CloseButton,
    Button,
  },
  data() {
    return {
      newUserPoints: 0,
      userChange: null,
      currentUser: null,
      allUsers: [],
      isLoadingUsers: false,
      
      modal: {
        show: false,
      },
      products: [],
      isLoadingProducts: false,
      qrValue: '',
      spinner: true,
    };
  },

  mounted() {
    this.getUsers()
    this.getProducts()
  },
  methods: {
    getUsers(){
      this.isLoadingUsers = true
fetch('https://almond-vast-salute.glitch.me/users')
      .then((data) => data.json())
      .then((data) => {
        this.allUsers = data;
        this.isLoadingUsers = false
        console.log(this.allUsers);
      });
    },
    getProducts(){
      this.isLoadingProducts = true
fetch('https://almond-vast-salute.glitch.me/products')
      .then((data) => data.json())
      .then((data) => {
        this.isLoadingProducts = false
        this.products = data;
        console.log(this.products);
      });
    },

cancelChangeUser(){
this.userChange = null
},
changeUser(){
if(this.userChange){
  fetch(`https://almond-vast-salute.glitch.me/users/${this.userChange.id}`,{
    method:'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: this.userChange.id,
      name: this.userChange.name,
      points: this.newUserPoints
    }) 
  }).then(data=>data.json()).then(data=>{
    
    console.log(data);
    this.userChange = null
    this.getUsers()
  })
}
},
    startChangeUser(user){
      this.userChange = user
      this.newUserPoints = user.points || 200
    },

    Encrypt(theText) {
let output = new String;
let Temp = new Array();
let Temp2 = new Array();
let TextSize = theText.length;
for (let i = 0; i < TextSize; i++) {
	let rnd = Math.round(Math.random() * 122) + 68;
	Temp[i] = theText.charCodeAt(i) + rnd;
	Temp2[i] = rnd;
}
for (let i = 0; i < TextSize; i++) {
	output += String.fromCharCode(Temp[i], Temp2[i]);
}
return output;
},
unEncrypt(theText) {
let output = new String;
let Temp = new Array();
let Temp2 = new Array();
let TextSize = theText.length;
for (let i = 0; i < TextSize; i++) {
	Temp[i] = theText.charCodeAt(i);
	Temp2[i] = theText.charCodeAt(i + 1);
}
for (let i = 0; i < TextSize; i = i+2) {
	output += String.fromCharCode(Temp[i] - Temp2[i]);
}
return output;
},
    buyProduct(product) {

      let str = JSON.stringify({userId: this.currentUser.id, productId: product.id, date:Date() })//`{userId: ${this.userId}, productId: ${product.id}, date: ${Date()}}`;
      let crypted = this.Encrypt(str)
      this.qrValue = crypted;
      //this.points -= product.cost;
      this.modal.show = true;
    },
    setBarcode(barcode) {
      let unencryptData = this.unEncrypt(barcode.result)

      const res = JSON.parse(unencryptData)
      
      fetch(`https://almond-vast-salute.glitch.me/users/${res.userId}`).then(data=>data.json()).then(user=>{

        fetch(`https://almond-vast-salute.glitch.me/products/${res.productId}`).then(data=>data.json()).then(product=>{
          
          const newPoints = user.points - product.cost

          fetch(`https://almond-vast-salute.glitch.me/users/${user.id}`,{
    method:'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: user.id,
      name: user.name,
      points: newPoints
    }) 
  }).then(data=>data.json()).then(data=>{
    
    this.getUsers()
  })


        })
      })
    
    },
  },
};
</script>
