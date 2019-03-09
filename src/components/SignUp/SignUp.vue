<template>
  <div class="content"> 
    <form class="form-signin">
        <div class="row">
            <div class="col-4"></div>
            <img class="coffee-image"  src="../../assets/coffee-cup.png" alt="" width="72" height="72">
        </div>
        <h1 class="h3 mb-3 font-weight-normal">Digite seus dados</h1>
        <input type="" id="inputName" class="form-control" v-model="name" placeholder="Nome" required>
        <input type="email" id="inputEmail" v-model="email" class="form-control" placeholder="Email" required autofocus>
        <input type="password" id="inputPassword" v-model="password" class="form-control" placeholder="Senha" required>
        
        <button class="btn btn-lg btn-primary btn-block" v-on:click="Cadastrar()">Cadastrar</button>
        <p class="mt-5 mb-3 text-muted">&copy; 2017-2018</p>
    </form>
  <b-modal ref="myModalRef" hide-footer title="Error">
        <div class="d-block text-center">
          <h4>{{errorMSG}}</h4>
        </div>
        <b-btn class="mt-3" variant="outline-danger" block @click="hideModal">Close Me</b-btn>
    </b-modal>
  </div>
</template>

<script>
export default {

  data() {
    return {
      email: "",
      password: "",
      errorMSG: "",
      name: ""
      }
    },

  methods: {
    showModal: function() {
      this.$refs.myModalRef.show()
    },
    hideModal: function() {
      this.$refs.myModalRef.hide()
    },
    Cadastrar: function() {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).catch( (error) => {
        // Handle Errors here.
        console.log(error)
        this.errorMSG = error.message
        this.showModal()
        // ...
      }).then((data) => {
          let uid = data.user.uid;
          firebase.database().ref(`/users/${uid}`).set({
            name: this.name
          }).then(() => {
            this.$router.push({
              path: "/Presenca"
            });
          })
        });
    },
    
  },
  created(){
    //var userId = firebase.auth().currentUser.uid;
    
  }
}
</script>

<style>
html,
body {
  height: 100%;
}

.coffee-image{
    padding-bottom: 10px;
}
body {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}
.content{
    height: 100%;
    display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}

.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
