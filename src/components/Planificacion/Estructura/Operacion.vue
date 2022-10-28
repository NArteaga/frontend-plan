<template>
  <q-dialog v-model="modal" persistent>
    <q-card style="width: 1200px; max-width: 80vw;">
      <q-toolbar>
        <q-toolbar-title>
          {{ model.id ? "Editar" : "Nueva(o)" }} {{ estructura.nombre }}
        </q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <q-card-section class="q-py-none">
        <q-form ref="myForm" @submit.prevent>
          <q-stepper
            header-class="text-center"
            v-model="step"
            ref="stepper"
            color="info"
            animated
            flat
            class="no-padding"
            done-color="positive"
            inactive-color="grey"
          >
            <q-step
              :name="1"
              title="Datos Generales"
              caption="Datos"
              icon="settings"
              :done="step > 1"
              class="q-pt-none"
            >
              <div class="row q-col-gutter-md">
                <q-select
                  v-if="!estructura.id"
                  v-model="tipoEstructura"
                  :options="optionEstructura"
                  label="Tipo de Plan"
                  filled
                  option-label="nombre"
                  map-options
                  emit-value
                  input-debounce="0"
                  @filter="filterFn"
                  class="required col-xs-12"
                />
                <q-select
                  v-if="visibleOperacionPadre"
                  v-model="model.idOperacionPadre"
                  :options="optionsPadre"
                  emit-value
                  map-options
                  label="Estructura Padre"
                  filled
                  class="required col-xs-12"
                >
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label
                          >{{ scope.opt.codigo }}
                          {{ scope.opt.descripcion }}</q-item-label
                        >
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:selected-item="scope">
                    {{ scope.opt.codigo }} {{ scope.opt.descripcion }}
                  </template>
                </q-select>
                <q-select
                  v-if="(estructura.areaRequerida || tipoEstructura?.areaRequerida) && !entidad?.id"
                  v-model="model.entidad"
                  :options="optionsAreas"
                  label="Intituciones"
                  filled
                  option-label="nombre"
                  map-options
                  emit-value
                  use-input
                  input-debounce="0"
                  @filter="filterFn"
                  class="required col-xs-12"
                />
                <q-input
                  v-if="estructura.codigoManual || tipoEstructura?.codigoManual || (model?.activo !== undefined && !model.activo)"
                  :readonly="!estructura.codigoManual && model.activo"
                  v-model="model.codigo"
                  label="Codigo"
                  filled
                  class="required col-xs-12  q-pb-xs"
                  :rules="rules.requerido"
                />
                <q-input
                  v-model="model.descripcion"
                  label="Descripcion"
                  type="textarea"
                  filled
                  autogrow
                  rows="1"
                  class="required col-xs-12 q-pb-xs"
                  :rules="rules.requerido"
                />
                <q-select
                  v-model="model.tipoMeta"
                  :options="['PORCENTUAL', 'NUMERICO']"
                  label="Tipo Meta"
                  filled
                  class="required col-xs-4 q-pb-xs"
                  :rules="rules.requerido"
                />
                <q-input
                  v-model="model.meta"
                  label="Meta"
                  type="number"
                  filled
                  class="required col-xs-4 q-pb-xs"
                  :rules="model.tipoMeta === 'NUMERICO' ? rules.requerido : rules.ponderacion"
                />
                <q-input
                  v-model="model.ponderacion"
                  label="Ponderacion"
                  type="number"
                  filled
                  min="0"
                  max="100"
                  class="required col-xs-4 q-pb-xs"
                  :rules="rules.ponderacion"
                />
                <DateField
                  v-model:value="model.fechaInicio"
                  label="Fecha Inicio"
                  classe="required col-xs-6"
                  :rules="rules.requerido"
                  :minDate="minDate"
                  :maxDate="model.fechaFin || maxDate"
                />
                <DateField
                  v-model:value="model.fechaFin"
                  label="Fecha Fin"
                  class="required col-xs-6"
                  :rules="rules.requerido"
                  :minDate="model.fechaInicio || minDate"
                  :maxDate="maxDate"
                />
              </div>
            </q-step>
            <q-step
              v-if="estructura.cronograma"
              :name="2"
              title="Cronograma"
              icon="event"
              :done="step > 2"
              class="q-pt-none"
            >
              <Informacion
                class="q-pb-md"
                :operacion="model"
              />
              <div class="row">
                <Cronograma
                  v-if="estructura.cronograma"
                  v-model:value="model.cronograma"
                  :inicio="model.fechaInicio"
                  :fin="model.fechaFin"
                  @suma="verificarMeta"
                />
              </div>
            </q-step>
            <q-step
              :name="3"
              title=" Tareas / Lineas Base"
              icon="task"
              v-if="estructura.cronograma"
              :done="step > 3"
              class="q-pt-none"
            >
              <Informacion
                class="q-pb-md"
                :operacion="model"
              />
              <div class="row q-col-gutter-md">
                <div class="col-xs-6">
                  <Tareas v-model:value="model.tareas" titulo="Tarea(s)" />
                </div>
                <div class="col-xs-6">
                  <Tareas
                    v-model:value="model.mediosVerificacion"
                    titulo="Linea(s) Base"
                  />
                </div>
              </div>
            </q-step>
            <template v-slot:navigation>
              <q-stepper-navigation align="right" class="row q-gutter-md">
                <q-btn
                  @click="$emit('cancelar')"
                  label="Cancelar"
                  icon="close"
                  class="q-ml-sm"
                  flat
                  color="negative"
                />
                <q-space />
                <q-btn
                  v-if="step > 1"
                  @click="anterior"
                  label="Atras"
                  icon="navigate_before"
                  class="q-ml-sm"
                />
                <q-btn
                  v-if="estructura.cronograma"
                  @click="siguiente(props)"
                  color="primary"
                  :icon="step === 3 ? 'save' : 'navigate_next'"
                  :label="step === 3 ? 'Guardar' : 'Siguiente'"
                />
                <q-btn
                  v-if="!estructura.cronograma"
                  color="primary"
                  icon="save"
                  label="Guardar"
                  @click="save"
                />
              </q-stepper-navigation>
            </template>
          </q-stepper>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
