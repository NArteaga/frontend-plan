<template>
  <q-page>
    <Titulo
      titulo="Red Funcional"
      icono="account_tree"
    ></Titulo>
    <Historial
      :idReclamo="entidad.id"
      v-model:showHistorial="dialogHistorial"
    />
    <Pdf
      :idReclamo="entidad.id"
      v-model:showPdf="dialogPdf"
    />
    <DatosSolicitud
      :idReclamo="entidad.id"
      v-model:showDatos="dialogDatos"
      @update="$refs.CrudTable.updateList()"
    />
    <CrudTable
      ref="CrudTable"
      :filters="filters"
      :columns="columns"
      :url="url"
      :order="'createdAt'"
    >
      <template v-slot:buttons-end>
        <vue3-json-excel
          :fetch="fetchData"
          :fields="jsonFields"
        >
          <q-btn
            icon="add"
            label="Exportar excel"
            color="positive"
            @click="downloadExcel"
          />
        </vue3-json-excel>
      </template>
      <template v-slot:row="{ row }">
        <q-tr>
          <q-td class="q-gutter-xs">
            <q-btn
              flat
              round
              color="positive"
              icon="remove_red_eye"
              @click="openModalDatos(row)"
            />
            <q-btn
              v-if="['CERTIFICADO'].includes(row.estado)"
              flat
              round
              color="info"
              icon="verified"
              @click="openModalPdf(row)"
            />
            <q-btn
              flat
              round
              color="info"
              icon="timeline"
              @click="openModalHistorial(row)"
            />
          </q-td>
          <q-td>{{ row.nombre }}</q-td>
          <q-td>{{ row.entidad.nombre }}</q-td>
          <q-td>{{ row.departamento }}</q-td>
          <q-td>{{ row.fechaSolicitud }}</q-td>
          <q-td>
            <Estado :estado="row.estado" />
          </q-td>
        </q-tr>
      </template>
    </CrudTable>
  </q-page>
</template>

<script>
import { ref, inject } from 'vue'
import CrudTable from 'components/common/CrudTable'
import Historial from 'components/RFuncional/Historial'
import Pdf from 'components/RFuncional/Pdf'
import DatosSolicitud from 'components/RFuncional/DatosSolicitud'

const filters = [
  {
    label: 'Nombre del servicio principal',
    field: 'nombre',
    type: 'input'
  },
  {
    label: 'Departamento',
    field: 'departamento',
    type: 'select',
    options: [
      { label: 'LA PAZ', value: 'LA PAZ' },
      { label: 'ORURO', value: 'ORURO' },
      { label: 'POTOSI', value: 'POTOSI' },
      { label: 'SANTA CRUZ', value: 'SANTA CRUZ' },
      { label: 'BENI', value: 'BENI' },
      { label: 'COCHABAMBA', value: 'COCHABAMBA' },
      { label: 'TARIJA', value: 'TARIJA' },
      { label: 'CHUQUISACA', value: 'CHUQUISACA' },
      { label: 'PANDO', value: 'PANDO' }
    ]
  },
  {
    label: 'Estado',
    field: 'estado',
    type: 'select',
    options: [
      {
        label: 'PENDIENTE',
        value: 'PENDIENTE'
      },
      {
        label: 'CANCELADO',
        value: 'CANCELADO'
      },
      {
        label: 'CERTIFICADO',
        value: 'CERTIFICADO'
      },
      {
        label: 'ANULADO',
        value: 'ANULADO'
      },
      {
        label: 'RECHAZADO',
        value: 'RECHAZADO'
      },
      {
        label: 'VERIFICADO',
        value: 'VERIFICADO'
      }
    ]
  }
]

const columns = [
  {
    name: 'acciones',
    label: 'Acciones',
    sortable: false
  },
  {
    name: 'nombre',
    label: 'Nombre del servicio principal',
    sortable: false
  },
  {
    name: 'entidad',
    label: 'Entidad',
    sortable: false
  },
  {
    name: 'departamento',
    label: 'Departamento',
    sortable: false
  },
  {
    name: 'fechaSolicitud',
    label: 'Fecha de la solicitud',
    sortable: false
  },
  {
    name: 'estado',
    label: 'Estado',
    sortable: false
  }
]

export default {
  components: { CrudTable, Historial, Pdf, DatosSolicitud },
  name: 'Dashboard',
  setup () {
    const _http = inject('http')
    const url = ref('rfuncional/solicitudes-pendientes')
    const dialogHistorial = ref(false)
    const dialogPdf = ref(false)
    const dialogDatos = ref(false)
    const datosDownload = ref([])
    const CrudTable = ref('CrudTable')
    const entidad = ref({
      descripcion: null,
      direccion: null,
      email: null,
      idEntidad: null,
      nivel: null,
      nombre: null,
      sigla: null,
      telefono: null,
      web: null
    })

    const resetForm = () => {
      entidad.value = {
        descripcion: null,
        direccion: null,
        email: null,
        idEntidad: null,
        nivel: null,
        nombre: null,
        sigla: null,
        telefono: null,
        web: null
      }
    }

    const openModal = async (open, id) => {
      resetForm()
      if (id) {
        entidad.value = await _http.get(`/${url.value}/${id}`)
      }
      open()
    }

    const closeModal = (close) => {
      resetForm()
      close()
    }

    const guardar = async (update, close) => {
      if (entidad.value.id) {
        await _http.put(`/${url.value}/${entidad.value.id}`, entidad.value)
      } else {
        await _http.post(`/${url.value}`, entidad.value)
      }
      await update()
      closeModal(close)
    }

    const getNombreCompleto = (usuario) => {
      return `${usuario.nombres} ${usuario.primerApellido} ${usuario.segundoApellido}`
    }

    function openModalHistorial (reclamo) {
      entidad.value = reclamo
      dialogHistorial.value = true
    }

    function openModalPdf (reclamo) {
      entidad.value = reclamo
      dialogPdf.value = true
    }

    function openModalDatos (reclamo) {
      entidad.value = reclamo
      dialogDatos.value = true
    }

    async function downloadExcel () {
      const csv = await _http.get('rfuncional/reporte')
      const anchor = document.createElement('a')
      anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
      anchor.target = '_blank'
      anchor.download = 'reporte.csv'
      anchor.click()
    }

    return {
      // HISTORIAL -----------
      dialogHistorial,
      openModalHistorial,
      // PDF -----------
      dialogPdf,
      openModalPdf,
      // DATOS SOLICITUD -----
      dialogDatos,
      openModalDatos,
      // CORE ----------------
      CrudTable,
      downloadExcel,
      datosDownload,
      entidad,
      filters,
      columns,
      url,
      closeModal,
      openModal,
      getNombreCompleto,
      guardar
    }
  }
}
</script>
