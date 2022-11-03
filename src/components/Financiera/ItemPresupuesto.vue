<template>
  <q-dialog v-model="dialog" persistent>
    <q-card style="width: 700px; max-width: 80vw">
      <q-toolbar>
        <q-toolbar-title class="text-h6 text-weight-medium">
          {{ model.id ? "Editar" : "Nueva" }} Item
        </q-toolbar-title>
        <q-btn flat round dense icon="close" @click="$emit('closeModal')" />
      </q-toolbar>
      <q-card-section>
        <q-form @submit="$emit('guardar', model)" class="row q-col-gutter-md">
          <q-select
            v-model="model.idOrganismoFinanciador"
            :options="optionsOrganismo"
            label="Organismo Financiador"
            filled
            clearable
            option-value="id"
            option-label="nombre"
            :rules="rules.requerido"
            map-options
            emit-value
            class="required col-xs-6"
          />
          <q-select
            v-model="model.idPartidaPresupuestaria"
            :options="optionsPartida"
            label="Partida Presupuestaria"
            filled
            clearable
            class="required col-xs-6"
            option-value="id"
            option-label="nombre"
            :rules="rules.requerido"
            map-options
            emit-value
          />
          <q-input
            v-model="model.descripcion"
            label="Descripción"
            filled
            class="required col-xs-12"
            :rules="rules.requerido"
          />
          <q-input
            v-model="model.montoOficial"
            label="Monto Presupuestado"
            filled
            class="required col-xs-12"
          />
          <div class="col-xs-12 text-right">
            <q-btn
              label="Cancelar"
              icon="close"
              color="negative"
              flat
              @click="$emit('closeModal')"
            />
            <q-btn
              label="Guardar"
              icon="save"
              type="sumbit"
              color="primary"
              class="q-ml-sm"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
import validaciones from '@common/validations'
import { useVModel } from 'src/composables/useVModel'
import { inject, ref, onMounted } from 'vue'
const rules = {
  requerido: [validaciones.requerido]
}
export default {
  props: {
    value: {
      type: Object,
      defaultValue: () => {}
    },
    open: {
      type: Boolean,
      defaultValue: false
    }
  },
  setup (props) {
    const model = useVModel(props, 'value')
    const dialog = useVModel(props, 'open')
    const _http = inject('http')
    const optionsOrganismo = ref([])
    const optionsPartida = ref([])

    onMounted(async () => {
      optionsOrganismo.value = await getOrganismoFinanciador()
      optionsPartida.value = await getPartida()
    })

    const getOrganismoFinanciador = async () => {
      const { rows } = await _http.get('financiera/organismo-financiador')
      return rows
    }

    const getPartida = async () => {
      const { rows } = await _http.get('financiera/partida-presupuestaria')
      return rows
    }
    return {
      rules,
      model,
      dialog,
      optionsPartida,
      optionsOrganismo
    }
  }
}
</script>