import { useVModel } from 'src/composables/useVModel'
import { ref, inject, onMounted } from 'vue'
import validaciones from '@common/validations'
import DateField from '@components/common/DateField'
import Informacion from '../Operacion/Informacion'
import Cronograma from '../Operacion/Cronograma'
import Tareas from '../Operacion/Tareas'
import { useQuasar } from 'quasar'

const rules = {
  requerido: [validaciones.requerido],
  ponderacion: [
    validaciones.requerido,
    validaciones.numeros,
    validaciones.ponderacion
  ]
}
export default {
  props: {
    estructura: {
      type: Object,
      default: () => {
        return {}
      }
    },
    dialog: {
      type: Boolean,
      default: false
    },
    gestion: {
      type: Object,
      default: () => {}
    },
    value: {
      type: Object,
      default: () => {
        return {
          id: null,
          idOperacionPadre: null
        }
      }
    },
    unidadesOrganizacionales: {
      type: Array,
      default: () => []
    },
    entidad: {
      type: Object,
      default: () => {}
    },
    idFormulacion: {
      type: String,
      default: null
    }
  },
  components: {
    DateField,
    Informacion,
    Cronograma,
    Tareas
  },
  setup (props, { emit }) {
    const $q = useQuasar()
    const _http = inject('http')
    const modal = useVModel(props, 'dialog')
    const model = useVModel(props, 'value')
    const myForm = ref(null)
    const areas = ref([])
    const optionsAreas = ref([])
    const optionsPadre = ref([])
    const optionsActual = ref([])
    const sumaCronograma = ref(0)
    const minDate = ref()
    const maxDate = ref()
    const tipoEstructura = ref()
    const optionEstructura = ref([])
    const visibleOperacionPadre = ref(
      props.estructura.nivel > 1 && !model.value?.idOperacionPadre)

    const step = ref(1)

    onMounted(async () => {
      optionsAreas.value = await getAreas()
      areas.value = optionsAreas.value
      if (props.estructura?.idEstructuraPadre) {
        optionsPadre.value = await getOperaciones(props.estructura.idEstructuraPadre)
      }
      if (!props.estructura.id) {
        optionEstructura.value = await getEstructuraBase()
      }
      if (props?.entidad?.id) {
        model.value.entidad = props.entidad
      }
      if (props.estructura.id) {
        optionsActual.value = await getOperaciones(props.estructura.id, model.value?.idOperacionPadre)
      }
      minDate.value = `01/01/${props.gestion.gestion}`
      maxDate.value = `31/12/${props.gestion.gestion}`
      if (!model.value?.fechaInicio) model.value.fechaInicio = `03/01/${props.gestion.gestion}`
      if (!model.value?.fechaFin) model.value.fechaFin = `29/12/${props.gestion.gestion}`
    })

    const getAreas = async () => {
      const { rows } = await _http.get('system/entidades')
      return rows
    }
    const getEstructuraBase = async () => {
      const { rows } = await _http.get(`planificacion/estructura?nivel=1&idGestion=${props.gestion.id}`)
      return rows
    }
    const getOperaciones = async (estructura, operacion = null) => {
      let query = `?idEstructura=${estructura}`
      if (operacion) {
        query += `&idOperacionPadre=${operacion}`
      }
      const { rows } = await _http.get(`planificacion/operacion${query}`)
      return rows
    }

    const save = async () => {
      myForm.value.validate().then(async success => {
        if (success) {
          if (props?.estructura?.id) model.value.idEstructura = props.estructura.id
          else model.value.idEstructura = tipoEstructura.value.id
          const data = { ...model.value }
          if (props.idUnidadOrganizacional) {
            data.idUnidadOrganizacional = props.idUnidadOrganizacional
          }
          data.idOperacionPadre =
            typeof model.value.idOperacionPadre === 'object'
              ? model.value.idOperacionPadre?.id
              : model.value.idOperacionPadre
          if (model.value.id) {
            delete data.id
            const respuesta = await _http.put(
              `planificacion/operacion/${model.value.id}`,
              data
            )
            if (respuesta) {
              emit('creado')
            }
          } else {
            if (props.idFormulacion) {
              data.idFormulacion = props.idFormulacion
            }
            const respuesta = await _http.post('planificacion/operacion', data)
            if (respuesta) {
              emit('creado')
            }
          }
        } else {
          // oh no, user has filled in
          // at least one invalid value
        }
      })
    }

    const siguiente = data => {
      myForm.value.validate().then(success => {
        if (success) {
          if (step.value === 2) {
            if (sumaCronograma.value > model.value.meta || sumaCronograma.value < model.value.meta) {
              $q.notify({
                group: 'cronograma',
                position: 'top-right',
                type: 'negative',
                message: `La sumatoria del cronograma es ${sumaCronograma.value} debe ser igual a ${model.value.meta}`
              })
              return
            }
          }
          if (step.value === 3) {
            save()
          } else {
            step.value += 1
          }
        } else {
        // oh no, user has filled in
        // at least one invalid value
        }
      })
    }

    const anterior = data => {
      step.value -= 1
    }

    const verificarMeta = (suma) => {
      sumaCronograma.value = suma
      if (suma > model.value.meta) {
        $q.notify({
          position: 'top-right',
          type: 'negative',
          message: `La sumatoria del cronograma es ${suma} no puede ser mayor a ${model.value.meta}`
        })
      }
    }

    const updateDescripcion = (value) => {
      // model.value.desc
    }

    return {
      modal,
      model,
      rules,
      myForm,
      sumaCronograma,
      optionsAreas,
      optionsPadre,
      minDate,
      maxDate,
      optionsActual,
      visibleOperacionPadre,
      tipoEstructura,
      optionEstructura,
      filterFn (val, update) {
        if (val === '') {
          update(() => {
            optionsAreas.value = areas.value
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          const tmp = areas.value
          optionsAreas.value = tmp.filter(
            v => v.nombre_area.toLowerCase().indexOf(needle) > -1
          )
        })
      },
      save,
      step,
      siguiente,
      anterior,
      verificarMeta,
      updateDescripcion
    }
  }
}
</script>
<style>
.q-stepper--horizontal .q-stepper__step-inner {
    padding: 0px 24px 24px 24px;
}
</style>
