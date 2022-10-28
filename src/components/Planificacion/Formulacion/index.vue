<template>
  <div class="q-pa-md">
    <q-table
      :rows="registros"
      :columns="columns"
      row-key="name"
      :pagination="initialPagination"
      no-data-label="No existe registros disponibles"
      no-results-label="No existe registros"
      loading-label="Cargando..."
      rows-per-page-label="Filas por pagina"
      :wrap-cells="true"
    >
    <template class="q-pa-sm">
      <q-select
        outlined
        v-model="gestion"
        :options="gestiones"
        option-label="gestion"
        option-value="id"
        label="Gestión"
        filled
        @update:model-value="getData"
        class="required col-xs-3 q-pr-md"
      />
       <q-select
        outlined
        v-model="etapa"
        :options="['EN PROCESO','POR REVISAR','POR VALIDAR','POR APROBAR','POR FIRMAR','CONCLUIDO','OBSERVADO']"
        @update:model-value="getData"
        label="Etapa"
        filled
        class="col-xs-3 q-pr-md"
      />
      <q-select
        outlined
        v-model="unidadOrganizacional"
        :options="optionsUnidadOrganizacional"
        label="Unidad Organizacional"
        filled
        option-label="nombre"
        option-value="id"
        map-options
        emit-value
        use-input
        input-debounce="0"
        class="col-xs-6"
        @filter="filterFn"
        @update:model-value="getData"
      />
    </template>
      <template v-slot:body="{ row }">
        <q-tr>
          <q-td class="text-center">
            <q-btn
              class="q-pa-xs"
              flat
              round
              color="orange-7"
              icon="edit"
              @click="editarRegistro(row)"
            >
              <q-tooltip class="bg-primary">Editar</q-tooltip>
            </q-btn>
            <q-btn
              class="q-pa-xs"
              flat
              round
              color="primary"
              icon="visibility"
              @click="$router.push(`/app/planificacion/formulacion/${row.id}`)"
            >
              <q-tooltip class="bg-primary">Ver</q-tooltip>
            </q-btn>
            <q-btn
              v-if="row.archivoAdjunto"
              class="q-pa-xs"
              flat
              round
              color="positive"
              icon="collections_bookmark"
              @click="descarArchivo(row)"
            >
              <q-tooltip class="bg-primary">Descargar Archivo Adjunto</q-tooltip>
            </q-btn>
          </q-td>
          <q-td class="text-left">{{row.entidad.nombre}}</q-td>
          <q-td class="text-center">{{row.tipo}}</q-td>
          <q-td class="text-center">
            <q-chip
              :color="getColor(row.etapa)"
              :label="row.etapa"
              dark
            />
          </q-td>
          <q-td class="text-center">{{row.fechaInicio}}</q-td>
          <q-td class="text-center">{{row.fechaFin}}</q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
    <!--<ModalFormulacion
      v-if="dialog"
      v-model:dialog="dialog"
      v-model:value="registro"
    />-->

</template>

<script>
import { onMounted, ref, inject } from 'vue'
// import ModalFormulacion from '@components/Planificacion/Formulacion/ModalFormulacion'

const columns = [
  {
    name: 'acciones',
    label: 'Acciones',
    sortable: false,
    align: 'center'
  },
  {
    name: 'entidad',
    label: 'Instituciones',
    sortable: true,
    align: 'left',
    format: val => `${val}`,
    field: row => row.area.nombreArea
  },
  {
    name: 'tipo',
    label: 'Tipo',
    sortable: true,
    align: 'center',
    format: val => `${val}`,
    field: row => row.tipo
  },
  {
    name: 'etapa',
    label: 'Etapa',
    sortable: true,
    align: 'center',
    format: val => `${val}`,
    field: row => row.etapa
  },
  {
    name: 'fechaInicio',
    label: 'Fecha Inicio',
    sortable: true,
    align: 'center',
    format: val => `${val}`,
    field: row => row.fechaInicio
  },
  {
    name: 'fechaFin',
    label: 'Fecha Fin',
    sortable: true,
    align: 'center',
    format: val => `${val}`,
    field: row => row.fechaFin
  }
]

