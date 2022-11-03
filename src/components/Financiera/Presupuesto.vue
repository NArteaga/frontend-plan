<template>
  <div class="q-pa-md col-xs-12 q-gutter-md">
    <div class="q-pa-md row q-col-gutter-md">
      <q-select
        v-model="filter.idOrganismoFinanciador"
        :options="optionsOrganismo"
        label="Organismo Financiador"
        class="col-xs-6"
        filled
        option-value="id"
        option-label="nombre"
        option-disable="inactive"
        emit-value
        map-options
        @update:model-value="update"
      />
      <q-select
        v-model="filter.idPartidaPresupuestaria"
        :options="optionsPartida"
        label="Partida Presupuestaria"
        class="col-xs-6"
        filled
        option-label="nombre"
        option-value="id"
        map-options
        emit-value
        @update:model-value="update"
      />
    </div>
    <q-list bordered class="rounded-borders row">
      <q-expansion-item
        default-opened
        v-for="(row, index) of Object.keys(presupuestos)"
        :key="index"
        expand-separator
        class="col-xs-12"
        :label="row"
      >
        <q-card>
          <q-table
            class="my-sticky-header-table"
            :rows="Object.values(presupuestos[row])"
            :columns="columns"
            row-key="partida"
            :pagination="pagination"
            hide-pagination
            :rows-per-page-options="[0]"
            separator="vertical">
            <template v-slot:body="props">
              <q-tr>
                <q-td>{{ props.row.codigo }}</q-td>
                <q-td>{{ props.row.nombre }}</q-td>
                <q-td>{{ props.row.montoInicial }}</q-td>
                <q-td>{{ props.row.montoOficial }}</q-td>
                <q-td>{{ props.row.montoEjecutado }}</q-td>
                <q-td>{{ props.row.saldo }}</q-td>
              </q-tr>
            </template>
            <template v-slot:bottom-row>
              <q-tr>
                <q-th colspan="2"><b>Totales</b></q-th>
                <q-th><b>{{ totales[row].montoInicial }}</b></q-th>
                <q-th><b>{{ totales[row].montoOficial }}</b></q-th>
                <q-th><b>{{ totales[row].montoEjecutado }}</b></q-th>
                <q-th><b>{{ totales[row].saldo }}</b></q-th>
              </q-tr>
            </template>
          </q-table>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
</template>
<script>
import { ref, inject, onMounted } from 'vue'
const columns = [
  {
    name: 'codigo',
    label: 'Codigo',
    align: 'center'
  },
  {
    name: 'partida',
    label: 'Partida Presupuestaria',
    align: 'center'
  },
  {
    name: 'montoInicial',
    label: 'Monto Inicial',
    align: 'center'
  },
  {
    name: 'montoOficial',
    label: 'Monto Oficial',
    align: 'center'
  },
  {
    name: 'montoEjecutado',
    label: 'Monto Ejecutado',
    align: 'center'
  },
  {
    name: 'saldo',
    label: 'Saldo',
    align: 'center'
  }
]
export default {
  setup () {
    const presupuestos = ref({})
    const optionsOrganismo = ref([])
    const optionsPartida = ref([])
    const totales = ref({})
    const filter = ref({})
    const _http = inject('http')

    onMounted(async () => {
      const presupuesto = await getPresupuesto({})
      optionsOrganismo.value = await getOrganismoFinanciador()
      optionsPartida.value = await getPartida()
      convertData(presupuesto)
    })

    const getOrganismoFinanciador = async () => {
      const { rows } = await _http.get('financiera/organismo-financiador')
      return rows
    }

    const getPartida = async () => {
      const { rows } = await _http.get('financiera/partida-presupuestaria')
      return rows
    }

    const update = async () => {
      const presupuesto = await getPresupuesto(filter.value)
      convertData(presupuesto)
    }

    const convertData = (presupuesto) => {
      console.log(presupuesto)
      for (const item of presupuesto) {
        const orgfin = `${item.organismoFinanciador.sigla} ${item.organismoFinanciador.nombre}`
        const parPres = `${item.partidaPresupuestaria.codigo} ${item.partidaPresupuestaria.nombre}`
        if (!(orgfin in presupuestos.value)) {
          presupuestos.value[orgfin] = {}
          totales.value[orgfin] = {
            montoInicial: 0,
            montoOficial: 0,
            montoEjecutado: 0,
            saldo: 0
          }
        }
        if (!(parPres in presupuestos.value[orgfin])) {
          presupuestos.value[orgfin][parPres] = {
            codigo: item.partidaPresupuestaria.codigo,
            nombre: item.partidaPresupuestaria.nombre,
            montoInicial: 0,
            montoOficial: 0,
            montoEjecutado: 0,
            saldo: 0,
            presupuesto: []
          }
        }
        presupuestos.value[orgfin][parPres].presupuesto.push(item)
        presupuestos.value[orgfin][parPres].montoOficial += parseFloat(item.montoOficial)
        presupuestos.value[orgfin][parPres].montoInicial += parseFloat(item.montoInicial)
        presupuestos.value[orgfin][parPres].montoEjecutado += parseFloat(item.montoEjecutado)
        presupuestos.value[orgfin][parPres].saldo += parseFloat(item.saldo)
        totales.value[orgfin].montoOficial += parseFloat(item.montoOficial)
        totales.value[orgfin].montoInicial += parseFloat(item.montoInicial)
        totales.value[orgfin].montoEjecutado += parseFloat(item.montoEjecutado)
        totales.value[orgfin].saldo += parseFloat(item.saldo)
      }
    }

    const getPresupuesto = async (query) => {
      const { rows } = await _http.get(_http.convertQuery('financiera/presupuesto', query))
      return rows
    }
    return {
      presupuestos,
      optionsOrganismo,
      optionsPartida,
      totales,
      columns,
      filter,
      update,
      pagination: {
        rowsPerPage: 0
      }
    }
  }
}
</script>
<style lang="sass">
.my-sticky-header-table
  .q-table__top,
  tr th
    font-weight: 700
    background-color: #ce93d8
</style>
