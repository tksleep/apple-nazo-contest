<template>
<v-container>
  <v-row justify="center">
    <v-col>
      <div id="firebaseui-auth-container"></div>
      <div id="loader" style="text-align: center;">Loading...</div>
    </v-col>
  </v-row>
</v-container>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';
import { db } from '../main.js';
import * as firebaseui from 'firebaseui';
require("firebaseui/dist/firebaseui.css");

export default{
  async mounted() {
    var ui = firebaseui.auth.AuthUI.getInstance() ||  new firebaseui.auth.AuthUI(firebase.auth());

    const uiConfig = {
      callbacks: {
        uiShown: function() {
          document.getElementById('loader').style.display = 'none';
          console.log("UI was shown");
        },
        signInSuccessWithAuthResult: async (authResult) => {
          await firebase.auth().currentUser.updateProfile({
            displayName: authResult.user.providerData[0].displayName,
            photoURL: authResult.user.providerData[0].photoURL,
          });

          const userData = { updated_at: firebase.firestore.FieldValue.serverTimestamp() };
          const cd = db.collection('users').doc(authResult.user.uid);

          await cd.get().then(async (doc) => {
            if(!doc.exists){
              userData.uid = authResult.user.uid;
              userData.name = authResult.user.displayName;
              userData.created_at = firebase.firestore.FieldValue.serverTimestamp();
              userData.votes = [];
              await cd.set(userData);
            }else if(doc.data().name != authResult.user.displayName){
              userData.name = authResult.user.displayName;
              await cd.update(userData);
            }
          });
          this.$router.push({ name: "Index" });
          return false;
        }
      },
      signInFlow: "redirect",
      signInSuccessUrl: "",
      signInOptions: [firebase.auth.TwitterAuthProvider.PROVIDER_ID],
    }

    ui.start('#firebaseui-auth-container', uiConfig);
  },
}
</script>