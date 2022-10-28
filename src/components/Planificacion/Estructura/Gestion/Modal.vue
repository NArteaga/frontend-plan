<template>
  <q-dialog v-model="dialog" persistent>
    <q-card style="width: 700px; max-width: 80vw">
      <q-toolbar>
        <q-toolbar-title class="text-h6 text-weight-medium">
          {{ gestion.id ? "Editar" : "Nueva" }} Gestión
        </q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <q-card-section>
        <q-form @submit="$emit('guardar', gestion)" class="row q-col-gutter-md">
          <q-input
            :readonly="gestion.id ? true : false"
            v-model="gestion.gestion"
            label="Gestión"
            filled
            class="required col-xs-6"
            :rules="rules.requerido"
          />
          <q-select
            v-if="gestion.id"
            v-model="gestion.etapa"
            :options="['FORMULACION', 'SEGUIMIENTO', 'EJECUCION']"
            label="Etapa"
            filled
            clearable
            class="required col-xs-6"
            @update:model-value="getSeguimientos"
          />
          <q-select
            v-if="gestion.etapa === 'SEGUIMIENTO'"
            v-model="gestion.idSeguimiento"
            :options="optionSeguimiento"
            label="Seguimiento"
            filled
            clearable
            class="required col-xs-12"
            :rules="rules.requerido"
            map-options
            option-label="descripcion"
            option-value="id"
            emit-value
          />
          <DateField
            v-if="gestion.id && gestion.etapa"
            v-model:value="gestion.fechaInicio"
            label="Fecha Inicio"
            class="required col-xs-6"
            :rules="rules.requerido"
          />
          <DateField
            v-if="gestion.id && gestion.etapa"
            v-model:value="gestion.fechaFin"
            label="Fecha Fin"
            class="required col-xs-6"
            :rules="rules.requerido"
          />
          <div class="col-xs-12 text-right">
            <q-btn
              label="Cancelar"
              icon="close"
              color="negative"
              flat
              v-close-popup
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
import DateField from '@components/common/DateField'
import validaciones from '@common/validations'
import { useVModel } from 'src/composables/useVModel'
import { inject, ref } from 'vue'
const rules = {
  requerido: [validaciones.requerido]
}
export default {
  components: {
    DateField
  },
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
    const gestion = useVModel(props, 'value')
    const dialog = useVModel(props, 'open')
    const _http = inject('http')
    const optionSeguimiento = ref([])
    const getSeguimientos = async () => {
      gestion.value.fechaInicio = null
      gestion.value.fechaFin = null
      if (gestion.value.etapa === 'SEGUIMIENTO') {
        const { rows } = await _http.get(`planificacion/seguimiento?idGestion=${gestion.value.id}order=-createdAt`)
        optionSeguimiento.value = rows
      }
    }
    return {
      rules,
      gestion,
      dialog,
      optionSeguimiento,
      getSeguimientos
    }
  }
}
</script>
