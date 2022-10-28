<template>
<div class="row q-col-gutter-xs justify-end" v-if="consultado">
    <q-input
        v-for="(cronograma,index) in cronogramas"
        :key="index"
        v-model.number="cronograma.cantidadProgramada"
        :label="meses[index]"
        class="col-xs-3 col-md-2"
        stack-label
        filled
        :readonly="readonly || (cronograma.mes<minimo || cronograma.mes>maximo)"
        @update:model-value="sumarTotal"
        mask="########"
    />
    <div class="col-xs-4 text-rigth">
        <q-input
          readonly
          v-model="total"
          class="col-xs-2 col-md-1"
          stack-label
          filled
        >
          <template v-slot:before>
            <span class="text-subtitle1 text-weight-bold text-primary">TOTAL</span>
          </template>
        </q-input>
    </div>
</div>
</template>
<script>
import { onMounted, ref } from 'vue'
import { useVModel } from 'src/composables/useVModel'
import validations from 'src/common/validations'

const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const rules = {
  cronograma: validations.numeros
}
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
    }
  },
  setup (props, { emit }) {
    const cronogramas = useVModel(props, 'value')
    const consultado = ref(false)
    const total = ref(0)
    const minimo = ref(1)
    const maximo = ref(12)

    onMounted(() => {
      if (props.value.length === 0) {
        for (let i = 1; i <= 12; i++) {
          cronogramas.value.push({
            mes: i,
            cantidadProgramada: 0
          })
        }
      }
      if (props.value.length < 12) {
        for (let i = 1; i <= 12; i++) {
          const existeMes = cronogramas.value.find(e => e.mes === i)
          if (!existeMes) {
            cronogramas.value.push({
              mes: i,
              cantidadProgramada: 0
            })
          }
        }
      }
      cronogramas.value.sort((a, b) => a.mes - b.mes)
      minimo.value = parseInt(props.inicio.split('/')[1])
      maximo.value = parseInt(props.fin.split('/')[1])
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

    return {
      consultado,
      meses,
      cronogramas,
      total,
      minimo,
      maximo,
      rules,
      sumarTotal
    }
  }
}
</script>
