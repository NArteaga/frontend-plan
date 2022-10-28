<template>
  <q-page>
    <Titulo
      titulo="Usuarios"
      icono="person"
    ></Titulo>
    <CrudTable
      :filters="filters"
      :columns="columns"
      :url="url"
      :order="'createdAt'"
      :query="addQuery"
    >
      <template v-slot:buttons="{ open }">
        <q-btn
          icon="add"
          color="secondary"
          @click="openModal(open)"
          label="Nuevo usuario"
        />
      </template>
      <template v-slot:form="{ close, update}">
        <q-card style="width: 800px; max-width: 90vw;">
          <q-toolbar class="q-pa-md">
            <q-icon
              name="person"
              size="md"
            />
            <q-toolbar-title>
              {{ usuario.id ? 'Editar' : 'Agregar' }} usuario
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
            <Usuario
              v-model:valores="usuario"
              @guardar="guardar(update, close)"
              @cancelar="closeModal(close)"
            ></Usuario>
          </q-card-section>
        </q-card>
      </template>
      <template v-slot:row="{ row, open, eliminar, cambiarEstado }">
        <q-tr>
          <q-td>
            <q-btn
              class="q-pa-xs"
              flat
              round
              icon="edit"
              @click="openModal(open, row.id)"
            />
            <q-btn
              class="q-pa-xs"
              flat
              round
              icon="file_upload"
              @click="openDocumento(row.id)"
            />
            <q-btn
              class="q-pa-xs"
              flat
              round
              icon="description"
              @click="goDocumento(row.documento)"
            />
            <q-btn
              class="q-pa-xs"
              flat
              round
              color="negative"
              icon="delete"
              @click="eliminar({ url: `${url}/${row.id}` })"
            />
          </q-td>
          <q-td>
            <q-toggle
              v-model="row.estado"
              color="primary"
              false-value="INACTIVO"
              true-value="ACTIVO"
              @click="cambiarEstado({ registro: row, url: `${url}/${row.id}` })"
            />
          </q-td>
          <q-td>{{ row.usuario }}</q-td>
          <q-td>{{ row.numeroDocumento }}</q-td>
          <q-td>{{ row.nombres }} {{ row.primerApellido }} {{ row.segundoApellido }}</q-td>
          <q-td>{{ row.entidad?.nombre }}</q-td>
          <q-td>{{ row.cargo }}</q-td>
          <q-td>{{ row.celular }}</q-td>
          <q-td>
            <Estado :estado="row.estado" />
          </q-td>
        </q-tr>
      </template>
    </CrudTable>
    <q-dialog v-model="dialogDocumento" v-if="dialogDocumento" persistent>
      <q-card>
        <q-toolbar class="bg-grey-5">
          <q-btn flat round dense icon="attach_file" />
          <q-toolbar-title class="text-weight-medium">
            Nuevo Curriculum
          </q-toolbar-title>
        </q-toolbar>
        <q-card-section class="row q-col-gutter-md">
          <q-file
            filled
            bottom-slots
            v-model="archivo"
            label="Archivo Curriculum"
            counter
            max-files="1"
            class="col-xs-12 full-width q-py-2"
            max-file-size="10000000"
            @rejected="onRejected"
          >
            <template v-slot:before>
              <q-icon name="folder_open" />
            </template>
            <template v-slot:append>
              <q-btn
                round
                dense
                flat
                icon="add"
                @click.stop />
            </template>
          </q-file>
          <div class="col-xs-12 text-center">
            <q-img
              v-if="['png','jpeg','jpg','gif'].includes(documento.extension)"
              :src="documento.ruta"
              spinner-color="white"
              style="height: 300px; max-width: 300px" />
            <div v-if="['pdf'].includes(documento.extension)">
              <iframe
                :src="documento.ruta"
                width="100%"
                height="400px"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="cancelar" color="negative" @click="closeDialog" />
          <q-btn label="Guardar" color="primary" @click="guardarDocumento" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>

</template>

<script>
import { useRoute } from 'vue-router'
import { ref, inject, onMounted, watch } from 'vue'
import CrudTable from '@components/common/CrudTable'
import Usuario from 'components/Formularios/Usuario'
import { useQuasar } from 'quasar'

