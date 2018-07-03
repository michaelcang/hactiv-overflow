import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import swal from 'sweetalert'
import router from './router'
import './firebase.js'
import firebase from 'firebase'

let provider = new firebase.auth.FacebookAuthProvider()

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    questions: '',
    user: '',
    email: '',
    isLoggedIn: false
  },
  mutations: {
    questions (state, payload) {
      state.questions = payload
    },
    user (state, payload) {
      state.user = payload
    },
    isLoggedIn (state, payload) {
      state.isLoggedIn = payload
    },
    email (state, payload) {
      state.email = payload
    }
  },
  actions: {
    getLogin ({ commit }, payload) {
      axios
        .post('http://localhost:3000/login', payload)
        .then(({ data }) => {
          if (data.token) {
            commit('isLoggedIn', true)
            commit('user', data.name)
            commit('email', data.email)
            localStorage.setItem('name', data.name)
            localStorage.setItem('email', data.email)
            localStorage.setItem('token', data.token)
            router.push('/')
            swal({
              title: 'Login successful!',
              icon: 'success'
            })
          } else {
            swal('Error!', 'Wrong Username / Password', 'error')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getRegister ({ commit }, payload) {
      axios
        .post('http://localhost:3000/register', payload)
        .then(({ data }) => {
          if (data.token) {
            commit('isLoggedIn', true)
            commit('user', data.name)
            commit('email', data.email)
            localStorage.setItem('name', data.name)
            localStorage.setItem('email', data.email)
            localStorage.setItem('token', data.token)
            router.push('/')
            if (payload.fb) {
              swal({
                title: 'Login with FB successful!',
                text: 'Your account password is the first 8 character of your FB email',
                icon: 'success'
              })
            } else {
              swal({
                title: 'Register successful!',
                icon: 'success'
              })
            }
          } else {
            swal('Error!', 'Wrong Username / Password', 'error')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    statusLoggedIn ({ commit }) {
      commit('isLoggedIn', true)
      commit('user', localStorage.getItem('name'))
      commit('email', localStorage.getItem('email'))
    },
    getLoginFB (context, payload) {
      firebase.auth().signInWithPopup(provider).then(function (result) {
        let user = result.user
        let payload = {
          name: user.displayName,
          email: user.email,
          password: user.email.slice(0, 8),
          fb: true
        }
        context.dispatch('getRegister', payload)
      }).catch(function (error) {
        let errorMessage = error.message
        swal(JSON.stringify(errorMessage))
      })
    },
    logout ({ commit }, payload) {
      localStorage.removeItem('token')
      localStorage.removeItem('name')
      localStorage.removeItem('email')
      commit('isLoggedIn', false)
      commit('user', '')
      commit('email', '')
      router.push('/login')
      swal({
        text: 'You are logged out!',
        icon: 'success'
      })
    },
    getQuestions ({ commit }, payload) {
      let token = localStorage.getItem('token')
      let config = { headers: { token } }
      axios
        .get('http://localhost:3000/question', config)
        .then(({ data }) => {
          commit('questions', data.questions)
        })
        .catch(err => {
          swal({
            title: 'Error!',
            text: JSON.stringify(err)
          })
        })
    },
    getOneQuestion ({ commit }, payload) {
      let token = localStorage.getItem('token')
      let config = { headers: { token } }
      axios
        .get(`http://localhost:3000/question/${payload}`, config)
        .then(({ data }) => {
          commit('questions', data.question)
        })
        .catch(err => {
          swal({
            title: 'Error!',
            text: JSON.stringify(err)
          })
        })
    },
    addQuestion (context, payload) {
      payload.author = context.state.user
      payload.email = context.state.email
      let token = localStorage.getItem('token')
      let config = { headers: { token } }
      axios
        .post('http://localhost:3000/question', payload, config)
        .then(({ data }) => {
          if (data.body) {
            swal({
              title: 'Warning!',
              text: JSON.stringify(data),
              icon: 'error'
            })
          } else {
            router.push(`/question/${data.newQuestion._id}`)
            swal({
              title: 'Successfully add new question',
              icon: 'success'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    updateQuestion: function (context, payload) {
      let token = localStorage.getItem('token')
      let config = { headers: { token } }
      axios
        .put(`http://localhost:3000/question/${payload.id}`, payload, config)
        .then(({ data }) => {
          context.dispatch('getOneQuestion', payload.id)
          swal({
            title: 'Successfully update your question',
            icon: 'success'
          })
        })
        .catch(err => {
          console.log(err)
          swal({
            title: 'Warning!',
            text: JSON.stringify(err),
            icon: 'error'
          })
        })
    },
    deleteQuestion: function (context, payload) {
      let token = localStorage.getItem('token')
      let config = { headers: { token } }
      swal({
        title: 'Are you sure?',
        text: 'Once deleted, you will not be able to recover this question!',
        icon: 'warning',
        buttons: true,
        dangerMode: true
      })
        .then((willDelete) => {
          if (willDelete) {
            axios
              .delete(`http://localhost:3000/question/${payload}`, config)
              .then(({ data }) => {
                if (data.body) {
                  swal({
                    title: 'Warning!',
                    text: JSON.stringify(data),
                    icon: 'error'
                  })
                } else {
                  swal({
                    text: 'Successfully delete question!',
                    icon: 'success'
                  })
                  router.push('/')
                }
              })
              .catch(err => {
                console.log(err)
              })
          }
        })
    },
    addAnswer ({ state, dispatch }, payload) {
      payload.author = state.user
      payload.email = state.email
      let token = localStorage.getItem('token')
      let config = { headers: { token } }
      axios
        .post(`http://localhost:3000/answer/${payload.question}`, payload, config)
        .then(({ data }) => {
          if (data.body) {
            swal({
              title: 'Warning!',
              text: JSON.stringify(data),
              icon: 'error'
            })
          } else {
            dispatch('getOneQuestion', payload.question)
            swal({
              title: 'Successfully post your answer',
              icon: 'success'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    deleteAnswer: function (context, payload) {
      let token = localStorage.getItem('token')
      let config = { headers: { token } }
      swal({
        title: 'Are you sure?',
        text: 'Once deleted, you will not be able to recover this answer!',
        icon: 'warning',
        buttons: true,
        dangerMode: true
      })
        .then((willDelete) => {
          if (willDelete) {
            axios
              .delete(`http://localhost:3000/answer/${payload}`, config)
              .then(({ data }) => {
                if (data.body) {
                  swal({
                    title: 'Warning!',
                    text: JSON.stringify(data),
                    icon: 'error'
                  })
                } else {
                  context.dispatch('getOneQuestion', data.question._id)
                }
              })
              .catch(err => {
                console.log(err)
              })
          }
        })
    },
    updateAnswer: function (context, payload) {
      let token = localStorage.getItem('token')
      let config = { headers: { token } }
      axios
        .put(`http://localhost:3000/answer/${payload.id}`, payload, config)
        .then(({ data }) => {
          context.dispatch('getOneQuestion', payload.id)
        })
        .catch(err => {
          console.log(err)
          swal({
            title: 'Warning!',
            text: JSON.stringify(err),
            icon: 'error'
          })
        })
    },
    voteUpdate (context, payload) {
      let token = localStorage.getItem('token')
      let config = { headers: { token } }
      axios
        .put(`http://localhost:3000/${payload.item}/${payload._id}`, payload, config)
        .then(({ data }) => {
          // if (payload.item === 'answer') {
          //   context.dispatch('getOneQuestion', data.answer.question)
          // } else {
          //   context.dispatch('getOneQuestion', data.question._id)
          // }
        })
        .catch(err => {
          console.log(err)
          swal({
            title: 'Warning!',
            text: JSON.stringify(err),
            icon: 'error'
          })
        })
    }
  }
})
