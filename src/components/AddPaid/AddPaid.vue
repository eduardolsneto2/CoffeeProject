<template>
    <div>
        <nav class="navbar navbar-dark bg-dark">
    <!-- Navbar content -->
        <div class="">
            <button class="btn" v-on:click="Logout()">
            <img class="img-fluid image-checked"  src="../../assets/logout.png" alt="" width="30px" height="30px">
            </button>
        </div>
        <div class="">
            <button class="btn" v-on:click="GoToPaid()">
            <img class="img-fluid image-checked"  src="../../assets/hand.png" alt="" width="30px" height="30px">
            </button>
        </div>
        </nav>
        <div class="form">
          <b-form @submit="onSubmit" @reset="onReset">
              <b-form-group id="exampleInputGroup3"
                    label=" Usuário:"
                    label-for="exampleInput3">
                <b-form-select id="exampleInput3"
                      :options="users"
                      required
                      v-model="form.user">
                </b-form-select>
              </b-form-group>
              <b-form-group id= "exampleInputGroup4"
                            label="Mês:"
                            label-for="exampleInput4">
                <b-form-select id="exampleInput4"
                      :options="months"
                      required
                      v-model="form.month">
                </b-form-select>
              </b-form-group>
              <b-button class="formButton" type="submit" variant="primary">Submit</b-button>
              <b-button class="formButton" type="reset" variant="danger">Reset</b-button>
          </b-form>
        </div>
    </div>
</template>

<script>
export default {

  data() {
    return {
      form: {
        user: '',
        month: ''
      },
      users:[],
      months: [{text: 'Janeiro', value: '01'},
              {text: 'Fevereiro', value: '02'},
              {text: 'Março', value: '03'},
              {text: 'Abril', value: '04'},
              {text: 'Maio', value: '05'},
              {text: 'Junho', value: '06'},
              {text: 'Julho', value: '07'},
              {text: 'Agosto', value: '08'},
              {text: 'Setembro', value: '09'},
              {text: 'Outubro', value: '10'},
              {text: 'Novembro', value: '11'},
              {text: 'Dezembro', value: '12'}],
      show: true
      }
    },

  methods: {
    onSubmit (evt) {
      evt.preventDefault();
      firebase.database().ref('pagamentos').child(this.form.month).update(this.form.user);
      this.form.user = '';
      this.form.month = '';
      /* Trick to reset/clear native browser form validation state */
      this.show = false;
      this.$nextTick(() => { this.show = true });
    },
    onReset (evt) {
      evt.preventDefault();
      /* Reset our form values */
      this.form.user = '';
      this.form.month = '';
      /* Trick to reset/clear native browser form validation state */
      this.show = false;
      this.$nextTick(() => { this.show = true });
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

      firebase.database().ref('pagamentos').on('value', (snapshot) => {
        console.log(snapshot.val())
        this.paid = snapshot.val()
      });
      firebase.database().ref('users').once('value').then( (snapshot) => {
        console.log(snapshot.val())
        snapshot.forEach((childSnapShot) => {
          console.log('aqui vai valor: ' + childSnapShot.child('name').val() + ' e chave: ' + childSnapShot.key)
          var chave = childSnapShot.key
          console.log(chave)
          var value = childSnapShot.child('name').val()
          var obj = {};
          obj[chave] = value;
          this.users.push({ value: obj, text: value })
        });
      });
  }
}
</script>

<style>

.formButton {
  margin-right: 5px;
}
.form {
  margin: 5px 5px 5px 5px;
}
</style>
