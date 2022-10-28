<template>
    <q-toolbar class="bg-light-blue-1 q-mb-sm">
    <q-toolbar-title class="text-subtitle2 text-weight-bold">
        {{titulo}}
    </q-toolbar-title>
    {{model?.length}}
    </q-toolbar>
    <div class="row q-col-gutter-xs">
      <q-input
          name ="task"
          v-model="data"
          type="text"
          :placeholder="`Ingrese un nuevo registro`"
          :rules="data?rules.requerido:[]"
          hint="Presiona enter para guardar"
          persistent-hint
          filled
          class="col-xs-12 q-pb-lg"
          @keypress.enter="adicionarTarea()"
      />
      <q-list v-if="model?.length>0" class="col-xs-12" separator bordered>
          <q-item v-for="(tarea,index) in model" :key="index">
              <q-item-section>
              <q-item-label>{{tarea}}</q-item-label>
              </q-item-section>
              <q-item-section side top>
                  <q-btn
                      round
                      dense
                      flat
                      icon="delete"
                      color="negative"
                      @click="eliminarTarea(index)"
                      size="md"
                  >
                      <q-tooltip>Remover {{titulo}}</q-tooltip>
                  </q-btn>
              </q-item-section>
          </q-item>
      </q-list>
      <q-list v-if="model.length===0" class="col-xs-12" separator>
          <q-item>
              <q-item-section>
              <q-item-label class="text-center">No existen {{titulo}} Registradas</q-item-label>
              </q-item-section>
          </q-item>
      </q-list>
    </div>
</template>
<script>
import validaciones from '@common/validations'
import { useVModel } from 'src/composables/useVModel'
import { ref, onMounted } from 'vue'

const rules = {
  requerido: [
    validaciones.requerido
  ],
  ponderacion: [
    validaciones.requerido,
    validaciones.numeros,
    validaciones.ponderacion
  ]
}

export default {
  props: {
    titulo: String,
    value: {
      type: Array,
      default: () => []
    }
  },
  setup (props) {
    const model = useVModel(props, 'value')
    const data = ref()

    onMounted(() => {
      model.value = model.value || []
    })

    const adicionarTarea = () => {
      const tareas = model.value
      tareas.push(data.value)
      data.value = null
      model.value = tareas
    }

    const eliminarTarea = index => {
      const tareas = model.value
      tareas.splice(index, 1)
      model.value = tareas
    }
    return {
      model,
      rules,
      data,
      adicionarTarea,
      eliminarTarea
    }
  }
}
</script>
