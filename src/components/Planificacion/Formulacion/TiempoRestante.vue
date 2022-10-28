<template>
     <q-item class="col-xs-12 col-md-12" v-if="tiempoRestante.minutos>=0">
        <q-item-section>
            <q-item-label class="text-grey-7"><b>Tiempo Restante para {{formulacion.tipo}}:</b></q-item-label>
            <q-item-label class="timer">
            <div class="day">
                <span class="number">{{tiempoRestante.dias}}</span>
                <div class="format">Días</div>
            </div>
            <div class="hour">
                <span class="number">{{tiempoRestante.horas}}</span>
                <div class="format">Hrs.</div>
            </div>
            <div class="min">
                <span class="number">{{tiempoRestante.minutos}}</span>
                <div class="format">Min.</div>
            </div>
            <div class="sec">
                <span class="number">{{tiempoRestante.segundos}}</span>
                <div class="format">Seg.</div>
            </div>
            </q-item-label>
        </q-item-section>
    </q-item>
</template>
<script>
import { onBeforeUnmount, onMounted, ref } from 'vue'
let interval = null
export default {
  props: {
    formulacion: {
      type: Object,
      default: () => ({
        fechaFin: null
      })
    }
  },
  setup (props) {
    const tiempoRestante = ref({
      dias: '',
      horas: '',
      minutos: '',
      segundos: ''
    })

    onMounted(() => {
      getTiempoRestante(props.formulacion)
      interval = setInterval(() => {
        getTiempoRestante(props.formulacion)
      }, 1000)
    })

    onBeforeUnmount(() => {
      clearInterval(interval)
    })

    const getTiempoRestante = (formulacion) => {
      const ahora = Date.now()
      const [day, month, year] = formulacion.fechaFin.split('/')
      const fin = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 23, 59, 59, 999).getTime()
      calcularTiempo(fin - ahora)
    }

    const calcularTiempo = (val) => {
      tiempoRestante.value = {
        dias: Math.floor(val / (1000 * 60 * 60 * 24)),
        horas: Math.floor((val % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutos: Math.floor((val % (1000 * 60 * 60)) / (1000 * 60)),
        segundos: Math.floor((val % (1000 * 60)) / 1000)
      }
    }

    return {
      tiempoRestante
    }
  }
}
</script>
