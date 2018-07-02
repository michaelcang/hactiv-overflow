import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import swal from 'sweetalert'
import router from './router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    questions: '',
    user: 'guest'
  },
  mutations: {
    questions (state, payload) {
      state.questions = payload
    },
    user (state, payload) {
      state.user = payload
    }
  },
  actions: {
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
      let token = localStorage.getItem('token')
      let config = { headers: { token } }
      console.log(payload);
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
            router.push(`question/${payload.question}`)
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
    addAnswer ({ state, dispatch }, payload) {
      payload.author = state.user
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
                  swal({
                    title: 'Successfully delete your answer',
                    icon: 'success'
                  })
                }
              })
              .catch(err => {
                console.log(err)
              })
          } else {
            swal('Your answer is not deleted')
          }
        })
    },
    upvote (context, payload) {
      let token = localStorage.getItem('token')
      let config = { headers: { token } }
      axios
        .put(`http://localhost:3000/answer/${payload.id}`, payload, config)
        .then(({ data }) => {
          context.dispatch('getOneArticle', payload.id)
          swal({
            title: 'Successfully update your article',
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
    }
  }
})
