<template>
<v-container>
  <v-row justify="center" id="content">
    <v-col cols=12>
      <h1 class="d-flex justify-center" id="question_title">{{ "No." + id }}</h1>
    </v-col>

    <v-col cols=12 lg=10 id="question_image" class="image">
      <img :src="'/ringo-q/ringo-q.' + ( '000' + id ).slice( -3 ) + '.jpeg'"/>
    </v-col>

    <v-col cols=8 id="answer_button" v-if="!isAnswerButtonPressed">
      <v-btn block @click="answerButtonPressed">解答を表示</v-btn>
    </v-col>

    <template v-if="isAnswerButtonPressed">
      <v-col cols=12 lg=10 id="answer_image" class="image">
        <img :src="'/ringo-a/ringo-a.' + ( '000' + id ).slice( -3 ) + '.jpeg'"/>
      </v-col>
    </template>
  </v-row>

  <v-row justify="center">
    <v-col cols=8>
      <div>
        <span class="d-flex justify-center text-h6">投票可能な数: {{ remainVotes }} </span>
      </div>
    </v-col>
    <v-col cols=8 v-if="isDisableVotesButton" style="background-color: #FF8A80;">
      <span style="text-align: center;" class="d-flex justify-center text-h6"> 投票枠がありません！<br>ユーザーページで投票を取り消してください </span>
    </v-col>
  </v-row>

  <v-row justify="center">
    <v-col cols=3>
      <v-select
      v-model="selectedVotesValue"
      :items="canSelectValue"
      label="投票数"
      />
    </v-col>

    <v-col cols=5>
      <v-btn block v-bind:disabled="isDisableVotesButton" color="red accent-1" @click="submitPoint">投票する</v-btn>
    </v-col>
  </v-row>

  <v-row justify="center">
    <v-col cols=8 id="back_button">
      <v-btn block to="/">一覧に戻る</v-btn>
    </v-col>
    <v-col class="d-flex mb-16" cols=12></v-col>
  </v-row>

</v-container>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';
import {db} from '../main';

export default {
  data: function () {
    return {
      questionDescription: undefined,
      isAnswerButtonPressed: false,
      selectedPoint: undefined,
      id: this.$route.params.id,
      remainVotes: 0,
      selectedVotesValue: 0,
      canSelectValue: [1, 2, 3, 4, 5],
      votes: [],
      users: [],
      uid: undefined,
      isDisableVotesButton: false,
    }
  },
  mounted() {
    this.uid = firebase.auth().currentUser.uid;
    db.collection('questions').where("id", "==", Number(this.$route.params.id)).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        this.users = doc.data().users;
      });
    });
    db.collection("users").doc(this.uid).get().then((doc) => {
      this.remainVotes = 5 - doc.data().votes.length;
      if(5 - doc.data().votes.length <= 0) this.isDisableVotesButton = true;
      this.canSelectValue = this.canSelectValue.slice(0, 5 - doc.data().votes.length);
      this.votes = doc.data().votes;
    });
  },
  methods: {
    answerButtonPressed: function (){
      this.isAnswerButtonPressed = true
    },
    selectedPointChanged: function (point){
      this.selectedPoint = 2-point;
    },
    submitPoint: async function (){
      for(let i=0;i<this.selectedVotesValue;i++){
        const usersData = {
          updated_at: firebase.firestore.FieldValue.serverTimestamp(),
        };
        const questionsData = {};

        let votes = this.votes;
        votes.push(db.doc("questions/" + this.id));
        usersData.votes = votes;

        let users = this.users;
        users.push(db.doc("users/" + this.uid));
        questionsData.users = users;

        await db.doc("users/" + this.uid).update(usersData);
        await db.doc("questions/" + this.id).update(questionsData);
      }
      this.$router.push({ name: "User" });
    }
  }
}
</script>

<style module>

img {
  width: 100%;
}
</style>
