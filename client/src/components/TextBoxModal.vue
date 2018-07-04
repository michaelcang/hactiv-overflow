<template>
  <div>
    <button @click="clearInput" v-if="!id" type="button" class="btn btn-outline-success" data-toggle="modal" data-target="#textBoxModal">
      Post new question
    </button>
    <button @click="clearInput" v-if="id" type="button" class="btn btn-outline-info" data-toggle="modal" data-target="#textBoxModal">
      Edit
    </button>
    <button @click="deleteQuestion(id)" v-if="id" type="button" class="btn btn-outline-danger">Delete</button>

    <div class="modal fade" id="textBoxModal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 v-if="!id" class="modal-title">New Question</h5>
            <h5 v-if="id" class="modal-title">Edit Question</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <input v-model="questionTitle" type="email" class="form-control" placeholder="Question Title">
            </div>
            <div class="form-group">
              <vue-editor v-model="questionBody" :editorToolbar="customToolbar"></vue-editor>
            </div>
          </div>
          <div class="modal-footer">
            <button v-if="!id" @click="postQuestion" type="button" :disabled="!questionTitle || !questionBody" class="btn btn-primary" data-dismiss="modal">Post Question</button>
            <button v-if="id" @click="editQuestion" type="button" :disabled="!questionTitle && !questionBody" class="btn btn-primary" data-dismiss="modal">Update Question</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { VueEditor } from 'vue2-editor'

export default {
  name: 'TextBoxModal',
  components: {
    VueEditor
  },
  props: {
    id: {
      default: ''
    },
    isAnswer: {
      default: ''
    }
  },
  data () {
    return {
      questionTitle: '',
      questionBody: '',
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
      'addQuestion',
      'updateQuestion',
      'deleteQuestion'
    ]),
    postQuestion () {
      let payload = {
        title: this.questionTitle,
        body: this.questionBody
      }
      this.clearInput()
      this.addQuestion(payload)
    },
    editQuestion () {
      let payload = {
        title: this.questionTitle,
        body: this.questionBody,
        id: this.id
      }
      this.clearInput()
      this.updateQuestion(payload)
    },
    clearInput () {
      this.questionTitle = ''
      this.questionBody = ''
    }
  }
}
</script>

<style lang="scss">
.modal-body {
  height: 500px;
  .quillWrapper {
    height: 320px;
  }
}
</style>
