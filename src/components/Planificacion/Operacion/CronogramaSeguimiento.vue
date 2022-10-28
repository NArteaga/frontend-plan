<template>
<div class="col-xs-12" v-if="consultado">

        <InformacionOperacion
          :operacion="operacion"
        />

        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="event" label="Cronograma" />
          <q-tab name="task" label="Presupuesto" />
        </q-tabs>

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="event" class="q-pt-sm">
           <q-table
                :rows="cronogramas"
                :columns="columns"
                table-header-class="font-bold text-white bg-primary q-my-md"
                :wrap-cells="true"
                :pagination="pagination"
                dense
                hide-bottom
                flat
            >
                <template v-slot:body="{ row,rowIndex }">
                    <q-tr :class="{'bg-teal-3':row.mes>=minimo && row.mes<=maximo}">
                        <td class="text-weight-bolder" style="width:120px">{{ meses[rowIndex]}}</td>
                        <td class="text-center" style="width:120px">{{ row.cantidadProgramada }}</td>
                        <td class="text-center q-px-none q-mx-none" style="width:120px">
                            <q-input
                                v-if="row.mes>=minimo && row.mes<=maximo"
                                v-model="row.cantidadCumplida"
                                type="number"
                                placeholder="Ingrese Cantidad Avanzada"
                                filled
                                round
                                class="bg-grey-4 q-px-none q-mx-none"
                                dense
                                @keyup="actualizar(row)"
                            />
                            <p v-else>
                                {{row.cantidadCumplida}}
                            </p>
                        </td>
                        <td >
                            <q-input
                                v-if="row.mes>=minimo && row.mes<=maximo"
                                v-model="row.observacion"
                                type="textarea"
                                filled
                                placeholder="Ingrese el detalle o justificacion del avance"
                                autogrow
                                rows="1"
                                class="bg-grey-4"
                                dense
                                @blur="actualizar(row)"
                                clearable
                            />
                            <p v-else>
                                {{row.observacion}}
                            </p>
                        </td>
                        <td style="width:100px">
                            <Documentos
                                v-model:value="row.documentos"
                                :idCronograma="row.id"
                                :adicionar="row.mes>=minimo && row.mes<=maximo"
                                :mediosVerificacion="operacion.mediosVerificacion"
                            />
                        </td>
                    </q-tr>
                </template>
            </q-table>
          </q-tab-panel>

          <q-tab-panel name="task">
            Ejecucion del presupuesto

          </q-tab-panel>

        </q-tab-panels>

</div>
</template>
<script>
import { onMounted, ref, inject } from 'vue'
import { useVModel } from 'src/composables/useVModel'
import validations from 'src/common/validations'
import Documentos from './DocumentoCronograma'
import InformacionOperacion from './Informacion'
import { useQuasar } from 'quasar'

const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const rules = {
  cronograma: validations.numeros
}

const columns = [
  {
    name: 'mes',
    label: 'Mes',
    sortable: false,
    align: 'center'
  },
  {
    name: 'programado',
    label: 'Programado',
    sortable: false,
    align: 'center'

  },
  {
    name: 'alcanzado',
    label: 'Alcanzado',
    sortable: false,
    align: 'center',
    style: 'width: 150px'
  },
  {
    name: 'detalle',
    label: 'Detalle',
    sortable: false,
    align: 'center'
  },
  {
    name: 'documentos',
    label: 'Documentos',
    sortable: false,
    align: 'center'
  }
]
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    readonly: {
      type: Boolean,
      default: false
    },
    inicio: {
      type: String,
      default: '01/01/2022'
    },
    fin: {
      type: String,
      default: '31/12/2022'
    },
    seguimiento: {
      type: Object,
      default: () => {
        return {
          fechaInicio: '01/01/2022',
          fechaFin: '31/03/2022'
        }
      }
    },
    operacion: {
      type: Object,
      default: () => {}
    }

  },
  components: {
    Documentos,
    InformacionOperacion
  },
  setup (props, { emit }) {
    const _http = inject('http')
    const $q = useQuasar()
    const cronogramas = useVModel(props, 'value')
    const consultado = ref(false)
    const total = ref(0)
    const minimo = ref(1)
    const maximo = ref(12)
    const pagination = ref({
      rowsPerPage: -1
    })
    const tab = ref('event')

    onMounted(() => {
      cronogramas.value.sort((a, b) => a.mes - b.mes)
      minimo.value = parseInt(props.seguimiento.fechaInicio.split('/')[1])
      maximo.value = parseInt(props.seguimiento.fechaFin.split('/')[1])
      sumarTotal()
      consultado.value = true
    })

    const sumarTotal = () => {
      const suma = cronogramas.value.reduce((accumulator, object) => {
        const cantidad = object.cantidadProgramada ? object.cantidadProgramada : 0
        return accumulator + parseFloat(cantidad)
      }, 0)
      total.value = parseFloat(suma.toFixed(2))
      emit('suma', total.value)
    }

    const actualizar = async (data) => {
      if (data?.cantidadCumplida && data?.observacion) {
        const respuesta = await _http.put(`planificacion/cronograma/${data.id}`, data)
        if (respuesta) {
          $q.notify({
            group: 'cronograma',
            position: 'top-right',
            type: 'positive',
            message: 'Informacion actualizada correctamente'
          })
        }
      }
    }

    return {
      consultado,
      meses,
      cronogramas,
      total,
      minimo,
      maximo,
      rules,
      columns,
      sumarTotal,
      pagination,
      actualizar,
      tab
    }
  }
}
</script>
