<template>
    <q-input
        filled
        v-model="date"
        :rules="rules"
        :label="label"
        :class="classe"
        mask="##/##/####"
        readonly
        placeholder="DD/MM/YYYY"
        stack-label
    >
        <q-popup-proxy :breakpoint="600">
            <q-date v-model="date" mask="DD/MM/YYYY" :locale="myLocale" today-btn :options="optionsFn">
                <div class="row items-center justify-end q-py-none q-my-none">
                <q-btn v-close-popup label="cerrar" color="primary" flat />
                </div>
            </q-date>
        </q-popup-proxy>
        <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="date" mask="DD/MM/YYYY" :locale="myLocale" :options="optionsFn">
                    <div class="row items-center justify-end q-py-none q-my-none">
                        <q-btn v-close-popup label="cerrar" color="primary" flat />
                    </div>
                </q-date>
            </q-popup-proxy>
            </q-icon>
        </template>
    </q-input>
</template>
<script>
import { useVModel } from 'src/composables/useVModel'
import { onMounted } from 'vue'

export default {
  props: {
    classe: String,
    value: String,
    rules: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: 'Fecha'
    },
    minDate: String,
    maxDate: String
  },
  setup (props) {
    const date = useVModel(props, 'value')

    onMounted(() => {
      if (date.value) {
        date.value = date.value.replace('-', '/')
      }
    })

    return {
      date,
      myLocale: {
        /* starting with Sunday */
        days: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
        daysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
        months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
        monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
        firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
        format24h: true,
        pluralDay: 'dias'
      },
      optionsFn (date) {
        let valido = true
        if (props.minDate) {
          const [day, month, year] = props.minDate.split('/')
          if (date < `${year}/${month}/${day}`) {
            valido = false
          }
        }
        if (props.maxDate) {
          const [day, month, year] = props.maxDate.split('/')
          if (date > `${year}/${month}/${day}`) {
            valido = false
          }
        }
        return valido
      }
    }
  }
}
</script>
<style>
.q-date__view {
    padding-bottom: 0px;
}
</style>
