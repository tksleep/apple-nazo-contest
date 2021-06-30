<template>
  <div id='bg'>
    <v-container :style='{background: $vuetify.theme.themes.light.header_background}' fluid>
    <v-row align='center' wrap>
      <v-col cols=2 md=3>
        <v-btn id='button' block text x-large target='_blank' :href='"https://twitter.com/intent/tweet?&hashtags=りんご謎王&text=" + generateTweetUrl + "&url=https://applenazo.ffbas.com" + this.$route.path'>
          <v-icon color='red accent-3' large>mdi-twitter</v-icon>
          <span class='d-none d-md-flex'>共有する</span>
        </v-btn>
      </v-col>
      <v-col id='title' cols=8 md=6 class='d-flex justify-center'>
        <router-link :to='{ name: "Index"}'>
          <img src='@/assets/title.jpg'>
        </router-link>
      </v-col>
      <v-col cols=2 md=3>
        <v-btn id='button' block text x-large to='/user'>
          <v-icon color='red accent-3' large>mdi-account</v-icon>
          <span class='d-none d-md-flex'>ユーザー/投票詳細</span>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
  </div>
</template>

<script>
export default {
  computed: {
    generateTweetUrl: function() {
      if(typeof this.$route.params.id === 'number'){
        return 'No.' + this.$route.params.id + "を解きました！";
      }else{
        return 'りんご謎王';
      }
    }
  },
  created(){
    this.windowSize = window.innerWidth
  },
}
</script>


<style scoped>
h2 {
   text-align: center;
}
a {
  text-decoration: none;
}
img {
  object-fit: contain;
  height: 0 auto;
  width: 100%;
}
#title {
  padding-left: 0;
  padding-right: 0;
}
#button {
  padding: 0;
  text-align: center;
}
</style>