<template>
  <div class="content"> 
    <form class="form-signin">
        <div class="row">
            <div class="col-4"></div>
            <img class="coffee-image"  src="../../assets/coffee-cup.png" alt="" width="72" height="72">
        </div>
        <h1 class="h3 mb-3 font-weight-normal">Por favor, faça login</h1>
        <label for="inputEmail" class="sr-only">Email address</label>
        <input type="email" id="inputEmail" v-model="email" class="form-control" placeholder="Email address" required autofocus>
        <label for="inputPassword" class="sr-only">Password</label>
        <input type="password" id="inputPassword" class="form-control" v-model="password" placeholder="Password" required>
        <button class="btn btn-lg btn-primary btn-block" v-on:click="login()" type="submit">Sign in</button>
        <button class="btn btn-lg btn-secondary btn-block" v-on:click="goToSignUp()" type="submit">Sign Up</button>
        <p class="mt-5 mb-3 text-muted">&copy; 2019 </p>
    </form>

  </div>
</template>

<script>
export default {

  data() {
    return {
      email: "",
      password: "",
      teste: ""
      }
    },

  methods: {

    login: function() {
      console.log('a senha é')
      console.log(this.password)
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).catch(function(error) {
        // Handle Errors here.
        console.log(error)
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
});
    },
    goToSignUp: function() {
      this.$router.push({path: '/Cadastro'})
    }
  },
  created(){
    firebase.auth().onAuthStateChanged(user => {
      console.log('verificou')
      if(user) {
        console.log('tem algum usuario')
      this.$router.push({path: '/Presenca'})
      }
    });
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
