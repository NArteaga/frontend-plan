<template>
  <q-page>
    <Titulo
      titulo="Dashboard"
      icono="dashboard"
    />

    <div class="row">
      <div class="col-xs-12 col-md-6">
        <q-card class="q-ma-md">
          <q-card-section>
            <div class="row">
              <q-item class="col-xs-4 col-md-4">
                <q-item-section>
                  <q-item-label caption><b>Gestion Activa:</b></q-item-label>
                  <q-item-label>{{data?.gestion.gestion}}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="col-xs-4 col-md-4">
                <q-item-section>
                  <q-item-label caption><b>Etapa Gestion:</b></q-item-label>
                  <q-item-label>{{data?.gestion.etapa}}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="col-xs-4 col-md-4">
                <q-item-section>
                  <q-item-label caption><b>Estado:</b></q-item-label>
                  <q-item-label>
                    <Estado :label="data?.formulacion.etapa"/>
                  </q-item-label>
                </q-item-section>
              </q-item>
              <TiempoRestante
              v-if="data?.formulacion.etapa === 'EN PROCESO'"
              :formulacion="data?.formulacion"
              />
            </div>
            <div class="row justify-end">
              <div class="col-xs-6 text-right">
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-4 col-md-4">
        <q-card class="q-ma-md">
          <q-card-section>
            <div class="row justify-left">
              <div class="col-xs-4 text-center">
                <q-icon size="70px" name="domain" />
              </div>
              <div class="col-xs-8">
                <div class="row">
                  <div class="col-xs-12 text-center">
                    INSTITUCIONES REGISTRADAS
                  </div>
                </div>
                <div class="row q-py-none">
                  <div class="col-xs-12 text-center">
                    <h3 class="q-my-none">{{ entidades?.rows?.length }}</h3>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-xs-8">
        <apexchart
          width="90%"
          height="450"
          type="bar"
          :options="chartOptions"
          :series="series" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { inject, onMounted, ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import TiempoRestante from '@components/Planificacion/Formulacion/TiempoRestante'
import Estado from '@components/Planificacion/Formulacion/Estado'

export default {
  name: 'Dashboard',
  components: {
    Estado,
    TiempoRestante,
    apexchart: VueApexCharts
  },
  setup () {
    const Http = inject('http')
    const data = ref(null)
    const entidades = ref(null)
    const _storage = inject('storage')
    const dialogConfiguracionArea = ref(false)
    const categories = ref([])
    const pe = ref([])
    const po = ref([])
    const pt = ref([])
    const unidadOrganizacional = ref({
      idEntidad: null,
      idAreaPadre: null,
      nombreArea: null,
      sigla: null,
      usuarioResponsable: null,
      nivel: 0,
      configuracion: [],
      estado: 'ACTIVO'
    })

    onMounted(async () => {
      await getGestionActiva()
      await getEntidades()
      await getCalificaciones()
    })

    const getCalificaciones = async () => {
      const calificaciones = await Http.get(`planificacion/operacion/${data.value.gestion.id}/calificaciones`)
      for (const index in calificaciones) {
        categories.value.push(index)
        if (!calificaciones[index]['PLAN ESTRATÉGICO']) pe.value.push(0)
        else pe.value.push(calificaciones[index]['PLAN ESTRATÉGICO'])
        if (!calificaciones[index]['PLAN TÁCTICO']) pt.value.push(0)
        else pt.value.push(calificaciones[index]['PLAN TÁCTICO'])
        if (!calificaciones[index]['PLAN OPERATIVO']) po.value.push(0)
        else po.value.push(calificaciones[index]['PLAN OPERATIVO'])
      }
    }

    const getEntidades = async () => {
      entidades.value = await Http.get('system/entidades?estado=ACTIVO')
    }

    const getGestionActiva = async () => {
      data.value = await Http.get(`planificacion/gestion/etapa-activa?idEntidad=${_storage.get('usuario').idEntidad}`)
    }

    async function closeModalConfiguracionModal () {
      dialogConfiguracionArea.value = false
    }

    return {
      closeModalConfiguracionModal,
      dialogConfiguracionArea,
      unidadOrganizacional,
      entidades,
      data,
      chartOptions: {
        chart: {
          type: 'bar',
          height: 200
        },
        plotOptions: {
          bar: {
            horizontal: true,
            dataLabels: {
              position: 'bottom'
            }
          }
        },
        dataLabels: {
          enabled: true,
          textAnchor: 'start',
          style: {
            colors: ['#fff']
          },
          formatter: function (val, opt) {
            return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val
          },
          offsetX: 0,
          dropShadow: {
            enabled: true
          }
        },
        stroke: {
          show: true,
          width: 1,
          colors: ['#fff']
        },
        tooltip: {
          shared: true,
          intersect: false
        },
        xaxis: {
          categories: categories.value
        },
        yaxis: {
          labels: {
            show: false
          }
        },
        title: {
          text: 'Evaluaciones de los Planes',
          align: 'center',
          floating: true
        }
      },
      series: [
        {
          name: 'Plan Estratégico',
          data: pe.value
        },
        {
          name: 'Plan Operativo',
          data: po.value
        },
        {
          name: 'Plan Táctico',
          data: pt.value
        }
      ]
    }
  }
}
</script>
