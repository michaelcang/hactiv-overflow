<template>
  <div class="card task">
    <div class="card-header">
      <strong>{{task.title}}</strong>
    </div>
    <div class="card-body">
      <p class="card-text"><strong>Points</strong>: {{task.point}}</p>
      <p class="card-text"><strong>Assign To</strong>: {{task.person}}</p>
    </div>
    <div class="card-footer d-flex justify-content-between">
      <button @click="removeTask(task.id)" type="submit" class="btn btn-outline-danger btn-sm">Delete</button>
      <div class="btn-group" role="group">
        <button @click="goLeft" v-if="task.status > 0" type="button" class="btn btn-outline-secondary btn-sm">
          &larr;
        </button>
        <button @click="goRight" v-if="task.status < 3" type="button" class="btn btn-outline-primary btn-sm">
          &rarr;
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Card',
  props: ['task'],
  methods: {
    ...mapActions([
      'changeStatus',
      'removeTask'
    ]),
    goRight () {
      this.changeStatus({
        task: this.task,
        toRight: true
        })
    },
    goLeft () {
      this.changeStatus({
        task: this.task,
        toRight: false
        })
    }
  }
}
</script>

<style>
.task {
  margin-bottom: 10px;
  text-align: left;
  line-height: 0.5em;
}
</style>

