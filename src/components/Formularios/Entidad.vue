<template>
  <q-form
    class="row q-col-gutter-md"
    @submit.prevent
  >
    <q-input
      filled
      class="col-xs-12 col-md-12"
      label="Nombre"
      v-model="valoresModel.nombre"
      :rules="valoresRules.nombre"
    />
    <q-select
      class="col-xs-12 col-md-4"
      v-model="valoresModel.departamento"
      :options="departamentos"
      label="Departamento"
      filled
      option-label="nombre"
      option-value="nombre"
      @update:model-value="actualizarProvincia"
      :rules="valoresRules.nombre"
    />
    <q-select
      class="col-xs-12 col-md-4"
      v-model="valoresModel.provincia"
      :options="provincias"
      label="Provincia"
      filled
      option-label="nombre"
      option-value="nombre"
      @update:model-value="actualizarMunicipio"
      :rules="valoresRules.nombre"
    />
    <q-select
      class="col-xs-12 col-md-4"
      v-model="valoresModel.municipio"
      :options="municipios"
      option-label="nombre"
      option-value="nombre"
      label="Municipio"
      filled
      :rules="valoresRules.nombre"
    />
    <q-input
      filled
      class="col-xs-12 col-md-12"
      label="Direccion"
      v-model="valoresModel.direccion"
      :rules="valoresRules.nombre"
    />
    <q-input
      filled
      class="col-xs-12 col-md-12"
      label="Horarios de Atención"
      v-model="valoresModel.horario"
      :rules="valoresRules.nombre"
    />
    <div class="col-xs-12 col-md-12">
      <TaskList
        titulo="Servicio"
        v-model:value="valoresModel.servicio"
      />
    </div>
    <q-input
      filled
      class="col-xs-12 col-md-6"
      label="Email"
      v-model="valoresModel.email"
      :rules="valoresRules.email"
    />
    <q-input
      filled
      class="col-xs-12 col-md-6"
      label="Telefono"
      v-model="valoresModel.telefono"
      :rules="valoresRules.nombre"
    />
    <div class="col-xs-12 col-md-12">
      <TaskList
        titulo="Lenguaje Hablado"
        v-model:value="valoresModel.lenguas"
      />
    </div>
    <div class="col-xs-12 text-right">
      <q-btn
        label="Cancelar"
        @click="$emit('cancelar')"
      />
      <q-btn
        label="Guardar"
        @click="$emit('guardar')"
        color="primary"
        class="q-ml-sm"
      />
    </div>
  </q-form>
</template>
<script>

import { useVModel } from '../../composables/useVModel.js'
import { ref, onMounted, inject } from 'vue'
import TaskList from '../common/TaskList'

export default {
  props: {
    valores: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    TaskList
  },
  setup (props) {
    const _http = inject('http')
    const valoresModel = useVModel(props, 'valores')
    const entidades = ref([])
    const departamentos = ref([])
    const provincias = ref([])
    const municipios = ref([])
    const valoresRules = ref({})

    onMounted(async () => {
      valoresModel.value.servicio = valoresModel.value.servicio || []
      valoresModel.value.lenguas = valoresModel.value.lenguas || []
      const { rows } = await _http.get('/system/entidades')
      departamentos.value = await dpa(2)
      provincias.value = await dpa(3)
      municipios.value = await dpa(4)
      entidades.value = rows
    })

    const dpa = async (nivel, idPadre = null) => {
      let url = `/system/dpas?nivel=${nivel}`
      if (idPadre) {
        url += `&idDpa=${idPadre}`
      }
      const { rows } = await _http.get(url)
      return rows
    }

    const actualizarProvincia = async (value) => {
      provincias.value = await dpa(3, value.id)
    }
    const actualizarMunicipio = async (value) => {
      municipios.value = await dpa(4, value.id)
    }
    return {
      valoresModel,
      valoresRules,
      departamentos,
      provincias,
      municipios,
      entidades,
      actualizarProvincia,
      actualizarMunicipio
    }
  }
}
</script>