const filters = [
  {
    label: 'Usuario',
    field: 'usuario',
    type: 'input'
  },
  {
    label: 'Nombres',
    field: 'nombres',
    type: 'input'
  },
  {
    label: 'Primer Apellido',
    field: 'primerApellido',
    type: 'input'
  },
  {
    label: 'Descripcion',
    field: 'descripcion',
    type: 'input'
  },
  {
    label: 'Estado',
    field: 'estado',
    type: 'select',
    options: [
      {
        label: 'ACTIVO',
        value: 'ACTIVO'
      },
      {
        label: 'INACTIVO',
        value: 'INACTIVO'
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
    name: 'activo',
    label: 'Activo',
    sortable: true
  },
  {
    name: 'nombre',
    label: 'Nombre Usuario',
    sortable: true
  },
  {
    name: 'numeroDocumento',
    label: 'Nombre Documento',
    sortable: true
  },
  {
    name: 'nombrePersona',
    label: 'Nombre Persona',
    sortable: true
  },
  {
    name: 'entidad',
    label: 'Entidad',
    sortable: false
  },
  {
    name: 'cargo',
    label: 'Cargo',
    sortable: true
  },
  {
    name: 'celular',
    label: 'Celular',
    sortable: true
  },
  {
    name: 'estado',
    label: 'Estado',
    sortable: false
  }
]

export default {
  components: { CrudTable, Usuario },
  name: 'Dashboard',
  setup () {
    const _http = inject('http')
    const route = useRoute()
    const $q = useQuasar()
    const documento = ref({})
    const archivo = ref(null)
    const dialogDocumento = ref(false)
    const url = ref('system/usuarios')
    const addQuery = ref({ idEntidad: route?.params?.id || null })
    const usuario = ref({
      cargo: null,
      celular: null,
      correoElectronico: null,
      foto: null,
      idEntidad: null,
      nombres: null,
      numeroDocumento: null,
      primerApellido: null,
      roles: [],
      segundoApellido: null,
      telefono: null,
      usuario: null,
      estado: 'ACTIVO'
    })

    onMounted(() => {
    })

    watch(archivo, async (newValue, oldValue) => {
      if (newValue) {
        const form = new FormData()
        form.append('documento', newValue)
        const respuesta = await _http.post(`system/usuarios/${usuario.value.id}/documento/upload?idEntidad=${usuario.value.idEntidad}`, form)

        documento.value = {
          extension: (newValue.name.split('.').pop()).toLowerCase(),
          ruta: respuesta
        }
      }
    })

    const resetForm = () => {
      usuario.value = {
        cargo: null,
        celular: null,
        correoElectronico: null,
        foto: null,
        idEntidad: null,
        nombres: null,
        numeroDocumento: null,
        primerApellido: null,
        roles: [],
        segundoApellido: null,
        telefono: null,
        usuario: null,
        estado: 'ACTIVO'
      }
    }

    const openModal = async (open, id) => {
      resetForm()
      if (id) {
        usuario.value = await _http.get(`/${url.value}/${id}`)
      }
      open()
    }

    const closeModal = (close) => {
      resetForm()
      close()
    }

    const guardar = async (update, close) => {
      if (usuario.value.id) {
        await _http.put(`/${url.value}/${usuario.value.id}`, usuario.value)
      } else {
        await _http.post(`/${url.value}`, usuario.value)
      }
      await update()
      closeModal(close)
    }

    const guardarDocumento = async () => {
      await _http.put(`system/usuarios/${usuario.value.id}`, { documento: documento.value })
      closeDialog()
    }

    const closeDialog = () => {
      documento.value = {}
      dialogDocumento.value = false
    }

    const openDocumento = async (id) => {
      if (id) {
        usuario.value = await _http.get(`/${url.value}/${id}`)
      }
      dialogDocumento.value = true
    }

    const goDocumento = (documento) => {
      if (documento.ruta) {
        window.open(documento.ruta)
      }
    }

    const getNombreCompleto = (usuario) => {
      return `${usuario.nombres} ${usuario.primerApellido} ${usuario.segundoApellido}`
    }

    return {
      usuario,
      filters,
      columns,
      archivo,
      url,
      closeModal,
      dialogDocumento,
      closeDialog,
      documento,
      openModal,
      openDocumento,
      getNombreCompleto,
      goDocumento,
      guardar,
      addQuery,
      guardarDocumento,
      onRejected (rejectedEntries) {
        $q.notify({
          type: 'negative',
          message: `${rejectedEntries.length} El archivo pesa mas de 10 MB, permitidos`
        })
      }
    }
  }
}
</script>
