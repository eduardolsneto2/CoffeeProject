
<template>
  <div class="fullScreen">
    <nav class="navbar navbar-dark bg-dark">
  <!-- Navbar content -->
      <div class="">
        <button class="btn" v-on:click="Logout()">
          <img class="img-fluid image-checked"  src="../../assets/logout.png" alt="" width="30px" height="30px">
        </button>
      </div>
    </nav>
    
    <div class="presenceContent row">
      <!-- <div class="col-12">
        <span>Até agora {{confirmedGOCount}} Pessoas irão</span>
      </div> -->
      <div style="list-style-type: none;" class=" col-12">
        <div class=" alert-success confirmedName row" v-for=" (value, key, index) in confirmedGOUsers ">
          <div class=" col-2">
            <img class="img-fluid image-checked"  src="../../assets/checked.png" alt="">
          </div>
          <div class="col-8" style="position: relative;">
            <div class="inner">
              {{value}}
            </div>
          </div>
          <div class="col-2" style="position: relative;">
            <div class="float-right inner">
              {{index + 1}}
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="col-12">
        <h4>E {{confirmedNotGOCount}} Pessoas não irão</h4>
      </div> -->
      <div style="list-style-type: none;" class=" col-12">
        <div class="alert-danger confirmedName row" v-for=" (value, key, index) in confirmedNotGOUsers ">
          
          <div class=" col-2">
            <img class="img-fluid image-checked"  src="../../assets/cross.png" alt="">
          </div>
          <div class="col-8" style="position: relative;">
            <div class="inner">
              {{value}}
            </div>
          </div>
          <div class="col-2" style="position: relative;">
            
            <div class="float-right inner">
              {{index + 1}}
            </div>
          </div>
        </div>
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
      confirmedGOUsers: {},
      confirmedNotGOUsers: {},
      confirmedGOCount: 0,
      confirmedNotGOCount: 0
      }
    },

  methods: {

    Logout: function() {
      firebase.auth().signOut()
      .then(function() {
      // Sign-out successful.
      })
      .catch(function(error) {
      // An error happened
      });
    },
    UpdateConfirmed: function(value) {
      this.confirmedGOUsers.push(value)
    },
    Presence: function() {
      var userId = firebase.auth().currentUser.uid;

      firebase.database().ref('users/' + userId).once('value').then ((snapshot) => {
        console.log(snapshot.val())
        firebase.database().ref('confirmed/' + userId).set(snapshot.val().name)
        firebase.database().ref('notGoing/' + userId).remove()
      });
    },
    NoPresence: function() {
      var userId = firebase.auth().currentUser.uid;

      firebase.database().ref('users/' + userId).once('value').then ((snapshot) => {
        console.log(snapshot.val())
        firebase.database().ref('notGoing/' + userId).set(snapshot.val().name)
        firebase.database().ref('confirmed/' + userId).remove()
      });
    }
    
  },
  created(){
      
      firebase.auth().onAuthStateChanged(user => {
        console.log('verificou')
        if(user) {
          console.log('tem algum usuario')
        
        } else {
          console.log('não tem usuario')
          this.$router.push({path: '/'})
        }
      });

      firebase.database().ref('confirmed').on('value', (snapshot) => {
        console.log(snapshot.val())
        this.confirmedGOUsers = snapshot.val()
        this.confirmedGOCount = Object.keys(this.confirmedGOUsers).length
        this.confirmedNotGOCount = Object.keys(this.confirmedNotGOUsers).length
        
      });
      firebase.database().ref('notGoing').on('value', (snapshot) => {
        this.confirmedNotGOUsers = snapshot.val()
        this.confirmedNotGOCount = Object.keys(this.confirmedNotGOUsers).length
        this.confirmedGOCount = Object.keys(this.confirmedGOUsers).length
      });
      var hour = new Date().getHours()
      firebase.database().ref('lastUpdated').once('value').then ((snapshot) => {
        var lastUpdatedHour = snapshot.val()
        console.log(snapshot.val())
        if ((lastUpdatedHour > 11) && (hour < 12) ){
          firebase.database().ref('confirmed/').remove()
          firebase.database().ref('notGoing/').remove()
          firebase.database().ref('lastUpdated').set(hour)
          this.confirmedGOCount = 0
          this.confirmedNotGOCount = 0
          console.log('de manha e valor no servidor de tarde')
        } else if (( lastUpdatedHour < 12) && (hour > 11)) {
          firebase.database().ref('confirmed/').remove()
          firebase.database().ref('notGoing/').remove()
          firebase.database().ref('lastUpdated').set(hour)
          console.log('de tarde e valor no servidor de manha')
          this.confirmedGOCount = 0
          this.confirmedNotGOCount = 0
        }
      })
  }
}
</script>

<style>

.presenceContent{
    display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
  margin-left: 0%;
  margin-right: 0%;
  overflow: auto;
  height: 80%;
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
</style>
