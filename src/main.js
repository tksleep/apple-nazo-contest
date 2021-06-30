import Vue from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase/app'
import 'firebase/firestore'
import vuetify from './plugins/vuetify'
import store from './store'


Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

firebase.initializeApp(firebaseConfig);


/*export const isLogin = firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    true;
  } else {
    false;
  }
});*/

export const db = firebase.firestore();

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
