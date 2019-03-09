
<template>
  <div class="fullScreen">
    <nav class="navbar navbar-dark bg-dark">
  <!-- Navbar content -->
      <div class="">
        <button class="btn" v-on:click="Logout()">
          <img class="img-fluid image-checked"  src="../../assets/logout.png" alt="" width="30px" height="30px">
        </button>
      </div>
      <!-- <div class="">
        <button class="btn" v-on:click="GoToShareFood()">
          <img class="img-fluid image-checked"  src="../../assets/cake.png" alt="" width="30px" height="30px">
        </button>
      </div> -->
      <div class="">
        <button class="btn" v-on:click="GoToPaid()">
          <img class="img-fluid image-checked"  src="../../assets/hand.png" alt="" width="30px" height="30px">
        </button>
      </div>
    </nav>
    <div class="row coffeeDiv">
      <div class=" col-1"></div>
      <div class="col-10"> 
        <div class="alert-info isCoffeeReady border-primary rounded" v-if="isCoffeeReady == 'O café está pronto'"><h4>{{isCoffeeReady}}</h4></div>
        <div class="alert-danger isCoffeeReady border-primary rounded" v-else><h4>{{isCoffeeReady}}</h4></div>
      </div>
      <div class="col-1"></div>
    </div>
    <div class="presenceContent row">
      <!-- <div class="col-12">
        <span>Até agora {{confirmedGOCount}} Pessoas irão</span>
      </div> -->
      <div style="list-style-type: none;" class=" col-12">
        <div class=" alert-success confirmedName row" v-for=" (value,index) in confirmedGOUsers ">
          <div class=" col-2" style="position: relative;">
            <img class="img-fluid image-checked inner"  src="../../assets/checked.png" alt="" width="30px" height="30px">
          </div>
          <div class="col-8" style="position: relative;">
            <div class="inner">
              {{value.name}}
            </div>
          </div>
          <div class="col-2" style="position: relative;">
            <div class="float-right inner">
              {{value.time}}
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="col-12">
        <h4>E {{confirmedNotGOCount}} Pessoas não irão</h4>
      </div> -->
    </div>
    <b-modal ref="myModalRef" hide-footer title="Error">
        <div class="d-block text-center">
          <h4>{{errorMSG}}</h4>
        </div>
        <b-btn class="mt-3" variant="outline-danger" block @click="hideModal">Close Me</b-btn>
    </b-modal>
    <div v-if="profile == 'support'">
      <div v-if="isCoffeeReady == 'O café não está pronto'">
        <button class="btn addCoffee rounded-circle btn-dark" v-on:click="AddCoffee()">
        <img class="img-fluid" src="../../assets/coffee-cup.png" alt="" width="35px" height="35px">
        </button>
      </div>
      <div v-else>
        <button class="btn addCoffee rounded-circle btn-light" v-on:click="RemoveCoffee()">
        <img class="img-fluid" src="../../assets/cross.png" alt="" width="35px" height="35px">
        </button>
      </div>
    </div>
    <button class="btn btn-lg prensenceBttn1 btn-success btn-block" v-on:click="Presence()">Vou!</button>
    <button class="btn btn-lg prensenceBttn2 btn-danger btn-block" v-on:click="NoPresence()">Não Vou</button>
  </div>    
</template>

