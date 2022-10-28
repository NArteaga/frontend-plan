<template>
    <q-table
        :rows="data"
        :columns="columns"
        :wrap-cells="true"
        table-header-class="text-primary resultado-intermedio"
        :pagination="pagination"
        hide-bottom
    >
        <template v-slot:body="props">
            <q-tr>
                <q-td>
                    <q-btn v-if="formulacion && (['EN PROCESO', 'OBSERVADO'].includes(etapa) || $permisos.and('planificacion:actualizar'))" round color="primary" icon="edit" flat @click="editarOperacion(props.row)">
                        <q-tooltip>Editar</q-tooltip>
                    </q-btn>
                    <q-btn
                      v-if="formulacion"
                      round
                      color="primary"
                      icon="event"
                      flat
                      @click="openModalCronograma(props.row, props.rowIndex, false)"
                      >
                        <q-tooltip>Cronograma</q-tooltip>
                    </q-btn>
                    <q-btn
                      v-if="formulacion && (['EN PROCESO'].includes(etapa)) && informacionSeguimiento?.descripcion"
                      round
                      color="primary"
                      icon="task"
                      flat
                      @click="openModalCronograma(props.row, props.rowIndex,true)"
                      >
                        <q-tooltip>Registrar Seguimiento</q-tooltip>
                    </q-btn>
                    <q-btn
                      v-if="formulacion && (['EN PROCESO', 'OBSERVADO'].includes(etapa) || $permisos.and('planificacion:actualizar'))"
                      round
                      color="negative"
                      icon="delete"
                      flat
                      @click="eliminarOperacion(props.row)"
                    >
                        <q-tooltip>Eliminar</q-tooltip>
                    </q-btn>
                </q-td>
                <q-td class="text-center">
                    <q-badge v-if="props.row.codigo" color="indigo-6" dark :label="props.row.codigo" class="q-ml-xs text-body2" rounded  />
                </q-td>
                <q-td>
                    {{props.row.descripcion}}
                </q-td>
                <q-td class="text-right">
                    <span><b>Inicio: </b>{{props.row.fechaInicio}}</span><br/>
                    <span><b>Fin: </b>{{props.row.fechaFin}}</span>
                </q-td>
                <q-td class="text-center">
                    {{props.row.tipoMeta}}
                </q-td>
                <q-td class="text-center">
                    {{props.row.meta}}
                </q-td>
                <q-td class="text-center">
                    {{props.row.calificacion}} %
                </q-td>
                <q-td class="text-center">
                    {{props.row.ponderacion}} %
                </q-td>
                <q-td>
                    <ul>
                        <li v-for="(tarea,index) in props.row.tareas" :key="index" >{{tarea}}</li>
                    </ul>
                </q-td>
                <q-td>
                    <ul>
                        <li v-for="(medio,index) in props.row.mediosVerificacion" :key="index" >{{medio}}</li>
                    </ul>
                </q-td>
            </q-tr>
        </template>
    </q-table>
    <Operacion
        v-if="dialogOperacion"
        v-model:dialog="dialogOperacion"
        :estructura="estructura"
        v-model:value="selected"
        :gestion="gestion"
        :entidad="entidad"
        @creado="closeModal"
        @cancelar="cancelarModal"
    />
    <q-dialog v-model="dialogCronograma" persistent>
      <q-card style="width: 1200px; max-width: 80vw;">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar :icon="seguimiento ? 'task' : 'event'" color="primary" text-color="white" />
          <span class="q-ml-md">{{ seguimiento ? 'Evaluación' : 'Cronograma' }}</span>
        </q-toolbar-title>
        <q-btn flat round dense icon="close" @click="actualizar" />
      </q-toolbar>
        <q-card-section class="row items-center">
          <Cronograma
            v-if="!seguimiento"
            v-model:value="cronograma"
            :readonly="true"
          />
          <CronogramaSeguimiento
            v-if="seguimiento"
            v-model:value="cronograma"
            :seguimiento="informacionSeguimiento"
            :operacion="selected"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" @click="actualizar"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>
<script>
import { ref, onMounted, inject } from 'vue'
import Operacion from '@components/Planificacion/Estructura/Operacion'
import Cronograma from '../Operacion/Cronograma'
import CronogramaSeguimiento from '../Operacion/CronogramaSeguimiento.vue'

