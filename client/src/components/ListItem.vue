<template>
  <li class="list-group-item container d-flex">
    <div class="vote">
      {{ getVote }}<br>
      <small>votes</small>
    </div>
    <div class="answer">
      {{ question.answers.length }}<br>
      <small>answers</small>
    </div>
    <div class="question">
      <router-link :to="{ path: `/question/${question._id}` }">
        <strong>{{ question.title }}</strong>
      </router-link>
      <br>
      <small>asked on {{ getCreated }} </small>
    </div>
  </li>
</template>

<script>
import moment from 'moment'

export default {
  name: 'ListItem',
  props: ['question'],
  methods: {
  },
  computed: {
    getVote () {
      let upvote = this.question.upvote.length
      let downvote = this.question.downvote.length
      return upvote - downvote
    },
    getCreated () {
      return moment(this.question.createdAt).format('DD MMM [at] HH:mm')
    }
  }
}
</script>

<style lang="scss">
.list-group-item {
  padding: 10px 0;
}
.vote, .answer {
  padding: 10px 0px;
  width: 60px;
}
.question {
  padding: 10px 20px;
  width: 70%;
  text-align: justify;
}
</style>
