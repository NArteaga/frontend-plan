<template>
    <q-dialog v-model="modal" persistent>
        <q-card style="width: 1200px; max-width: 90vw;">
            <q-toolbar class="q-pl-lg">
                <q-toolbar-title >
                <span class="text-weight-bold">{{estructura.sigla}} </span> - {{estructura.nombre}}
                </q-toolbar-title>
                <q-btn color="orange" flat :icon="todo?'expand_less':'expand_more'" :label="!todo?'VER TODO':'OCULTAR'" @click="getOperaciones" class="q-mr-md" />
                <q-btn color="primary" icon="add" label="NUEVO" @click="openOperacion" />
                <q-btn class="q-ml-md" flat round dense icon="close" v-close-popup />
            </q-toolbar>
            <q-card-section class="q-pb-none scroll" style="max-height: 80vh" v-if="padres.length>0">
                <q-expansion-item
                  class="q-pt-md"
                  v-for="(padre,index) in padres"
                  :key="padre.id"
                  expand-separator
                  header-class="bg-teal-1 text-primary"
                  :default-opened="opened(index)"
                >
                <template v-slot:header>
                  <q-item-section avatar class="text--center">
                    <b>Código {{padre.estructura.sigla}}</b>
                    <q-chip v-if="padre.codigo" :label="` ${padre.codigo}`" />
                  </q-item-section>

                  <q-item-section>
                    {{padre.descripcion}}
                  </q-item-section>

                  <q-item-section side>
                    <q-chip :label="`${padre.ponderacion} %`" color="primary" dark />
                  </q-item-section>
                </template>
                <q-table
                    :rows="operaciones.filter(e=>e.idOperacionPadre === padre.id)"
                    :columns="columns"
                    row-key="id"
                    wrap-cells
                    no-data-label="No hay registros"
                    flat
                  >
                      <template v-slot:body="{row}">
                          <q-tr>
                              <q-td>
                                  <q-btn flat round color="orange" icon="edit" @click="editOperacion(row)" />
                                    <q-toggle
                                      v-model="row.activo"
                                      color="green"
                                      @click="activarInactivar(row)"
                                    >
                                    </q-toggle>
                                 <q-btn flat round color="negative" icon="delete" @click="eliminarOperacion(row)" />
                              </q-td>
                              <q-td>
                                  {{row.estado}}
                              </q-td>
                              <q-td class="text-center">{{row.codigo}}</q-td>
                              <q-td>{{row.descripcion}}</q-td>
                              <q-td>{{row.entidad.nombre}}</q-td>
                              <q-td class="text-center">{{row.ponderacion}}</q-td>
                          </q-tr>
                      </template>
                  </q-table>
                </q-expansion-item>
            </q-card-section>
            <q-card-section class="q-pb-none scroll" style="max-height: 90vh" v-if="padres.length===0">
              <q-table
                    :rows="operaciones"
                    :columns="columns"
                    row-key="id"
                    flat
                    wrap-cells
                >
                    <template v-slot:body="{row}">
                        <q-tr>
                            <q-td>
                                <q-btn flat round color="orange" icon="edit" @click="editOperacion(row)" />
                                 <q-btn flat round color="negative" icon="delete" @click="eliminarOperacion(row)" />
                            </q-td>
                            <q-td>
                                {{row.estado}}
                            </q-td>
                            <q-td class="text-center">{{row.codigo}}</q-td>
                            <q-td>{{row.descripcion}}</q-td>
                            <q-td>{{row?.entidad?.nombre}}</q-td>
                            <q-td class="text-center">{{row.ponderacion}}</q-td>
                        </q-tr>
                    </template>
                </q-table>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn flat label="cerrar" color="negative" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
    <Operacion
        v-if="dialogOperacion"
        v-model:dialog="dialogOperacion"
        v-model:value="selected"
        :estructura="estructura"
        :gestion="gestion"
        @creado="getOperaciones"
        @cancelar="cerrarModal"
    />
