<template>
  <q-page>
    <Titulo
      titulo="Red Funcional"
      icono="account_tree"
    ></Titulo>
    <Historial
      :idReclamo="menu.id"
      v-model:showHistorial="dialogHistorial"
    />
    <Pdf
      :idReclamo="menu.id"
      v-model:showPdf="dialogPdf"
    />
    <DatosSolicitud
      :idReclamo="menu.id"
      v-model:showDatos="dialogDatos"
      @update="$refs.CrudTable.updateList()"
    />
    <CrudTable
      :filters="filters"
      :columns="columns"
      :url="url"
      :order="'createdAt'"
    >
      <template v-slot:buttons="{ open }">
        <q-btn
          icon="add"
          color="secondary"
          @click="openModal(open)"
          label="Nueva Solicitud"
        />
      </template>
      <template v-slot:form="{ close, update}">
        <q-card style="width: 700px; max-width: 90vw;">
          <q-toolbar class="q-pa-md">
            <q-icon
              name="account_tree"
              size="md"
            />
            <q-toolbar-title>
              {{ menu.id ? 'Editar' : 'Agregar' }} Solicitud
            </q-toolbar-title>
            <q-space />
            <q-btn
              flat
              round
              icon="close"
              @click="closeModal(close)"
            />
          </q-toolbar>
          <q-card-section>
            <Solicitud
              v-model:valores="menu"
              @guardar="guardar(update, close)"
              @cancelar="closeModal(close)"
            ></Solicitud>
          </q-card-section>
        </q-card>
      </template>
      <template v-slot:row="{ row, open, eliminar, enviar }">
        <q-tr>
          <q-td>
            <q-btn
              v-if="['INICIO'].includes(row.estado)"
              class="q-pa-xs"
              flat
              round
              icon="edit"
              @click="openModal(open, row.id)"
            />
            <q-btn
              v-if="['INICIO'].includes(row.estado)"
              class="q-pa-xs"
              flat
              round
              color="info"
              icon="send"
              @click="enviar({ url: `${url}/${row.id}/enviar`})"
            />
            <q-btn
              v-if="['INICIO'].includes(row.estado)"
              class="q-pa-xs"
              flat
              round
              color="negative"
              icon="delete"
              @click="eliminar({ url: `${url}/${row.id}` })"
            />
            <q-btn
              v-if="!['INICIO'].includes(row.estado)"
              flat
              round
              color="info"
              icon="timeline"
              @click="openModalHistorial(row)"
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
              v-if="!['INICIO'].includes(row.estado)"
              flat
              round
              color="positive"
              icon="remove_red_eye"
              @click="openModalDatos(row)"
            />
          </q-td>
          <q-td>{{ row.nombre }}</q-td>
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
import CrudTable from '@components/common/CrudTable'
import Historial from 'components/RFuncional/Historial'
import Pdf from 'components/RFuncional/Pdf'
import DatosSolicitud from 'components/RFuncional/Funcionario/DatosSolicitud'
import Solicitud from 'components/Formularios/RFuncional/Solicitud'

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
  components: { CrudTable, Solicitud, Pdf, Historial, DatosSolicitud },
  name: 'Dashboard',
  setup () {
    const _http = inject('http')
    const _message = inject('message')

    const url = ref('rfuncional/solicitudes')
    const dialogHistorial = ref(false)
    const dialogPdf = ref(false)
    const dialogDatos = ref(false)
    // const url = ref('rfuncional/solicitudes_entidad')
    const menu = ref({
      grupo: null,
      nombre: null,
      descripcion: null,
      codigo: null,
      estado: 'ACTIVO'
    })

    const resetForm = () => {
      menu.value = {
        grupo: null,
        nombre: null,
        descripcion: null,
        codigo: null,
        estado: 'ACTIVO'
      }
    }

    const openModal = async (open, id) => {
      resetForm()
      if (id) {
        menu.value = await _http.get(`/${url.value}/${id}`)
      }
      open()
    }

    const closeModal = (close) => {
      resetForm()
      close()
    }

    const guardar = async (update, close) => {
      let mennsaje = 'Solicitud creado de manera exitosa.'
      if (menu.value.id) {
        menu.value.entidad = 'PENDIENTE'
        mennsaje = 'Solicitud actualizado de manera exitosa.'
        await _http.put(`/${url.value}/${menu.value.id}`, menu.value)
      } else {
        menu.value.citeSaj = 'CSAJ-0000001'
        menu.value.estado = 'INICIO'
        await _http.post(`/${url.value}`, menu.value)
      }
      _message.success(mennsaje)
      await update()
      closeModal(close)
    }

    function openModalHistorial (reclamo) {
      menu.value = reclamo
      dialogHistorial.value = true
    }

    function openModalPdf (reclamo) {
      menu.value = reclamo
      dialogPdf.value = true
    }

    function openModalDatos (reclamo) {
      menu.value = reclamo
      dialogDatos.value = true
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
      menu,
      filters,
      columns,
      url,
      closeModal,
      openModal,
      guardar
    }
  }
}
</script>
