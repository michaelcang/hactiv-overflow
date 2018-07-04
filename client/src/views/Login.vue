<template>
  <div id="login-page">
    <Nav></Nav>
    <div v-if="!isRegister" id=login>
    <h3>Login</h3>
    <div class="form-group">
      <label>Email address</label>
      <input v-model="email" type="text" class="form-control" placeholder="Enter email">
      <small class="form-text text-muted">We'll never share your email with anyone else.</small>
    </div>
    <div class="form-group">
      <label>Password</label>
      <input v-model="password" type="password" class="form-control" placeholder="Password">
    </div>
    <button @click="login()" type="submit" class="btn btn-success">Login</button>
    <br>
    <a href="#register" @click="isRegister = !isRegister">Register</a>
    <br>
    <hr>
    <button @click="getLoginFB" type="submit" id="fb-login" class="btn btn-primary">
      Login with Facebook</button>
    </div>

    <div v-if="isRegister" id="register">
      <h3>Register</h3>
      <div class="form-group">
        <label>Email address</label>
        <input v-model="email" type="text" class="form-control" placeholder="Enter email">
        <small class="form-text text-muted">We'll never share your email with anyone else.</small>
      </div>
      <div class="form-group">
        <label>Password</label>
        <input v-model="password" type="password" class="form-control" placeholder="Password">
      </div>
      <div class="form-group">
        <label>Name</label>
        <input v-model="name" type="text" class="form-control" placeholder="Your name">
      </div>
      <button @click="register()" type="submit" class="btn btn-success">Register</button>
      <br>
      <a href="#login" @click="isRegister = !isRegister">Login</a>
    </div>
  </div>
</template>

<script>
import Nav from '@/components/Nav.vue'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'login',
  components: {
    Nav
  },
  data () {
    return {
      isRegister: false,
      email: 'user1@mail.com',
      password: 'user1234',
      name: ''
    }
  },
  computed: {
    ...mapState({
      isLoggedIn: 'isLoggedIn',
      user: 'user'
    })
  },
  methods: {
    ...mapActions([
      'getLogin',
      'getRegister',
      'getLoginFB'
    ]),
    login () {
      let payload = {
        email: this.email,
        password: this.password
      }
      this.getLogin(payload)
    },
    register () {
      let payload = {
        email: this.email,
        password: this.password,
        name: this.name
      }
      this.getRegister(payload)
    },
    clearInput () {
      this.email = ''
      this.password = ''
      this.name = ''
    }
  },
  created () {
    if (localStorage.getItem('token')) {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss">
#login, #register {
  background-color: white;
  text-align: center;
  margin: 70px auto;
  width: 400px;
  border: 2px solid #a8d5ff;
  padding: 20px;
  border-radius: 10px;
  .btn {
    margin-top: 10px;
    margin-bottom: 20px;
  }
}
#fb-login {
  background-color: darkblue;
  border: 0;
  color: white;
  margin-top: 10px;
}
</style>
