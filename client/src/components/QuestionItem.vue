<template>
  <li class="list-group-item container d-flex">
    <div class="vote-count d-flex flex-column justify-content-start">
      <i @click="voteChange(true)"
      :class="{'has-user': hasEmail(item.upvote), 'caret': !hasEmail(item.upvote)}"
      class="fas fa-caret-up fa-3x"></i>
      <span>{{ getVote }}</span>
      <i @click="voteChange(false)"
      :class="{'has-user': hasEmail(item.downvote), 'caret': !hasEmail(item.downvote)}"
      class="fas fa-caret-down fa-3x"></i>
    </div>
    <div class="body">
      <vue-editor v-if="isEdit" v-model="item.body" :editorToolbar="customToolbar"></vue-editor>
      <div v-if="!isEdit" v-html="item.body"></div>
      <small v-if="!item.title">answered by <strong>{{ this.item.author }}</strong> on {{ getCreated }}</small>
    </div>
    <div class="item-button d-flex flex-column justify-content-start">
      <button v-if="!item.title" @click="deleteAnswer(item._id)" type="button" class="close">
        <span>&times;</span>
      </button>
      <button @click="editAnswer(item._id)" v-if="!item.title" type="button" class="close">
        <small v-if="!isEdit">edit</small>
        <small v-if="isEdit">update</small>
      </button>
    </div>
  </li>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import moment from 'moment'
import { VueEditor } from 'vue2-editor'

export default {
  name: 'ListItem',
  props: ['item'],
  components: {
    VueEditor
  },
  data () {
    return {
      isEdit: '',
      editBody: '',
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
      'deleteAnswer',
      'voteUpdate',
      'updateAnswer'
    ]),
    voteChange (isUp) {
      if (this.email !== this.item.email || isLoggedIn) {
        let upIndex = this.item.upvote.indexOf(this.email)
        let downIndex = this.item.downvote.indexOf(this.email)
        if (isUp) {
          if (upIndex < 0 && downIndex < 0) {
            this.item.upvote.push(this.email)
          } else if (upIndex < 0) {
            this.item.downvote.splice(downIndex, 1)
            this.item.upvote.push(this.email)
          } else {
            this.item.upvote.splice(upIndex, 1)
          }
        } else {
          if (upIndex < 0 && downIndex < 0) {
            this.item.downvote.push(this.email)
          } else if (downIndex < 0) {
            this.item.upvote.splice(upIndex, 1)
            this.item.downvote.push(this.email)
          } else {
            this.item.downvote.splice(downIndex, 1)
          }
        }
        let payload = this.item
        if (!this.item.title) {
          payload.item = 'answer'
        } else {
          payload.item = 'question'
        }
        this.voteUpdate(payload)
      }
    },
    editAnswer (id) {
      if (!this.isEdit) {
        this.isEdit = this.item.body
      } else if (this.isEdit === this.item.body) {
        this.isEdit = ''
      } else {
        let payload = {
          id: id,
          body: this.item.body
        }
        this.updateAnswer(payload)
        this.isEdit = ''
      }
    },
    hasEmail (array) {
      if (array.indexOf(this.email) >= 0) {
        return true
      } else {
        return false
      }
    }
  },
  computed: {
    getVote () {
      let upvote = this.item.upvote
      let downvote = this.item.downvote
      return upvote.length - downvote.length
    },
    getCreated () {
      return moment(this.item.createdAt).format('DD MMM [at] HH:mm')
    },
    ...mapState({
      email: 'email',
      isLoggedIn: 'isLoggedIn'
    })
  }
}
</script>

<style lang="scss">
.item-button {
  width: 80px;
  button:focus {
    outline: none;
  }
}
.body {
  width: 83%;
  .quillWrapper {
    min-height: 100px;
    width: 100%;
    margin-bottom: 50px;
  }
}
.close {
  margin: auto
}
.has-user {
  color: #005b96;
}
.caret {
  color: #b3cde0;
}
.caret:hover {
  cursor: pointer;
}
.vote-count {
  text-align: center;
  margin: 0 20px;
  margin-right: 30px;
}
.list-group-item {
  padding: 10px 0;;
}
.close {
  margin: 5px;
  small {
    font-size: 0.7em;
  }
}
</style>
