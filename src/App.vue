<template>
  Hello
  <todo-item />
</template>

<script lang="ts">
import { Component, defineComponent } from 'vue';

const TodoItem: Component = {
  name: 'todo-item',
  template: `<p>This is a todo item</p>`,
}

export default defineComponent({
  name: 'App',
  components: {
    TodoItem,
  }
});
</script>