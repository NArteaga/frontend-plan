<template>
  <div class="row items-center q-col-gutter-md">
    <div class="col-xs-12 text-h6 text-weight-bold">
      <q-toolbar class="q-pa-md bg-blue-grey-1">
        <q-toolbar-title class="text-h6 text-weight-bold">
          Lista de Estructuras
        </q-toolbar-title>
        <q-btn flat round dense icon="refresh" />
      </q-toolbar>
    </div>
    <div class="text-center" v-if="estructuras?.length">
      <q-btn
        icon="add"
        color="secondary"
        @click="openModal"
        label="Nueva Estructura"
      />
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
        v-if="estructuras?.length > 0"
        :rows="estructuras"
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
              <q-btn flat round icon="list" @click="openModalOperaciones(row)">
                <q-tooltip> Operaciones </q-tooltip>
              </q-btn>
            </q-td>
            <q-td class="text-center">{{ row.sigla }}</q-td>
            <q-td class="text-center">{{ row.nombre }}</q-td>
            <q-td class="text-center">{{ row.nivel }}</q-td>
            <q-td class="text-center">{{ row.codigo ? "SI" : "NO" }}</q-td>
            <q-td class="text-center">{{ row.codigoManual ? "SI" : "NO" }}</q-td>
            <q-td class="text-center">{{ row.areaRequerida ? "SI" : "NO" }}</q-td>
            <q-td class="text-center">{{ row.editable ? "SI" : "NO" }}</q-td>
            <q-td class="text-center">{{ row.created ? "SI" : "NO" }}</q-td>
            <q-td class="text-center">{{ row.cronograma ? "SI" : "NO" }}</q-td>
          </q-tr>
        </template>
      </q-table>
      <div
        class="q-py-md text-center text-grey"
        v-if="estructuras.length === 0 && gestion?.gestion"
      >
        No existe ninguna estructura para la gestion {{ gestion?.gestion }}<br />
        <q-btn
          class="q-mt-md"
          flat
          color="primary"
          icon="add"
          label="CREAR"
          @click="crearPrimeraEstructura"
        />
      </div>
      <div
        class="q-py-md text-center text-grey"
        v-if="!gestion?.gestion"
      >
        Seleccione una gestion para listar la estructura
      </div>
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
                        v-if="!registro.nivel"
                        v-model="registro.idEstructuraPadre"
                        :options="estructuras"
                        label="Estructura Padre"
                        filled
                        map-options
                        emit-value
                        multiple
                        option-label="nombre"
                        option-value="id"
                        class="required col-xs-12 col-md-12"
                    />
                    <q-input
                        filled
                        class="required col-xs-10 col-md-10"
                        label="Nombre"
                        type="string"
                        v-model="registro.nombre"
                        :rules="rules.requerido"
                        @keyup="updateSigla"
                    />
                    <q-input
                        filled
                        class="required col-xs-2 col-md-2"
                        label="Sigla"
                        type="string"
                        v-model="registro.sigla"
                        :rules="rules.requerido"
                    />
                    <div class="col-xs-6 text-center">
                      <q-toggle
                        label="¿Generar Código?"
                        v-model="registro.codigo"
                        color="positive"
                        checked-icon="check"
                        unchecked-icon="clear"
                        left-label
                      />
                    </div>
                    <div class="col-xs-6 text-center">
                      <q-toggle
                        label="¿Código Manual?"
                        v-model="registro.codigoManual"
                        @click="registro.codigoManual === true? registro.codigo = false : registro.codigo = true"
                        color="positive"
                        checked-icon="check"
                        unchecked-icon="clear"
                        left-label
                      />
                    </div>
                    <div class="col-xs-6 text-center">
                      <q-toggle
                        label="¿Registrar Cronograma?"
                        v-model="registro.cronograma"
                        color="positive"
                        checked-icon="check"
                        unchecked-icon="clear"
                        left-label
                      />
                    </div>
                    <div class="col-xs-6 text-center">
                      <q-toggle
                        label="¿Area requerida?"
                        v-model="registro.areaRequerida"
                        color="positive"
                        checked-icon="check"
                        unchecked-icon="clear"
                        left-label
                      />
                    </div>
                    <div class="col-xs-6 text-center">
                      <q-toggle
                        label="¿Contenido Editable?"
                        v-model="registro.editable"
                        color="positive"
                        checked-icon="check"
                        unchecked-icon="clear"
                        left-label
                      />
                    </div>
                    <div class="col-xs-6 text-center">
                      <q-toggle
                        label="¿Crear Estructura?"
                        v-model="registro.created"
                        color="positive"
                        checked-icon="check"
                        unchecked-icon="clear"
                        left-label
                      />
                    </div>
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
   <Operaciones
        v-if="dialogOperaciones"
        v-model:dialog="dialogOperaciones"
        :gestion="gestion"
        :estructura="estructura"
    />
