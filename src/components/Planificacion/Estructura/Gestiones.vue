<template>
    <Table
      :url="url"
      v-model:listaGestiones="gestiones"
      @modal="openModal"
      @gestiones="$emit('gestiones')" />
    <Modal
      v-model:value="gestion"
      v-model:open="dialog"
      @guardar="guardar" />
</template>
<script>
import { ref, inject } from 'vue'
import { useVModel } from 'src/composables/useVModel'
import Modal from './Gestion/Modal'
import Table from './Gestion/Table'

export default {
  emits: ['gestiones'],
  components: {
    Modal,
    Table
  },
  props: {
    listaGestiones: {
      type: Array,
      defaultValue: () => []
    },
    url: {
      type: String
    }
  },
  setup (props, { emit }) {
    const dialog = ref(false)
    const gestiones = useVModel(props, 'listaGestiones')
    const gestion = ref({})
    const _http = inject('http')
    // const optionSeguimiento = ref([])

    const guardar = async () => {
      const data = { ...gestion.value }
      let respuesta = null
      if (data.id) {
        delete data.id
        respuesta = await _http.put(`${props.url}/${gestion.value.id}`, data)
      } else {
        respuesta = await _http.post(`${props.url}`, data)
      }
      if (respuesta) {
        dialog.value = false
        emit('gestiones')
      }
    }

    const openModal = (row = null) => {
      gestion.value = {}
      if (row) {
        gestion.value = { ...row }
      }
      dialog.value = true
    }

    /* const getSeguimientos = async () => {
      gestion.value.fechaInicio = null
      gestion.value.fechaFin = null
      if (gestion.value.etapa === 'SEGUIMIENTO') {
        const { rows } = await _http.get(`planificacion/seguimiento?gestion=${gestion.value.gestion}order=-createdAt`)
        optionSeguimiento.value = rows
      }
    } */

    return {
      gestiones,
      gestion,
      dialog,
      openModal,
      // optionSeguimiento,
      guardar
      // getSeguimientos
    }
  }
}
</script>
