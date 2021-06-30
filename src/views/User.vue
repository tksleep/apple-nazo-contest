<template>
  <div>
    <v-container>
      <v-row justify="center" align="center">
        <v-col cols=2>
          <img class="tw-img" :src="photo">
        </v-col>
        <v-col cols=5 md=4>
          <span class="text-h6 text-md-h4" style="overflow-wrap: break-word;">{{ name }}</span>
        </v-col>
        <v-col cols=4 md=3>
          <v-btn block @click="isLogOutButtonPressed">ログアウト</v-btn>
        </v-col>
      </v-row>
      <v-row justify="center" align="center">
        <v-col cols="12">
          <span class="text-h5 d-flex justify-center">残りの投票枠: {{ remainVotes }}</span>
        </v-col>
        <v-col cols=12>
          <v-row justify="center" v-for="(v, index) in votedQuestionsName" :key="v.id">
            <v-col cols=6>
              <span class="d-flex justify-center text-h6">{{ v }}</span>
            </v-col>
            <v-col cols=6>
              <div class="d-flex justify-center">
                <v-btn :to="{ name: 'Detail', params: { id: votedQuestionsID[index] }}">詳細</v-btn>
                <v-btn @click="isRemoveButtonPressed(votedQuestionsID[index])">取消</v-btn>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols=12>
          <span class="d-flex text-h4 justify-center">ルール</span>
          <ul>
            <li>6/1(火)21時より公開の特設Webサイトにて、全80問のこたえがりんごになる謎「りんご謎」が公開されます。</li>
            <li>お持ちのTwitterアカウントでWebサイトにログインした後、全80問の閲覧・投票が可能です。</li>
            <li>投票は１人につき５票で、票は自由に振り分けることができます。例えば、１つの謎に５票分を入れても構いませんし、５つの謎に１票ずつ投票しても構いません。</li>
            <li>制作者は、自分の制作した謎に投票することはできません。</li>
            <li>複数のTwitterアカウントをお持ちでも１人につき１アカウントで投票してください。</li>
            <li>不正な投票は無効票として扱います。</li>
            <li>こたえがりんごになる謎王はカンパ制です。メインページのカンパ箱よりご支援をよろしくお願いします。</li>
          </ul>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'
import { db } from '../main.js';


export default {
  data: function () {
    return {
      name: firebase.auth().currentUser.displayName,
      photo: firebase.auth().currentUser.photoURL,
      remainVotes: undefined,
      votes: [],
      votedQuestionsID: [],
      votedQuestionsName: [],
    }
  },
  async mounted () {
    firebase.auth().onAuthStateChanged(function(user) {
      if (!user) {
        console.log("Error");
      }
    })
    await db.collection("users").doc(firebase.auth().currentUser.uid).get().then((doc) => {
      this.remainVotes = 5 - doc.data().votes.length;
      this.votes = doc.data().votes;
      doc.data().votes.forEach((v) =>{
          v.get().then((d) => {
          this.votedQuestionsID.push(d.data().id);
          this.votedQuestionsName.push("No." + d.data().id);
        })
      })
    });
  },
  methods: {
    isLogOutButtonPressed: function () {
      firebase.auth().signOut().then(() => {
      // Sign-out successful.
        this.$router.push({ name: "LogIn" })
      }).catch((error) => {
      // An error happened.
        console.log(error);
        this.$router.next();
      });
    },
    isRemoveButtonPressed: async function (id) {
      const uid = firebase.auth().currentUser.uid;
      let index = 0;

      this.votes.forEach((v) =>{
        if(v.id == id){
          index = this.votes.indexOf(v);
        }
      })

      const que = (this.votes.splice(index, 1))[0];

      const usersData = {
        votes: this.votes,
        updated_at: firebase.firestore.FieldValue.serverTimestamp(),
      };
      const questionsData = {};

      await que.get().then((doc) => {
        const users = doc.data().users;
        users.splice(users.indexOf(db.doc("users/" + uid)), 1);
        questionsData.users = users;
      });

      await db.collection("users").doc(uid).update(usersData);
      await que.update(questionsData);

      this.$router.go({path: this.$router.currentRoute.path, force: true});
    },
  },
}
</script>

<style module>

</style>