</template>
<script>
import { inject, onMounted, ref } from 'vue'
import Operaciones from './Operaciones'
import axios from 'axios'
import { useVModel } from 'src/composables/useVModel'
import validaciones from '@common/validations'

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
    name: 'sigla',
    label: 'Sigla',
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
    name: 'nivel',
    label: 'Nivel',
    align: 'center',
    sortable: false
  },
  {
    name: 'codigo',
    label: '¿Genera Código?',
    align: 'center',
    sortable: false
  },
  {
    name: 'codigoManual',
    label: '¿Código Manual?',
    align: 'center',
    sortable: false
  },
  {
    name: 'areaRequerida',
    label: '¿Area Requerida?',
    align: 'center',
    sortable: false
  },
  {
    name: 'editable',
    label: '¿Contenido Editable?',
    align: 'center',
    sortable: false
  },
  {
    name: 'created',
    label: '¿Crear Estructura?',
    align: 'center',
    sortable: false
  },
  {
    name: 'cronograma',
    label: '¿Con Cronograma?',
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
    Operaciones
  },
  setup (props) {
    const _http = inject('http')
    const _storage = inject('storage')
    const url = ref('planificacion/estructura')
    const gestiones = useVModel(props, 'listaGestiones')
    const gestion = ref()
    const estructuras = ref([])
    const estructura = ref({})
    const dialog = ref(false)
    const registro = ref({})
    const dialogOperaciones = ref(false)

    onMounted(async () => {
      if (gestion?.value?.id) await getInitialData()
    })

    const getInitialData = async () => {
      const { rows } = await _http.get(
        `${url.value}?idGestion=${gestion?.value?.id}&order=nivel`
      )
      estructuras.value = rows
    }

    const clearModal = () => {
      registro.value = {
        cronograma: false,
        codigo: true,
        areaRequerida: false,
        editable: false,
        created: false
      }
    }

    const openModal = (data) => {
      clearModal()
      if (data) {
        registro.value = { ...data }
      }
      dialog.value = true
    }

    const openModalOperaciones = (data) => {
      estructura.value = data
      dialogOperaciones.value = true
    }
    const generarReporte = async (row) => {
      let urlXlsx = `${process.env.API_URL}planificacion/operacion/reporte`
      if (row) urlXlsx = `${urlXlsx}?idEstructura=${row.id}`
      const { data } = await axios({
        url: urlXlsx,
        headers: { Authorization: `Bearer ${_storage.get('token')}` },
        responseType: 'blob'
      })
      const downloadLink = document.createElement('a')
      const url = window.URL.createObjectURL(data)
      downloadLink.href = url
      downloadLink.download = `${row?.sigla || 'POA'}.xlsx`
      downloadLink.click()
    }

    const closeModal = () => {
      clearModal()
      dialog.value = false
    }

    const crearPrimeraEstructura = () => {
      registro.value = {}
      dialog.value = true
    }

    const save = async () => {
      const data = { ...registro.value }
      data.gestion = gestion.value
      if (registro.value.id) {
        delete data.id
        await _http.put(`/${url.value}/${registro.value.id}`, data)
      } else {
        await _http.post(`/${url.value}`, data)
      }
      getInitialData()
      closeModal()
    }

    const updateSigla = () => {
      const nombre = registro.value.nombre?.trim().split(' ').map(item => (item.length > 2 ? item[0] : '')).join('').toUpperCase()
      registro.value.sigla = nombre
    }

    return {
      columns,
      gestiones,
      estructuras,
      estructura,
      gestion,
      dialog,
      dialogOperaciones,
      registro,
      rules,
      openModal,
      closeModal,
      crearPrimeraEstructura,
      getInitialData,
      updateSigla,
      save,
      openModalOperaciones,
      generarReporte
    }
  }
}
</script>
