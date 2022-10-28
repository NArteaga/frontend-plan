<template>
  <q-card>
    <q-expansion-item default-opened>
      <template v-slot:header>
        <q-item-section>
          <q-item-label>
            <q-badge v-if="operaciones.codigo" color="indigo-6" dark :label="operaciones.codigo" class="q-mr-sm text-body2" rounded/>
            <b>{{operaciones?.estructura?.nombre}}</b>
          </q-item-label>
          <q-item-label>
            <span class="text-grey-8">{{operaciones.descripcion}}</span>
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-chip
            color="secondary"
            class="text-white"
            size="md"
            :label="`Ponderacion: ${operaciones.ponderacion} %`"
          />
          <q-chip
            v-if="operaciones.calificacion"
            color="secondary"
            class="text-white"
            size="md"
            :label="`Calificación: ${operaciones.calificacion} %`"
          />
          <q-btn
            v-if="operaciones.estructura?.editable && (['EN PROCESO', 'OBSERVADO'].includes(etapa))"
            rounded
            color="orange"
            class="text-white"
            icon="edit"
            flat
            :label="`Editar ${operaciones?.estructura?.nombre}`"
            size="sm"
            @click.stop="editaOperacion(operaciones)" />
          <q-btn
            v-if="operaciones.estructuraHija?.created && (['EN PROCESO', 'OBSERVADO'].includes(etapa))"
            rounded
            color="primary"
            class="q-mt-sm"
            icon="add"
            flat
            :label="`Nuevo ${operaciones?.estructuraHija?.nombre}`"
            size="sm"
            @click.stop="adicionarOperacion(operacion)" />
        </q-item-section>
      </template>
      <q-card>
        <q-card-section class="q-px-sm">
          <template v-if="!operaciones?.estructuraHija?.cronograma">
            <OperacionesPoa
              v-for="(child, index) in operaciones.children"
              v-model:operacion="operaciones.children[index]"
              :etapa="etapa"
              :key="child.id"
              :gestion="gestion"
              :idFormulacion="idFormulacion"
              @actualizar="creado"
              :entidad="entidad"
              :seguimiento="seguimiento" />
          </template>
          <q-card v-else>
            <q-card-section class="q-pa-none">
              <ResultadoIntermedio
                v-if="operaciones.children.length > 0"
                :operaciones="operaciones.children"
                :etapa="etapa"
                :gestion="gestion"
                :entidad="entidad"
                @calificacion="calificaciones"
                @modificado="creado"
                :informacionSeguimiento="seguimiento"
                :formulacion="true" />
              <p class="text-center q-py-md" v-else>
                Sin registros
              </p>
            </q-card-section>
          </q-card>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-card>
  <Operacion
    v-if="dialog"
    v-model:dialog="dialog"
    v-model:value="model"
    :estructura="estructura"
    :idFormulacion="idFormulacion"
    :gestion="gestion"
    :entidad="entidad"
    @creado="creado"
  />
</template>
<script>
import { useVModel } from 'src/composables/useVModel'
import { onMounted, ref, watch, inject } from 'vue'
import ResultadoIntermedio from './ResultadoIntermedio'
import Operacion from '@components/Planificacion/Estructura/Operacion'
import { useStore } from 'vuex'
// import { useRouter } from 'vue-router'

export default {
  name: 'OperacionesPoa',
  emits: ['actualizar', 'creado'],
  props: {
    operacion: Object,
    formulacion: {
      type: Boolean,
      default: false
    },
    gestion: {
      type: Object,
      default: () => {}
    },
    etapa: {
      type: String,
      default: 'EN PROCESO'
    },
    tipo: {
      type: String
    },
    entidad: {
      type: Object,
      default: () => {}
    },
    idFormulacion: {
      type: String,
      default: null
    },
    seguimiento: Object
  },
  components: {
    ResultadoIntermedio,
    Operacion
  },
  setup (props, { emit }) {
    const model = ref({
      cronograma: [],
      tareas: [],
      mediosVerificacion: [],
      bienServicioDemandado: []
    })
    const _http = inject('http')
    const dialog = ref(false)
    const store = useStore()
    const estructura = ref({})
    const calificacion = ref()
    const operaciones = useVModel(props, 'operacion')
    // const router = useRouter()

    onMounted(async () => {
    })

    watch(props, () => {
      let result = 0
      for (const child of operaciones.value.children) {
        result += child.calificacion * child.ponderacion / 100
      }
      operaciones.value.calificacion = result
    })

    const adicionarOperacion = async (operacion) => {
      if (operacion?.estructuraHija?.id) {
        const result = await _http.get(`planificacion/estructura/${operacion.estructuraHija.id}`)
        estructura.value = result
      } else estructura.value = store.getters['global/getUltimoNivel']
      model.value = {
        idOperacionPadre: null,
        cronograma: [],
        tareas: [],
        mediosVerificacion: [],
        bienServicioDemandado: []
      }
      model.value.idOperacionPadre = operacion.id
      dialog.value = true
    }

    const calificaciones = (result) => {
      operaciones.value.calificacion = result
    }

    const editaOperacion = (operacion) => {
      estructura.value = operacion.estructura
      model.value = operacion
      dialog.value = true
    }

    const actualizar = () => {
      emit('actualizar')
    }

    return {
      model,
      dialog,
      estructura,
      adicionarOperacion,
      editaOperacion,
      operaciones,
      actualizar,
      calificacion,
      calificaciones,
      creado: () => {
        actualizar()
      }
    }
  }
}
</script>
