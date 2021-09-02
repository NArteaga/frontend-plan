<template>
  <q-page>
    <Titulo
      titulo="Holas"
      icono="home"
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
import { ref, reactive } from 'vue'
import CrudTable from '@components/common/CrudTable/CrudTable'

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
    const demo = ref('')

    const modalCite = ref(false)
    const step = ref(0)
    const modalIop = ref(false)
    const stepIop = ref(1)
    const configIop = reactive({
      formatoRespuesta: '',
      tipoRespuesta: 'Inmediato',
      nombre: '',
      urlServicio: '',
      rutaConsumo: '',
      urlEstado: '',
      tipoConsumo: 'GET',
      token: ''
    })

    const formulario = reactive({
      id: null,
      cite: '',
      nombre: '',
      descripcion: '',
      tipo: '',
      publicado: false,
      anual: false,
      entidad: null
    })

    const getNombreCompleto = (usuario) => {
      return `${usuario.nombres} ${usuario.primerApellido} ${usuario.segundoApellido}`
    }

    return {
      getNombreCompleto,
      demo,
      filters,
      configIop,
      stepIop,
      modalIop,
      step,
      modalCite,
      formulario,
      columns
    }
  }
}
</script>