</template>
<script>
import { useVModel } from 'src/composables/useVModel'
import { ref, onMounted, inject } from 'vue'
import Operacion from './Operacion'
import { useQuasar } from 'quasar'
const columns = [
  {
    name: 'acciones',
    label: 'Acciones',
    align: 'center',
    sortable: false
  },
  {
    name: 'activo',
    label: 'Estado',
    align: 'center',
    sortable: false
  },
  {
    name: 'codigo',
    label: 'Codigo',
    align: 'center',
    sortable: false,
    display: false
  },
  {
    name: 'descripcion',
    label: 'Descripcion',
    align: 'center',
    sortable: false
  },
  {
    name: 'entidad',
    label: 'Entidad',
    align: 'center',
    sortable: false
  },
  {
    name: 'ponderacion',
    label: 'Ponderacion',
    align: 'center',
    sortable: false
  }
]
export default {
  props: {
    estructura: {
      type: Object,
      default: () => {
        return {
          id: -1
        }
      }
    },
    gestion: {
      type: Object,
      default: () => {}
    },
    dialog: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Operacion
  },
  setup (props) {
    const $q = useQuasar()
    const _http = inject('http')
    const modal = useVModel(props, 'dialog')
    const operaciones = ref([])
    const padres = ref([])
    const dialogOperacion = ref(false)
    const selected = ref({
      cronograma: [],
      tareas: [],
      mediosVerificacion: [],
      bienServicioDemandado: []
    })
    const todo = ref(true)

    onMounted(() => {
      getOperaciones()
    })

    const getOperaciones = async () => {
      todo.value = !todo.value
      padres.value = []
      operaciones.value = []
      dialogOperacion.value = false
      let respuesta
      if (props.estructura.idEstructuraPadre) {
        respuesta = await _http.get(`planificacion/operacion?idEstructura=${props.estructura.idEstructuraPadre}`)
        const padresOrdenado = respuesta.rows.sort((a, b) => {
          return parseInt((a.codigo).replace('.', '0')) > parseInt((b.codigo).replace('.', '0')) ? 1 : -1
        })
        padres.value = padresOrdenado
      }
      respuesta = await _http.get(`planificacion/operacion?idEstructura=${props.estructura.id}`)
      operaciones.value = respuesta.rows
    }

    const openOperacion = () => {
      selected.value = {
        idOperacionPadre: null,
        cronograma: [],
        tareas: [],
        mediosVerificacion: [],
        bienServicioDemandado: []
      }
      dialogOperacion.value = true
    }

    const editOperacion = (data) => {
      selected.value = data
      dialogOperacion.value = true
    }

    const cerrarModal = () => {
      selected.value = {
        cronograma: [],
        tareas: [],
        mediosVerificacion: [],
        bienServicioDemandado: []
      }
      dialogOperacion.value = false
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
          await getOperaciones()
        }
      }).onCancel(async () => {
      })
    }

    const activarInactivar = async (operacion) => {
      let estado = 'ACTIVAR'
      if (operacion.activo === false) {
        estado = 'INACTIVAR'
      } else {
        estado = 'ACTIVAR'
      }
      $q.dialog({
        html: true,
        title: '<i class="q-icon text-orange material-icons" style="font-size: 35px;">gpp_maybe</i> <b class="q-mt-md">Confirmación</b>',
        message: `¿Esta seguro de <b>${estado}</b> el registro?.`,
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
        await _http.put(`planificacion/operacion/${operacion.id}/activar-inactivar`)
      }).onCancel(async () => {
        operacion.activo = !operacion.activo
      })
    }

    const opened = (index) => {
      if (!todo.value) {
        return index === 0
      }
      return true
    }

    return {
      modal,
      columns,
      padres,
      operaciones,
      dialogOperacion,
      selected,
      todo,
      openOperacion,
      getOperaciones,
      editOperacion,
      cerrarModal,
      eliminarOperacion,
      activarInactivar,
      opened
    }
  }
}
</script>