export default {
  name: 'Formulacion',
  components: {
    // ModalFormulacion
  },
  setup () {
    const _http = inject('http')
    const url = ref('planificacion/formulacion?tipo=FORMULACION')
    const registros = ref([])

    const gestion = ref(null)
    const urlGestiones = ref('planificacion/gestion?estado=ACTIVO')
    const gestiones = ref([])

    const urlEntidades = ref('system/entidades')
    const unidadesOrganizacionales = ref([])
    const unidadOrganizacional = ref()
    const idUnidadOrganizacional = ref()
    const optionsUnidadOrganizacional = ref()
    const etapa = ref()

    const dialog = ref(false)
    const registro = ref(null)

    onMounted(async () => {
      await getGestiones()
      await getUnidadesOrganizacionales()
      await getData()
    })

    const getData = async () => {
      let filtros = `gestion=${gestion.value.gestion}`
      if (unidadOrganizacional?.value) {
        filtros = `${filtros}&idUnidadOrganizacional=${unidadOrganizacional.value}`
      }
      if (etapa?.value) {
        filtros = `${filtros}&etapa=${etapa.value}`
      }
      const { rows } = await _http.get(`${url.value}&${filtros}`)
      registros.value = rows
    }

    const getGestiones = async () => {
      const { rows } = await _http.get(urlGestiones.value)
      gestiones.value = rows
      gestion.value = rows[rows.length - 1]
    }

    const getUnidadesOrganizacionales = async () => {
      const { rows } = await _http.get(urlEntidades.value)
      unidadesOrganizacionales.value = rows
      idUnidadOrganizacional.value = rows.map(row => { return row.id })
    }

    // watch([gestion, unidadOrganizacional], async (value) => {
    //   console.log('se modificio  ====>', value)
    //   console.log('unidad organizacional ===>', unidadOrganizacional.value.id)
    //   await getData()
    // })

    const initialPagination = {
      sortBy: 'desc',
      descending: false,
      rowsPerPage: 10
    }

    const editarRegistro = (item) => {
      dialog.value = true
      registro.value = item
    }

    const getColor = (etapa) => {
      let color = 'negative'
      if (etapa === 'OBSERVADO') {
        color = 'orange'
      }
      if (etapa === 'POR VALIDAR' || etapa === 'CONCLUIDO') {
        color = 'positive'
      }
      return color
    }

    const firmarPOA = async (id) => {
      const { respuestaServicio } = await _http.get(`planificacion/formulacion/${id}/firmar`)
      if (respuestaServicio) {
        window.location = respuestaServicio.link
      }
    }

    const descarArchivo = async (formulacion) => {
      const resp = await _http.getBinary(`planificacion/formulacion/${gestion.value.gestion}/adjunto/${formulacion.idUnidadOrganizacional}`)
      const a = document.createElement('a')
      a.href = resp
      a.download = 'Archivo_adjunto.xlsx'
      document.body.append(a)
      a.click()
      a.remove()
    }

    return {
      columns,
      registros,
      initialPagination,
      model: ref(null),
      gestion,
      gestiones,
      editarRegistro,
      dialog,
      registro,
      unidadOrganizacional,
      etapa,
      getUnidadesOrganizacionales,
      getData,
      getColor,
      optionsUnidadOrganizacional,
      firmarPOA,
      filterFn (val, update) {
        if (val === '') {
          update(() => {
            optionsUnidadOrganizacional.value = unidadesOrganizacionales.value
          })
          return
        }

        update(() => {
          const needle = val.toLowerCase()
          const tmp = unidadesOrganizacionales.value
          optionsUnidadOrganizacional.value = tmp.filter(v => v.nombre_area.toLowerCase().indexOf(needle) > -1)
        })
      },
      descarArchivo
    }
  }
}
</script>
