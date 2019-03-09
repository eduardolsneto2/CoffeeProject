<template>
  <div>
    <nav class="navbar navbar-dark bg-dark fixed-top">
  <!-- Navbar content -->
      <div class="">
        <button class="btn" v-on:click="Logout()">
          <img class="img-fluid image-checked"  src="../../assets/logout.png" alt="" width="30px" height="30px">
        </button>
      </div>
      <div class="">
        <button class="btn" v-on:click="GoToAddPaid()" v-if="profile == 'support'">
          <img class="img-fluid image-checked float-right"  src="../../assets/plus.png" alt="" width="30px" height="30px">
        </button>
      </div>
      <div class="">
        <button class="btn" v-on:click="GoToPresence()">
          <img class="img-fluid image-checked float-right"  src="../../assets/presence-indicator.png" alt="" width="30px" height="30px">
        </button>
      </div>
    </nav>
    <div style="margin-top: 65px;">
        <div class="" v-for=" (value, key, index) in paid ">
          <b-list-group>
            <b-list-group-item disabled> {{months[key]}}</b-list-group-item>
            <div class="" v-for="(value,key,index) in value">
            <b-list-group-item variant="secondary">{{value}}</b-list-group-item>
            </div>
          </b-list-group>
            
        </div>
    </div>
  </div>
</template>

<script>
export default {

  data() {
    return {
      paid: {},
      profile: '',
      months: {
        '01': 'Janeiro',
        '02': 'Fevereiro',
        '03': 'Março',
        '04': 'Abril',
        '05': 'Maio',
        '06': 'Junho',
        '07': 'Julho',
        '08': 'Agosto',
        '09': 'Setembro',
        '10': 'Outubro',
        '11': 'Novembro',
        '12': 'Dezembro'
      }
      }
    },

  methods: {
    getProfile: function (userId) {
      firebase.database().ref('users/' + userId + '/profile').once('value').then((snapshot) => {
        console.log('veio até aqui ' + snapshot.val())
        this.profile = snapshot.val()
        
      }).catch((error) => {
        console.log(error)
      });
    },
    Logout: function() {
      firebase.auth().signOut()
      .then(function() {
      // Sign-out successful.
      })
      .catch(function(error) {
      // An error happened
      });
    },
    GoToPresence: function() {
      this.$router.push({path: '/Presenca'})
    },
    GoToAddPaid: function() {
      this.$router.push({path: '/AdicionarPagamento'})
    },
    reverseObject:function(object) {
      var newObject = {};
      var keys = [];

      for (var key in object) {
          keys.push(key);
      }

      for (var i = keys.length - 1; i >= 0; i--) {
          var value = object[keys[i]];
          newObject[keys[i]]= value;
      }       

      return newObject;
    } 
  },
  created(){
      
      firebase.auth().onAuthStateChanged(user => {
        console.log('verificou')
        if(user) {
          console.log('tem algum usuario')
          var userId = firebase.auth().currentUser.uid;
          this.getProfile(userId)
        } else {
          console.log('não tem usuario')
          this.$router.push({path: '/'})
        }
      });

      firebase.database().ref('pagamentos').once('value').then( (snapshot) => {
        console.log(snapshot.val())
        var jsonResponse = snapshot.toJSON()
        console.log(jsonResponse)
        this.paid = this.reverseObject(jsonResponse)
      });
  }
}
</script>

<style>
.paidPeople {
  overflow: auto;
  max-height: 90
}
.coffeeNavBar {
  position:fixed;
  top:0; 
  width:100%;
  z-index:99;
}
</style>
