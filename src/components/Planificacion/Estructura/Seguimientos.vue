<template>
  <div class="row items-center q-col-gutter-md">
    <div class="col-xs-12 text-h6 text-weight-bold">
      <q-toolbar class="q-pa-md bg-blue-grey-1">
        <q-toolbar-title class="text-h6 text-weight-bold">
          Lista de Seguimientos
        </q-toolbar-title>
        <q-btn flat round dense icon="refresh" />
      </q-toolbar>
    </div>
    <div class="text-center">
      <q-btn
        icon="add"
        color="secondary"
        @click="openModal()"
        label="Nuevo Seguimiento"
      />
    </div>
    <div class="text-center">
    </div>
    <div class="col-xs-2">
      <q-select
        v-model="gestion"
        :options="gestiones"
        option-label="gestion"
        option-value="id"
        label="Getion"
        filled
        @update:model-value="getInitialData"
      />
    </div>
    <div class="col-xs-12">
      <q-table
        v-if="seguimientos.length > 0"
        :rows="seguimientos"
        :columns="columns"
        flat
        no-data-label="No existe registros disponibles"
        no-results-label="No existe registros"
        loading-label="Cargando..."
        rows-per-page-label="Filas por pagina"
      >
        <template v-slot:body="{ row }">
          <q-tr>
            <q-td class="text-center">
              <q-btn flat round icon="edit" @click="openModal(row)">
                <q-tooltip> Editar </q-tooltip>
              </q-btn>
            </q-td>
            <q-td class="text-center">{{ row.tipo }}</q-td>
            <q-td class="text-left">{{ row.descripcion }}</q-td>
            <q-td class="text-center">{{ row.fechaInicio }}</q-td>
            <q-td class="text-center">{{ row.fechaFin }}</q-td>
          </q-tr>
        </template>
      </q-table>
      <q-dialog
            v-model="dialog"
            persistent
        >
            <q-card style="width: 800px; max-width: 90vw;">
                <q-toolbar class="q-pa-md">
                <q-icon name="account_tree" size="md"></q-icon>
                <q-toolbar-title>
                    {{ registro.id ? 'Editar Registro' : 'Crear Nuevo'}}
                </q-toolbar-title>
                <q-space />
                <q-btn
                    flat
                    round
                    icon="close"
                    @click="closeModal"
                ></q-btn>
                </q-toolbar>
                <q-card-section>
                <q-form
                    ref="formEstructura"
                    @submit="save"
                    class="row q-col-gutter-sm"
                >
                    <q-select
                      v-model="registro.gestion"
                      :options="gestiones"
                      option-label="gestion"
                      option-value="id"
                      label="Gestion"
                      filled
                      class="required col-xs-6 col-md-6"
                      :rules="rules.requerido"
                      readonly
                    />
                    <q-select
                      v-model="registro.tipo"
                      :options="['TRIMESTRAL', 'ANUAL', 'ESPECIFICO']"
                      label="Tipo"
                      class="required col-xs-6 col-md-6"
                      filled
                      :rules="rules.requerido"
                    />
                    <q-select
                      v-if="registro.tipo === 'TRIMESTRAL'"
                      v-model="trimestre"
                      :options="['PRIMER TRIMESTRE', 'SEGUNDO TRIMESTRE', 'TERCER TRIMESTRE', 'CUARTO TRIMESTRE']"
                      label="Trimestre"
                      class="required col-xs-12 col-md-12"
                      filled
                      :rules="rules.requerido"
                    />
                    <q-input
                      v-model="registro.descripcion"
                      type="textarea"
                      label="Descripcion"
                      autogrow
                      rows="1"
                      class="required col-xs-12 col-md-12"
                      filled
                      :rules="rules.requerido"
                    />
                    <DateField
                      v-model:value="registro.fechaInicio"
                      label="Fecha Inicio"
                      class="required col-xs-6"
                      :rules="rules.requerido"
                    />
                    <DateField
                      v-model:value="registro.fechaFin"
                      label="Fecha Fin"
                      class="required col-xs-6"
                      :rules="rules.requerido"
                    />
                    <div class="col-xs-12 text-right q-gutter-sm q-pt-lg">
                    <q-btn
                        icon="close"
                        label="Cancelar"
                        @click="closeModal()"
                    ></q-btn>
                    <q-btn
                        type="submit"
                        icon="check"
                        color="primary"
                        label="Guardar"
                    ></q-btn>
                    </div>
                </q-form>
                </q-card-section>
            </q-card>
        </q-dialog>
    </div>
  </div>
