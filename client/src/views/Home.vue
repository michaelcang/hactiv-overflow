<template>
  <div class="home">
    <Nav></Nav>
    <text-box-modal v-if="isLoggedIn"></text-box-modal>
    <div class="card question-list">
      <div class="card-header">
        <h4>Question List</h4>
      </div>
      <div class="card-body">
        <ul class="list-group list-group-flush">
          <list-item v-for="(question, index) in questions" :key="index"
          :question="question"></list-item>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Nav from '@/components/Nav.vue'
import TextBoxModal from '@/components/TextBoxModal.vue'
import ListItem from '@/components/ListItem.vue'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'home',
  components: {
    Nav,
    ListItem,
    TextBoxModal
  },
  methods: {
    ...mapActions([
      'getQuestions',
      'statusLoggedIn'
    ])
  },
  computed: {
    ...mapState({
      questions: 'questions',
      isLoggedIn: 'isLoggedIn'
    })
  },
  created () {
    this.getQuestions()
    if (localStorage.getItem('token')) {
      this.statusLoggedIn()
    }
  }
}
</script>

<style lang="scss">
.card-header {
  padding-top: 10px;
  padding-bottom: 5px;
}
.card-body {
  padding: 0;
}
.question-list {
  width: 70%;
  margin: auto;
  margin-top: 25px;
}
</style>
