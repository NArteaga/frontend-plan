<template>
  <q-page>
    <Titulo
      titulo="Holas"
      icono="home"
    ></Titulo>
    <q-input
      v-model="demo"
      label="algo"
      filled
      @update:model-value="actualizacion"
    >

    </q-input>
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
          <q-td>{{ props.row.nombre }}</q-td>
          <q-td>{{ props.row.sigla }}</q-td>
          <q-td>{{ props.row.direccion }}</q-td>
          <q-td>{{ props.row.telefono }}</q-td>
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
import { ref, reactive, watch, computed } from 'vue'
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
  }
]

export default {
  components: { CrudTable },
  name: 'PageIndex',
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

    const instituciones = [
      {
        nombre: 'Ministerio de Justicia y Transparencia Institucional',
        sigla: 'MJTI'
      },
      {
        nombre: 'Ministerio de trabajo',
        sigloa: 'MT'
      },
      {
        nombre: 'Agencia de Gobierno Electronico y Tecnologias de Información y Comunicación.',
        sigla: 'AGETIC'
      }

    ]

    const openModalIop = () => { modalIop.value = true }
    const closeModalIop = () => { modalIop.value = false }

    const openModal = () => {
      modalCite.value = true
    }
    const cancelar = () => {
      modalCite.value = false
    }

    const urlConsumo = computed(() => `${configIop.urlServicio}${configIop.rutaConsumo}`)
    const urlEstado = computed(() => `${configIop.urlServicio}${configIop.urlEstado}`)

    watch(() => { return { nombre: formulario.nombre, entidad: formulario.entidad, anual: formulario.anual } }, (value) => {
      formulario.cite = `${value.entidad}-${generarCodigoCite(value.nombre)}-{incrementable}${formulario.anual ? '-{año}' : ''}`
    })

    const generarCodigoCite = (cadena) => {
      try {
        cadena = cadena.replace(/[^a-zA-Z ]/g, '')
        const str = cadena.toUpperCase()
        const respuesta = str.split(' ')
        let abreviacion = ''
        for (let i = 0; i < respuesta.length; i++) {
          if (respuesta[i] !== 'DE' && respuesta[i] !== 'PARA' && respuesta[i] !== 'Y' && respuesta[i] !== 'LA' && respuesta[i] !== 'QUE') {
            if (respuesta[i][0]) {
              abreviacion = abreviacion + respuesta[i][0]
            }
          }
        }
        return abreviacion
      } catch (error) {
        return error
      }
    }

    const actualizacion = () => {
      console.log('==============================_MENSAJE_A_MOSTRARSE_==============================')
      console.log('EJEMPLO')
      console.log('==============================_MENSAJE_A_MOSTRARSE_==============================')
    }
    return {
      actualizacion,
      demo,
      filters,
      configIop,
      urlConsumo,
      urlEstado,
      stepIop,
      modalIop,
      step,
      instituciones,
      generarCodigoCite,
      openModal,
      cancelar,
      openModalIop,
      closeModalIop,
      modalCite,
      formulario,
      columns
    }
  }
}
</script>
