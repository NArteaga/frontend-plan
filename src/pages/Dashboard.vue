<template>
  <q-page>
    <Titulo titulo="Holas" icono="home"></Titulo>
    <q-card class="q-mx-md">
      <q-card-section>
        <CrudTable
          :filters="[]"
          :columns="[]"
          :url="'system/usuarios'"
          :order="'createdAt'"
        ></CrudTable>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref, reactive, watch, computed } from 'vue'
import CrudTable from '@components/common/CrudTable/CrudTable'

export default {
  components: { CrudTable },
  name: 'PageIndex',
  setup () {
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

    return {
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
      formulario
    }
  }
}
</script>