</template>
<script>
import { inject, onMounted, ref, watch } from 'vue'
import DateField from '@components/common/DateField'
import { useVModel } from 'src/composables/useVModel'
import validaciones from '@common/validations'

const trimestes = {
  'PRIMER TRIMESTRE':
  {
    fechaInicio: '01-01-',
    fechaFin: '31-03-'
  },
  'SEGUNDO TRIMESTRE':
  {
    fechaInicio: '01-04-',
    fechaFin: '30-06-'
  },
  'TERCER TRIMESTRE':
  {
    fechaInicio: '01-07-',
    fechaFin: '30-09-'
  },
  'CUARTO TRIMESTRE':
  {
    fechaInicio: '01-10-',
    fechaFin: '31-12-'
  }
}

const rules = {
  requerido: [
    validaciones.requerido
  ]
}

const columns = [
  {
    name: 'acciones',
    label: 'Acciones',
    align: 'center',
    sortable: false
  },
  {
    name: 'tipo',
    label: 'Tipo',
    align: 'center',
    sortable: false
  },
  {
    name: 'descripcion',
    label: 'Descripcion',
    align: 'center',
    sortable: false
  },
  {
    name: 'fechaInicio',
    label: 'Fecha Inicio',
    align: 'center',
    sortable: false
  },
  {
    name: 'fechaFin',
    label: 'Fecha Fin',
    align: 'center',
    sortable: false
  }
]
export default {
  props: {
    listaGestiones: {
      type: Array,
      defaultValue: () => []
    }
  },
  components: {
    DateField
  },
  setup (props) {
    const _http = inject('http')
    const url = ref('planificacion/seguimiento')
    const gestion = ref()
    const seguimientos = ref([])
    const gestiones = useVModel(props, 'listaGestiones')
    const seguimiento = ref({})
    const dialog = ref(false)
    const registro = ref({})
    const trimestre = ref()

    onMounted(async () => {
      if (gestion?.value?.id) await getInitialData()
      // await getInitialData()
      registro.value.gestion = gestion.value
    })

    watch(() => registro.value.tipo, (newValue) => {
      if (newValue === 'ANUAL') {
        registro.value.fechaInicio = `01-01-${gestion.value.gestion}`
        registro.value.fechaFin = `31-12-${gestion.value.gestion}`
      } else {
        registro.value.fechaInicio = null
        registro.value.fechaFin = null
      }
    })

    watch(() => trimestre.value, (newValue) => {
      registro.value.fechaInicio = `${trimestes[newValue].fechaInicio}${gestion.value.gestion}`
      registro.value.fechaFin = `${trimestes[newValue].fechaFin}${gestion.value.gestion}`
    })

    const getInitialData = async () => {
      const { rows } = await _http.get(
        `${url.value}?gestion=${gestion.value}`
      )
      seguimientos.value = rows
    }

    const clearModal = () => {
      registro.value = {
        gestion: gestion.value
      }
    }

    const openModal = (data) => {
      clearModal()
      if (data) {
        registro.value = { ...data }
      }
      dialog.value = true
    }

    const closeModal = () => {
      clearModal()
      dialog.value = false
    }

    const save = async () => {
      const data = { ...registro.value }
      data.idGestion = gestion.value.id
      if (registro.value.id) {
        delete data.id
        await _http.put(`/${url.value}/${registro.value.id}`, data)
      } else {
        await _http.post(`/${url.value}`, data)
      }
      getInitialData()
      closeModal()
    }

    return {
      columns,
      seguimientos,
      seguimiento,
      gestion,
      dialog,
      registro,
      rules,
      trimestre,
      openModal,
      closeModal,
      getInitialData,
      save,
      gestiones
    }
  }
}
</script>
