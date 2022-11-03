<template>
  <q-dialog v-model="dialog" persistent>
    <q-card style="width: 700px; max-width: 80vw">
      <q-toolbar>
        <q-toolbar-title class="text-h6 text-weight-medium">
          Presupuestos
        </q-toolbar-title>
        <q-btn flat round dense icon="close" @click="$emit('closeModal')" />
      </q-toolbar>
      <q-card-section class="q-px-lg q-pb-none items-center">
        <div class="row">
          <div class="col-md-12 col-xs-12">
            <div class="row bg-orange-2 q-py-md">
              <div class="col-xs-12 q-px-md">
                <span class="text-subtitle1 text-weight-bold text-primary"> Información de Presupuesto de la Operación {{ model.codigo }}</span>
              </div>
              <q-item class="col-xs-4 col-md-4 col-lg-4">
                <q-item-section >
                  <q-item-label caption><b>Monto Presupuestado en la Institucion:</b></q-item-label>
                  <q-item-label >Bs. {{montoInstitucion}}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="col-xs-4 col-md-4 col-lg-4">
                <q-item-section >
                  <q-item-label caption><b>Monto Presupuestado en la Operación:</b></q-item-label>
                  <q-item-label >Bs. {{montoOperacion}}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="col-xs-4 col-md-4 col-lg-4">
                <q-item-section >
                  <q-item-label caption><b>Monto Ejecutado de la Operación:</b></q-item-label>
                  <q-item-label >Bs. {{montoOperacionEjecutado}}</q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-gutter-md">
        <div class="text-center text-grey" >
          <q-btn class="q-mt-md full-width" push outline color="primary" icon="add" label="AGREGAR PRESUPUESTO" @click="openModal()" />
        </div>
        <q-table
          class="my-sticky-header-table"
          :rows="presupuestos"
          :columns="columns"
          row-key="partida"
          :pagination="pagination"
          hide-pagination
          :rows-per-page-options="[0]"
          separator="vertical">
          <template v-slot:body="props">
            <q-tr>
              <q-td>
                <q-btn
                  class="q-pa-xs"
                  flat
                  round
                  icon="edit"
                  @click="openModal(row)"
                />
                <q-btn
                  class="q-pa-xs"
                  flat
                  round
                  color="negative"
                  icon="delete"
                  @click="eliminar({ url: `${url}/${row.id}` })"
                />
              </q-td>
              <q-td>{{ props.row.descripcion }}</q-td>
              <q-td>{{ props.row.organismoFinanciador.nombre }}</q-td>
              <q-td>{{ props.row.partidaPresupuestaria.codigo }}</q-td>
              <q-td>{{ props.row.montoInicial }}</q-td>
              <q-td>{{ props.row.montoOficial }}</q-td>
              <q-td>{{ props.row.saldo }}</q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-dialog>
  <ItemPresupuesto
    v-if="dialogItem"
    :open="dialogItem"
    :value="selected"
    @closeModal="closeItem"
    @guardar="guardar" />
</template>
<script>
import ItemPresupuesto from '@components/Financiera/ItemPresupuesto'
import validaciones from '@common/validations'
import { useVModel } from 'src/composables/useVModel'
import { inject, ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
const rules = {
  requerido: [validaciones.requerido]
}
const columns = [
  {
    name: 'accion',
    label: 'Acción',
    align: 'center'
  },
  {
    name: 'descripcion',
    label: 'Descripción',
    align: 'center'
  },
  {
    name: 'organismo',
    label: 'Organismo Financiador',
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
    name: 'saldo',
    label: 'Saldo',
    align: 'center'
  }
]
export default {
  emits: ['closeModal'],
  components: {
    ItemPresupuesto
  },
  props: {
    value: {
      type: Object,
      defaultValue: () => {}
    },
    open: {
      type: Boolean,
      defaultValue: false
    },
    entidad: {
      type: Object,
      defaultValue: () => {}
    }
  },
  setup (props) {
    const model = useVModel(props, 'value')
    const dialog = useVModel(props, 'open')
    const dialogItem = ref(false)
    const _http = inject('http')
    const url = ref('financiera/presupuesto')
    const presupuestos = ref([])
    const selected = ref({})
    const montoInstitucion = ref(0)
    const montoOperacion = ref(0)
    const $q = useQuasar()
    const montoOperacionEjecutado = ref(0)
    onMounted(async () => {
      await refresh()
    })
    const refresh = async () => {
      let montoOpe = 0
      let montoIns = 0
      let montoOpeEj = 0
      const tmpPresupuesto = []
      const presupuesto = await getPresupuesto()
      for (const item of presupuesto) {
        if (item.idOperacion === model.value.id) {
          montoOpe += parseFloat(item.montoOficial)
          montoOpeEj += parseFloat(item.montoEjecutado)
          tmpPresupuesto.push(item)
        }
        montoIns += parseFloat(item.montoOficial)
      }
      montoInstitucion.value = montoIns
      montoOperacion.value = montoOpe
      montoOperacionEjecutado.value = montoOpeEj
      presupuestos.value = tmpPresupuesto
    }
    const openModal = (row) => {
      if (row) selected.value = row
      else selected.value = { idOperacion: model.value.id }
      console.log(selected.value)
      dialogItem.value = true
    }
    const eliminar = async (row) => {
      $q.dialog({
        title: 'Confirmacion',
        message: '¿Esta seguro de eliminar el presupuesto?',
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
        await _http.delete(row.url)
        await refresh()
      }).onCancel(async () => {})
    }
    const closeItem = () => {
      selected.value = {}
      dialogItem.value = false
    }
    const getPresupuesto = async () => {
      const { rows } = await _http.get(_http.convertQuery(url.value, { idEntidad: props.entidad.id }))
      return rows
    }
    const guardar = async (row) => {
      console.log(row)
      if (row.id) await _http.put(`${url.value}/${row.id}`, row)
      else await _http.post(url.value, row)
      refresh()
      closeItem()
    }
    return {
      rules,
      model,
      dialog,
      openModal,
      montoInstitucion,
      montoOperacion,
      montoOperacionEjecutado,
      presupuestos,
      columns,
      pagination: {
        rowsPerPage: 0
      },
      dialogItem,
      selected,
      closeItem,
      guardar,
      eliminar,
      url
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
