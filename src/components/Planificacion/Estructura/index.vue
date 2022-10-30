<template>
  <q-card class="q-ma-md">
    <q-card-section>
      <Estructuras />
    </q-card-section>
  </q-card>
  <q-card class="q-ma-md">
    <Gestiones
      :url="url"
      :listaGestiones="gestiones"
      @gestiones="getGestiones"
    />
  </q-card>
  <q-card class="q-ma-md">
    <q-card-section>
      <Seguimientos v-model:listaGestiones="gestiones" />
    </q-card-section>
  </q-card>
</template>
<script>
import { inject, ref, onMounted } from 'vue'
import Gestiones from './Gestiones'
import Estructuras from './Estructuras'
import Seguimientos from './Seguimientos'
export default {
  components: {
    Gestiones,
    Estructuras,
    Seguimientos
  },
  setup () {
    const _http = inject('http')
    const gestiones = ref([])
    const url = ref('planificacion/gestion')
    onMounted(async () => {
      await getGestiones()
    })
    const getGestiones = async () => {
      const { rows } = await _http.get(`${url.value}?order=gestion`)
      gestiones.value = rows
    }
    return {
      gestiones,
      url,
      getGestiones
    }
  }
}
</script>
