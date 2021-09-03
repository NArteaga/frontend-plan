<template>
  <q-page>
    <Titulo
      titulo="Usuarios"
      icono="people"
    ></Titulo>
    <CrudTable
      :filters="filters"
      :columns="columns"
      :url="'/system/usuarios'"
      :order="'createdAt'"
    >
      <template v-slot:buttons="props">
        <q-btn
          icon="add"
          color="secondary"
          @click="openModal(props.open)"
        > Agregar
        </q-btn>
      </template>
      <template v-slot:form="props">
        <q-card style="width: 700px; max-width: 90vw;">
          <q-toolbar class="q-pa-md">
            <q-icon
              name="home_work"
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
              @click="closeModal(props.close)"
            />
          </q-toolbar>
          <q-card-section>
            <q-form
              class="row q-col-gutter-md"
              @submit="guardar(props)"
            >
              <q-input
                class="col-xs-12 col-md-6"
                label="Nombre"
                filled
                v-model="usuario.nombres"
              ></q-input>
              <q-input
                class="col-xs-12 col-md-6"
                label="Primer Apellido"
                filled
                v-model="usuario.primerApellido"
              ></q-input>
              <q-input
                class="col-xs-12 col-md-6"
                label="Segudo Apellido"
                filled
                v-model="usuario.segundoApellido"
              ></q-input>
              <div class="col-xs-12 text-right">
                <q-btn
                  label="Cancelar"
                  @click="closeModal(props.close)"
                />
                <q-btn
                  label="Guardar"
                  type="submit"
                  color="primary"
                  class="q-ml-sm"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </template>
      <template v-slot:row="props">
        <q-tr>
          <q-td>
            <q-btn
              class="q-pa-xs"
              flat
              round
              icon="fact_check"
              @click="openModalComponentes(props.row)"
            />
            <q-btn
              class="q-pa-xs"
              flat
              round
              icon="edit"
              @click="openModal(props.open, props.row.id)"
            />
            <q-btn
              class="q-pa-xs"
              flat
              round
              color="negative"
              icon="delete"
              @click="eliminar(props.update, props.row.id)"
            />
          </q-td>
          <q-td>
            <q-toggle
              v-model="props.row.estado"
              color="primary"
              false-value="INACTIVO"
              true-value="ACTIVO"
              @click="cambiarEstado(props.update, props.row)"
            />
          </q-td>
          <q-td>{{ getNombreCompleto(props.row) }}</q-td>
          <q-td>{{ props.row.numeroDocumento }}</q-td>
          <q-td>{{ props.row.correoElectronico }}</q-td>
          <q-td>{{ props.row.cargo }}</q-td>
          <q-td>
            <q-chip
              v-if="props.row.estado === 'ACTIVO'"
              square
              color="info"
              text-color="white"
              label="ACTIVO"
            />
            <q-chip
              v-if="props.row.estado === 'INACTIVO'"
              square
              color="warning"
              text-color="white"
              label="INACTIVO"
            />
          </q-td>
        </q-tr>
      </template>
    </CrudTable>
  </q-page>
</template>

<script>
import { ref, inject } from 'vue'
import CrudTable from '@components/common/CrudTable'

const filters = [
  {
    label: 'Nombre',
    field: 'nombre',
    type: 'input'
  },
  {
    label: 'Fecha',
    field: 'fecha',
    type: 'date'
  },
  {
    label: 'Fecha2',
    field: 'fecha2',
    type: 'date'
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
    sortable: false
  },
  {
    name: 'nombreCompleto',
    label: 'Nombre completo',
    sortable: false
  },
  {
    name: 'numeroDocumento',
    label: 'Numero de documento',
    sortable: false
  },
  {
    name: 'correoElectronico',
    label: 'Correo electronico',
    sortable: false
  },
  {
    name: 'cargo',
    label: 'Cargo',
    sortable: false
  },
  {
    name: 'estado',
    label: 'Estado',
    sortable: false
  }
]

export default {
  components: { CrudTable },
  name: 'Dashboard',
  setup () {
    const _http = inject('http')

    const usuario = ref({
      id: null,
      nombres: '',
      primerApellido: '',
      segundoApellido: ''
    })

    const resetForm = () => {
      usuario.value = {
        id: null,
        nombres: '',
        primerApellido: '',
        segundoApellido: ''
      }
    }

    const openModal = async (open, id) => {
      resetForm()
      if (id) {
        usuario.value = await _http.get(`/system/usuarios/${id}`)
      }
      open()
    }

    const closeModal = (close) => {
      resetForm()
      close()
    }

    const guardar = (props) => {
      if (usuario.value.id) {
        _http.put(`/system/usuarios/${usuario.value.id}`, usuario.value)
      } else {
        _http.post('/system/usuarios', usuario.value)
      }
      props.update()
      closeModal(props.close)
    }

    const getNombreCompleto = (usuario) => {
      return `${usuario.nombres} ${usuario.primerApellido} ${usuario.segundoApellido}`
    }

    return {
      closeModal,
      openModal,
      getNombreCompleto,
      guardar,
      usuario,
      filters,
      columns
    }
  }
}
</script>
