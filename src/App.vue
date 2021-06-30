<template>
  <v-app :style="{ background: $vuetify.theme.themes.light.background }">
    <Header/>
    <v-main>
      <router-view/>
    </v-main>
    <v-spacer></v-spacer>
    <Footer/>
  </v-app>
</template>

<script>
//import { component } from 'vue/types/umd';
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',

  data: () => ({
    //
  }),
  components: {
    Header,
    Footer
  }
};
</script>

<style>
</style>