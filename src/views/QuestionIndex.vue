<template>
<v-container>
  <v-row justify=center>
    <v-col cols=6>
      <v-card color="blue lighten-4" height=64 href='https://twitter.com/FFBASparty' target="_blank">
        <v-card-title class="justify-center"><span class='d-none d-md-flex'>FFBAS</span>公式Twitter</v-card-title>
      </v-card>
    </v-col>
    <v-col cols=6>
      <v-card color="amber lighten-5" height=64 href='https://note.com/ffbasparty/n/n5b6ce0119808' target="_blank">
        <v-card-title class="justify-center">カンパ箱<span class='d-none d-md-flex'>はこちら</span></v-card-title>
      </v-card>
    </v-col>
    <v-col cols=12 sm=6 md=3 v-for="q in 80" :key="q">
      <v-card @click="linkToDetailOnClickCard(q)">
        <v-card-title>No.{{ q }}</v-card-title>
        <img :src="'/ringo-q/ringo-q.' + ( '000' + q ).slice( -3 ) + '.jpeg'"/>
      </v-card>
    </v-col>
  </v-row>
</v-container>
</template>

<script>
export default {
  data: function () {
    return {
      questionsId: [],
    }
  },
  methods: {
    linkToDetailOnClickCard(q_id){
      this.$router.push({ name: 'Detail', params: {id: q_id} });
    },
  }
}
</script>

<style module>
</style>
