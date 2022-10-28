<template>
  <q-dialog v-model="modal" persistent>
    <q-card style="width: 1200px; max-width: 80vw;">
      <q-toolbar>
        <q-toolbar-title>
          Ver Registro
        </q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <q-card-section>
        <q-form ref="myForm" class="row q-col-gutter-md">
          <q-input
            :readonly="true"
            v-model="model.gestion.gestion"
            label="Gestión"
            filled
            class="required col-xs-6"
            :rules="rules.requerido"
           />
          <q-input v-model="model.area.nombreArea"
            :readonly="true"
            label="Unidad Organizacional"
            filled
            class="required col-xs-6"
            :rules="rules.requerido" />
          <q-input
            :readonly="true"
            v-model="model.tipo"
            label="Tipo"
            filled
            class="required col-xs-6"
            :rules="rules.requerido" />
          <DateField
            v-model:value="model.fechaInicio"
            label="Fecha Inicio"
            class="required col-xs-6"
            :rules="rules.requerido"
          />
          <DateField
            v-model:value="model.fechaFin"
            label="Fecha Fin"
            class="required col-xs-6"
            :rules="rules.requerido"
          />
          <q-select
            outlined
            v-model="model.idUnidadOrganizacionalRevisora"
            :options="optionsUnidadesOrganizacionales"
            label="Unidad Organizacional Revisora"
            filled
            option-label="nombre_area"
            option-value="id"
            map-options
            emit-value
            use-input
            input-debounce="0"
            class="col-xs-6 q-pr-md"
            @filter="filterOrganismoRevisor"
          />
          <q-select
            outlined
            v-model="model.idUsuarioRevisor"
            :options="optionsUsuariosRevisores"
            label="Usuario Revisor"
            filled
            option-label="nombres"
            option-value="id"
            map-options
            emit-value
            stack-label
            use-input
            input-debounce="0"
            class="col-xs-6 q-pr-md"
            @filter="filterUsuarioRevisor"
          />
        </q-form>

        <div class="col-xs-12 text-right">
            <q-btn label="Cancelar" icon="close" color="negative" flat  v-close-popup />
            <q-btn label="Guardar" icon="save" @click="guardar" color="primary" class="q-ml-sm" />
        </div>
      </q-card-section>
    </q-card>

  </q-dialog>

</template>

<script>
import { ref, inject, onMounted } from 'vue'
import { useVModel } from 'src/composables/useVModel'
import validaciones from '@common/validations'
import DateField from '@components/common/DateField'

const rules = {
  requerido: [
    validaciones.requerido
  ]
}

export default {
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: () => {
        return {
          id: null
        }
      }
    }
  },
  components: {
    DateField
  },
  setup (props, { emit }) {
    const _http = inject('http')
    const modal = useVModel(props, 'dialog')
    const model = useVModel(props, 'value')
    const myForm = ref(null)

    const urlUnidadesOrganizacionales = ref('system/areas')
    const optionsUnidadesOrganizacionales = ref()
    const unidadesOrganizacionales = ref()

    const urlUsuarios = ref('system/usuarios')
    const optionsUsuariosRevisores = ref()
    const usuariosRevisores = ref()

    onMounted(async () => {
      await getAreas()
      await getUsuarios()
    })

    const guardar = async () => {
      myForm.value.validate().then(async (success) => {
        if (success) {
          update()
          modal.value = false
        }
      })
    }

    const update = async () => {
      const data = {
        fechaInicio: model.value.fechaInicio,
        fechaFin: model.value.fechaFin,
        idUnidadOrganizacionalRevisora: model.value.idUnidadOrganizacionalRevisora,
        idUsuarioRevisor: model.value.idUsuarioRevisor
      }
      await _http.put(`planificacion/formulacion/${model.value.id}`, data)
    }

    const getAreas = async () => {
      const { rows } = await _http.get(`${urlUnidadesOrganizacionales.value}?order=nombre_area`)
      optionsUnidadesOrganizacionales.value = rows
      unidadesOrganizacionales.value = rows
    }

    const getUsuarios = async () => {
      const { rows } = await _http.get(`${urlUsuarios.value}`)
      optionsUsuariosRevisores.value = rows
      usuariosRevisores.value = rows
    }

    return {
      modal,
      rules,
      model,
      guardar,
      myForm,
      optionsUnidadesOrganizacionales,
      filterOrganismoRevisor (val, update) {
        if (val === '') {
          update(() => {
            optionsUnidadesOrganizacionales.value = unidadesOrganizacionales.value
          })
          return
        }

        update(() => {
          const needle = val.toLowerCase()
          const tmp = unidadesOrganizacionales.value
          optionsUnidadesOrganizacionales.value = tmp.filter(v => v.nombre_area.toLowerCase().indexOf(needle) > -1)
        })
      },
      optionsUsuariosRevisores,
      filterUsuarioRevisor (val, update) {
        if (val === '') {
          update(() => {
            optionsUsuariosRevisores.value = usuariosRevisores.value
          })
          return
        }

        update(() => {
          const needle = val.toLowerCase()
          const tmp = usuariosRevisores.value
          optionsUsuariosRevisores.value = tmp.filter(v => v.nombres.toLowerCase().indexOf(needle) > -1)
        })
      }
    }
  }
}
</script>
