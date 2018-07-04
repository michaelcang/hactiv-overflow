<template>
  <div class="question-page">
    <Nav></Nav>
    <div class="card question-list">
      <div class="card-header d-flex justify-content-between">
        <div>
          <h4>{{ questions.title }}</h4>
          <small>asked by <strong>{{questions.author}}</strong> on {{getCreated}}</small>
        </div>
        <div class="question-btn">
          <text-box-modal v-if="questions.email === email"
          :id="questions._id"></text-box-modal>
        </div>
      </div>
      <div class="card-body">
        <ul class="list-group list-group-flush">

          <question-item :item="questions"></question-item>

          <li class="list-group-item answer-text">
            <h6><strong>Answers ({{totalAnswers}})</strong></h6>
          </li>

          <question-item v-for="(answer, index) in questions.answers"
          :key="index" :item="answer"></question-item>

          <li v-if="questions.email !== email && isLoggedIn" class="list-group-item text-box">
            <h5>Your answer...</h5>
            <vue-editor v-model="answerBody" :editorToolbar="customToolbar" placeholder="Write your answer..."></vue-editor><br>
            <button @click="postAnswer" type="button" class="btn btn-outline-primary">Submit your answer</button>
          </li>

        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Nav from '@/components/Nav.vue'
import QuestionItem from '@/components/QuestionItem.vue'
import TextBoxModal from '@/components/TextBoxModal.vue'
import { mapActions, mapState } from 'vuex'
import { VueEditor } from 'vue2-editor'
import moment from 'moment'

export default {
  name: 'Question',
  components: {
    Nav,
    QuestionItem,
    VueEditor,
    TextBoxModal
  },
  data () {
    return {
      answerBody: '',
      customToolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'color': [] }, { 'background': [] }]
      ]
    }
  },
  methods: {
    ...mapActions([
      'getOneQuestion',
      'addAnswer'
    ]),
    postAnswer () {
      let payload = {
        question: this.questions._id,
        body: this.answerBody
      }
      this.answerBody = ''
      this.addAnswer(payload)
    }
  },
  computed: {
    ...mapState({
      isLoggedIn: 'isLoggedIn',
      questions: 'questions',
      email: 'email'
    }),
    getCreated () {
      return moment(this.questions.createdAt).format('DD MMM [at] HH:mm')
    },
    totalAnswers () {
      let total = this.questions.answers.length
      return total
    }
  },
  created () {
    this.getOneQuestion(this.$route.params.questionId)
    if (localStorage.getItem('token')) {
      this.statusLoggedIn()
    }
  }
}
</script>

<style lang="scss">
.text-box {
  padding: 20px 30px;
  textarea {
    width: 100%
  }
}
.question-page {
  text-align: justify;
  margin-bottom: 30px;
}
.answer-text {
  padding: 15px 20px;
  padding-bottom: 10px;
  width: 200px;
}
.quillWrapper {
  margin-top: 20px;
}
.question-btn {
  .btn {
    margin-top: 5px;
    margin-left: 20px;
    margin-right: -5px;
  }
}
</style>
