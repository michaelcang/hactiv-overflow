<template>
  <li class="list-group-item container d-flex">
    <div class="vote-count d-flex flex-column justify-content-start">
      <i @click="voteChange(true)" class="fas fa-caret-up fa-3x caret"></i>
      <span>{{ getVote }}</span>
      <i @click="voteChange(true)" class="fas fa-caret-down fa-3x caret"></i>
    </div>
    <div class="body">
      <vue-editor v-html="item.body"></vue-editor>
      <small v-if="!item.title">answered by <strong>{{ item.author }}</strong> on {{ getCreated }}</small>
    </div>
    <button v-if="!item.title" @click="deleteAnswer(item._id)" type="button" class="close">
      <span>&times;</span>
    </button>
  </li>
</template>

<script>
import { mapActions } from 'vuex'
import moment from 'moment'
import { VueEditor } from 'vue2-editor'

export default {
  name: 'ListItem',
  props: ['item'],
  components: {
    VueEditor
  },
  methods: {
    ...mapActions([
      'deleteAnswer',
      'voteChange'
    ]),
    voteChange (isUp) {
      let payload = {
        id: this.item.id,
        isUp
      }
      if (!this.item.title) {
        payload.item = 'answer'
      } else {
        payload.item = 'question'
      }
    }
  },
  computed: {
    getVote () {
      let upvote = this.item.upvote
      let downvote = this.item.downvote
      return upvote - downvote
    },
    getCreated () {
      return moment(this.item.createdAt).format('DD MMM [at] HH:mm')
    }
  }
}
</script>

<style lang="scss">
.body {
  width: 83%;
}
.close {
  margin: auto
}
.caret {
  color: #005b96;
}
.vote-count {
  text-align: center;
  margin: 0 20px;
  margin-right: 30px;
}
.list-group-item {
  padding: 10px 0;;
}
</style>
