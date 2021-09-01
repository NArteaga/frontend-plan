<template>
    <section>
      <q-dialog v-model="stepLocal" >

      </q-dialog>
    </section>
</template>
<script>
import { ref } from 'vue'
export default {
  props: {
    step: {
      type: Number,
      default: 0,
      get () { return this.prop },
      set (value) { this.$emit('update:prop', value) }
    }
  },
  setup () {
    const stepLocal = ref(false)
    return {
      stepLocal
    }
  }
}
</script>
