<template>
  <div>
    <button v-if="!id" type="button" class="btn btn-outline-success" data-toggle="modal" data-target="#textBoxModal">
      Post new question
    </button>
    <button v-if="id" type="button" class="btn btn-outline-info" data-toggle="modal" data-target="#newQuestion">
      Edit
    </button>

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
              <vue-editor v-model="questionBody"></vue-editor>
            </div>
          </div>
          <div class="modal-footer">
            <button v-if="!id" @click="addQuestion" type="button" :disabled="!questionTitle || !questionBody" class="btn btn-primary" data-dismiss="modal">Post Question</button>
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
    }
  },
  data () {
    return {
      questionTitle: '',
      questionBody: ''
    }
  },
  methods: {
    ...mapActions([
      'addQuestion',
      'updateQuestion'
    ]),
    postQuestion () {
      let payload = {
        title: this.questionTitle,
        body: this.questionBody
      }
      this.questionTitle = ''
      this.questionBody = ''
      this.addQuestion(payload)
    },
    editQuestion () {
      let payload = {
        title: this.questionTitle,
        body: this.questionBody,
        id: this.id
      }
      this.questionTitle = ''
      this.questionBody = ''
      this.updateQuestion(payload)
    }
  }
}
</script>

<style lang="scss">
.modal-body {
  height: 500px;
}
.quillWrapper {
  height: 320px;
}
</style>
