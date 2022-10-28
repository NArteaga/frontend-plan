<template>
  <q-card class="q-ma-md">
    <q-card-section class="row">
      <q-select
        v-model="gestion"
        :options="gestiones"
        label="Gestion"
        filled
        class="col-md-4 col-xs-12 q-pr-md"
        @update:model-value="getGestion"
      />
      <q-select
        v-model="entidad"
        :options="entidades"
        label="Instituciones"
        class="col-md-8 col-xs-12"
        filled
        option-label="nombre"
        option-value="id"
      />
    </q-card-section>
    <q-card-section class="q-px-lg q-py-none items-center">
      <div class="row">
        <div class="col-md-12 col-xs-12">
          <div class="row bg-orange-2 q-py-md">
            <div class="col-xs-12 q-px-md">
              <span class="text-subtitle1 text-weight-bold text-primary"> Información de Planificación</span>
            </div>
            <q-item class="col-xs-3 col-md-3 col-lg-3">
              <q-item-section >
                <q-item-label caption><b>Etapa:</b></q-item-label>
                <q-item-label >
                  <Estado :label="informacionFormulacion?.tipo"/>
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="col-xs-3 col-md-3 col-lg-3">
              <q-item-section >
                <q-item-label caption><b>Estado:</b></q-item-label>
                <q-item-label >
                  <Estado :label="informacionFormulacion?.etapa"/>
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="col-xs-3 col-md-3 col-lg-3">
              <q-item-section >
                <q-item-label caption><b>Fecha Inicio:</b></q-item-label>
                <q-item-label >{{informacionFormulacion?.fechaInicio}}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="col-xs-3 col-md-3 col-lg-3">
              <q-item-section >
                <q-item-label caption><b>Fecha Fin:</b></q-item-label>
                <q-item-label >{{informacionFormulacion?.fechaFin}}</q-item-label>
              </q-item-section>
            </q-item>
            {{ calificacion }}
          </div>
        </div>
      </div>
    </q-card-section>
    <q-card-section class="q-px-lg q-py-none items-center">
      <div class="text-center text-grey" >
        <q-btn class="q-mt-md full-width" push outline color="primary" icon="add" label="CREAR PLAN" @click="crearPrimeraOperacion" />
      </div>
    </q-card-section>
    <q-card-section class="q-px-md">
      <template v-for="(operacion, index) in operaciones" :key="operacion.id">
        <OperacionesPoa
          v-model:operacion="operaciones[index]"
          :entidad="entidad"
          :idFormulacion="informacionFormulacion.id"
          :seguimiento="informacionSeguimiento"
          :etapa="informacionFormulacion.etapa"
          :gestion="informacionGestion"
          @actualizar="getData"
        />
      </template>
    </q-card-section>
    <q-card-section v-if="operaciones?.length === 0" class="q-px-lg q-py-none items-center">
      <div class="q-py-md text-center text-grey" >
        No existe operaciones registradas para la gestion {{ gestion }}<br>
      </div>
    </q-card-section>
    <q-card-section v-if="!consultado" class="text-center">
      <q-circular-progress
        indeterminate
        size="50px"
        color="primary"
        class="q-ma-md"
      />
    </q-card-section>
  </q-card>
  <Operacion
    v-if="dialog"
    v-model:dialog="dialog"
    v-model:value="data"
    :idFormulacion="informacionFormulacion.id"
    :estructura="estructura"
    :gestion="informacionGestion"
    :entidad="entidad"
    @creado="getData"
  />
</template>
<script>
import { inject, ref, onMounted } from 'vue'
import Estado from '@components/Planificacion/Formulacion/Estado'
import OperacionesPoa from './Operaciones'
import Operacion from '../Estructura/Operacion'
export default {
  components: {
    Estado,
    OperacionesPoa,
    Operacion
  },
  props: {
    institucion: {
      type: Object,
      default: null
    }
  },
  setup (props) {
    const _storage = inject('storage')
    const _http = inject('http')
    const gestion = ref()
    const gestiones = ref([])
    const entidad = ref()
    const informacionGestion = ref()
    const informacionGestiones = ref()
    const informacionSeguimiento = ref({})
    const informacionFormulacion = ref()
    const entidades = ref()
    const consultado = ref(false)
    const operaciones = ref([])
    const calificacion = ref()
    const dialog = ref(false)
    const data = ref({
      idOperacionPadre: null,
      cronograma: [],
      tareas: [],
      mediosVerificacion: [],
      bienServicioDemandado: []
    })
    onMounted(async () => {
      console.log(props)
      if (!props?.institucion) {
        entidad.value = {
          id: _storage.get('usuario').idEntidad,
          nombre: _storage.get('usuario').entidad
        }
      } else entidad.value = props.institucion
      await getGestiones()
      await getGestion()
      entidades.value = await getEntidades()
    })
    const getSeguimiento = async () => {
      const respuesta = await _http.get(`planificacion/seguimiento/${informacionFormulacion.value.idSeguimiento}`)
      informacionSeguimiento.value = respuesta
    }
    const getGestion = async () => {
      informacionGestion.value = informacionGestiones.value.find(value => value.gestion === gestion.value)
      await getFormulacion()
      await getData()
      if (informacionFormulacion.value.idSeguimiento) {
        await getSeguimiento()
      }
    }
    const getGestiones = async () => {
      const data = await _http.get('planificacion/gestion?estado=ACTIVO')
      gestiones.value = data.rows
      if (data.count > 0) {
        informacionGestion.value = data.rows[0]
        informacionGestiones.value = data.rows
        gestion.value = data.rows[0].gestion
        gestiones.value = data.rows.map((item) => item.gestion)
      }
    }
    const getFormulacion = async () => {
      const { rows } = await _http.get(`planificacion/formulacion?idGestion=${informacionGestion.value.id}&idEntidad=${entidad.value.id}&tipo=${informacionGestion.value.etapa}`)
      informacionFormulacion.value = rows[0]
    }

    const getEntidades = async () => {
      const result = await _http.get(`system/entidades/${entidad.value.id}`)
      return [result]
    }
    const crearPrimeraOperacion = () => {
      dialog.value = true
    }
    const getData = async () => {
      operaciones.value = []
      let url = 'planificacion/operacion/poa'
      if (entidad?.value) {
        url = `${url}?idEntidad=${entidad.value.id}&idGestion=${informacionGestion.value.id}`
        const respuesta = await _http.get(url)
        dialog.value = false
        operaciones.value = respuesta
        consultado.value = true
      }
    }
    return {
      entidad,
      entidades,
      informacionFormulacion,
      informacionGestion,
      gestion,
      gestiones,
      getGestion,
      operaciones,
      consultado,
      informacionSeguimiento,
      dialog,
      data,
      getData,
      calificacion,
      crearPrimeraOperacion
    }
  }
}
</script>