import { date, useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
const { formatDate } = date

const columns = [
  {
    name: 'acciones',
    label: 'Acciones',
    sortable: false,
    align: 'center'
  },
  {
    name: 'codigo',
    label: 'Código',
    sortable: false,
    align: 'center'
  },
  {
    name: 'resultadoIntermedio',
    label: 'Proyectos',
    sortable: false,
    align: 'center'
  },
  {
    name: 'fechas',
    label: 'Fechas',
    sortable: false,
    align: 'center'
  },
  {
    name: 'indicador',
    label: 'Indicador',
    sortable: false,
    align: 'center'
  },
  {
    name: 'meta',
    label: 'Meta',
    sortable: false,
    align: 'center'
  },
  {
    name: 'calificacion',
    label: 'Calificación',
    sortable: false,
    align: 'center'
  },
  {
    name: 'ponderacion',
    label: 'Ponderacion',
    sortable: false,
    align: 'center'
  },
  {
    name: 'tareas',
    label: 'Tareas',
    sortable: false,
    align: 'center'
  },
  {
    name: 'mediosVerificacion',
    label: 'Lineas Base',
    sortable: false,
    align: 'center'
  }
]

export default {
  emits: ['modificado', 'calificacion'],
  props: {
    operaciones: {
      type: Array,
      default: () => []
    },
    formulacion: {
      type: Boolean,
      default: true
    },
    etapa: {
      type: String,
      default: 'EN PROCESO'
    },
    gestion: {
      type: Object,
      default: () => {}
    },
    entidad: {
      type: Object,
      default: () => {}
    },
    informacionSeguimiento: {
      type: Object,
      default: () => {
        return {
          fechaInicio: '01/01/2022',
          fechaFin: '31/03/2022'
        }
      }
    }
  },
  components: {
    Operacion,
    Cronograma,
    CronogramaSeguimiento
  },
  setup (props, { emit }) {
    const $q = useQuasar()
    const _http = inject('http')
    const data = ref([])
    const dialogOperacion = ref(false)
    const selected = ref(null)
    const estructura = ref({})
    const dialogCronograma = ref(false)
    const cronograma = ref([])
    const position = ref()
    const seguimiento = ref(false)
    const router = useRouter()
    const pagination = ref({
      rowsPerPage: -1
    })

    onMounted(() => {
      if (props.operaciones.length === 0) {
        // await getData()
      } else {
        data.value = [...props.operaciones]
      }
      getCalificacion()
    })

    const actualizar = () => {
      data.value[position.value].cronograma = cronograma.value
      dialogCronograma.value = false
      getCalificacion()
    }

    const getCalificacion = () => {
      let calificacion = 0
      for (const item of data.value) {
        let realizado = 0
        for (const itemCronograma of item.cronograma) {
          realizado += parseFloat(itemCronograma.cantidadCumplida) || 0
        }
        item.calificacion = (realizado / item.meta) * 100
        calificacion += item.calificacion * item.ponderacion
      }
      emit('calificacion', calificacion)
    }

    const getData = async () => {
      const url = '/planificacion/operacion'
      const { rows } = await _http.get(url)
      data.value = rows
    }

    const closeModal = () => {
      emit('modificado')
    }

    const cancelarModal = () => {
      selected.value = {}
      estructura.value = {}
      dialogOperacion.value = false
    }

    const editarOperacion = async (data) => {
      const { rows } = await _http.get(`planificacion/cronograma?idOperacion=${data.id}`)
      selected.value = { ...data }
      selected.value.cronograma = rows
      estructura.value = data.estructura
      dialogOperacion.value = true
    }
    const getColorOperacion = (operacion) => {
      return 'positive'
    }

    const openModalCronograma = async (data, index, seg = false) => {
      await getCronograma(data)
      selected.value = data
      seguimiento.value = seg
      position.value = index
      dialogCronograma.value = true
    }

    const getCronograma = async (data, index) => {
      const { rows } = await _http.get(`planificacion/cronograma?idOperacion=${data.id}`)
      cronograma.value = rows
    }

    const eliminarOperacion = async (operacion) => {
      $q.dialog({
        html: true,
        title: '<i class="q-icon text-orange material-icons" style="font-size: 35px;">gpp_maybe</i> <b class="q-mt-md">Confirmación</b>',
        message: '¿Esta seguro de <b>ELIMINAR</b> el registro?.',
        persistent: true,
        ok: {
          color: 'primary',
          label: 'Aceptar'
        },
        cancel: {
          color: 'white',
          'text-color': 'black',
          label: 'Cancelar'
        }
      }).onOk(async () => {
        const respuesta = await _http.delete(`planificacion/operacion/${operacion.id}`)
        if (respuesta) {
          router.go()
        }
      }).onCancel(async () => {
      })
    }

    return {
      columns,
      data,
      formatDate,
      getData,
      dialogOperacion,
      editarOperacion,
      selected,
      estructura,
      closeModal,
      getColorOperacion,
      cancelarModal,
      dialogCronograma,
      openModalCronograma,
      cronograma,
      actualizar,
      eliminarOperacion,
      pagination,
      seguimiento
    }
  }
}
</script>
<style>
.resultado-intermedio th{
  font-weight: bold !important;
}
.badge{
  cursor: pointer;
}
</style>