<script>
export default {

  data() {
    return {
      email: "",
      password: "",
      teste: "",
      isCoffeeReady: "",
      confirmedGOUsers: [],
      confirmedGOCount: 0,
      confirmedNotGOCount: 0,
      profile: '',
      errorMSG: '',
      connected: false
      }
    },

  methods: {
    showModal: function() {
      this.$refs.myModalRef.show()
    },
    hideModal: function() {
      this.$refs.myModalRef.hide()
    },
    AddCoffee: function() {
      firebase.database().ref('TextCoffee').set('O café está pronto')
    },
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
    GoToPaid: function() {
      this.$router.push({path: '/Pago'})
    },
    GoToShareFood: function() {
      this.$router.push({path: '/compartilhar'})
    },
    Presence: function() {
      var userId = firebase.auth().currentUser.uid;
      var hour = new Date().getHours()
      var minutes = new Date().getMinutes()
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      if (this.connected) {
        firebase.database().ref('users/' + userId).once('value', (snapshot) => {
        console.log(snapshot.val())
        firebase.database().ref('confirmed/' + userId).set(
          {
            'name': snapshot.val().name,
            'time': (hour + ':' + minutes)
          }
        ).catch((error) => {
          console.log(error)
        })
        firebase.database().ref('notGoing/' + userId).remove()
        }, (error) => {
          console.log('deu problema')
        });
      } else {
        this.errorMSG = 'Ocorreu algum problema de conexão com o database'
        this.showModal()
      }
      
    },
    NoPresence: function() {
      var userId = firebase.auth().currentUser.uid;

      firebase.database().ref('users/' + userId).once('value').then ((snapshot) => {
        console.log(snapshot.val())
        firebase.database().ref('confirmed/' + userId).remove()
      });
    },
    RemoveCoffee: function() {
      firebase.database().ref('TextCoffee').set('O café não está pronto')
    }
    
  },
  created(){
      var connectedRef = firebase.database().ref(".info/connected");
      connectedRef.on("value", (snap) => {
        if (snap.val() === true) {
          this.connected = true
        } else {
          this.connected = false
        }
      });
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

      firebase.database().ref('confirmed').orderByChild('/name').on('value', (snapshot) => {
        console.log(snapshot.val())
        this.confirmedGOUsers = []
        snapshot.forEach((child) => {
            console.log(child.val()) // NOW THE CHILDREN PRINT IN ORDER
            this.confirmedGOUsers.push(child.val())
        });
        
      });
      firebase.database().ref('TextCoffee').on('value', (snapshot) => {
        
        this.isCoffeeReady = snapshot.val()
      });

      var hour = new Date().getHours()
      var day = new Date().getDay()
      firebase.database().ref('lastUpdated').once('value').then ((snapshot) => {
        var lastUpdatedHour = snapshot.val()
        console.log(snapshot.val())
        if ((lastUpdatedHour > 11) && (hour < 12) ){
          firebase.database().ref('confirmed/').remove()
          firebase.database().ref('notGoing/').remove()
          firebase.database().ref('lastUpdated').set(hour)
          firebase.database().ref('TextCoffee').set('O café não está pronto')
          console.log('de manha e valor no servidor de tarde')
        } else if (( lastUpdatedHour < 12) && (hour > 11)) {
          firebase.database().ref('confirmed/').remove()
          firebase.database().ref('notGoing/').remove()
          firebase.database().ref('lastUpdated').set(hour)
          firebase.database().ref('TextCoffee').set('O café não está pronto')
          console.log('de tarde e valor no servidor de manha')
        }
      });
      
      
  },
}
</script>

<style>

.presenceContent{
    display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  padding-top: 5px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
  margin-left: 0%;
  margin-right: 0%;
  overflow: auto;
  max-height: 80%;
}
.fullScreen {
  height: 100%;
  width: 100%;
  align-items: center;
}
.prensenceBttn2{
  position: fixed;
  bottom: 1%;
  width: 96%;
  height: 50px;
  margin-left: 2%;
}
.prensenceBttn1{
  position: fixed;
  bottom: 65px;
  width: 96%;
  align-self: center;
  height: 50px;
  margin-left: 2%;
}
.addCoffee {
  position: fixed;
  bottom: 120px;
  height: 80px;
  width: 80px;
  right: 2%;
}
.confirmedName {
  margin-bottom: 5px;
  align-content: center;
  position: relative;
  height: 40px;
  
}
.confirmedList {
  align-content: center;
}
.inner {
  position: absolute;
  top: 50%;
  transform: translate(0,-50%);
}
.image-checked {
  padding: 5px 5px 5px 5px;
}
.logoutButton {
  position: fixed;
  top: 2%;
  left: 2%;
  margin-left: 2%;
}
.isCoffeeReady {
  margin-top: 5%;
  text-align: center;
  padding: 5px 5px 5px 5px;
}
.coffeeDiv {
  margin: 0;
}
</style>
