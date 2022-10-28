<template>
  <Plan v-if="entidad" :institucion="entidad" />
</template>
<script>
import { inject, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Plan from '../Planificacion/index'
export default {
  components: {
    Plan
  },
  setup () {
    const route = useRoute()
    const entidad = ref()
    const _http = inject('http')
    onMounted(async () => {
      await getEntidades()
    })
    const getEntidades = async () => {
      entidad.value = await _http.get(`system/entidades/${route?.params?.id}`)
    }
    return {
      entidad
    }
  }
}
</script>
