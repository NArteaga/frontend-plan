<template>
  <q-card-section class="row">
    <div class="col-xs-12">
      <q-toolbar class="q-pl-md bg-blue-grey-1">
        <q-toolbar-title class="text-h6 text-weight-bold">
          Lista de Gestiones
        </q-toolbar-title>
        <q-btn color="primary" icon="add" label="Nuevo" @click="$emit('modal')" />
        <q-btn
          class="q-ml-md"
          flat
          round
          icon="refresh"
          @click="$emit('gestiones')"
        >
          <q-tooltip>Actualizar Lista</q-tooltip>
        </q-btn>
      </q-toolbar>
    </div>
    <div class="col-xs-12">
      <q-table
        :rows="gestiones"
        :columns="columns"
        row-key="id"
        no-data-label="Aun no existen gestiones registradas"
        no-results-label="No existe registros"
        loading-label="Cargando..."
        rows-per-page-label="Filas por pagina"
        wrap-cells
        flat
      >
        <template v-slot:body="{row}">
          <q-tr>
            <q-td class="text-center">
              <q-btn
                  flat
                  round
                  icon="edit"
                  @click="$emit('modal',row)"
              >
                  <q-tooltip> Editar </q-tooltip>
              </q-btn>
            </q-td>
            <q-td class="text-center">
              <q-btn
                rounded
                size="sm"
                @click="cambiarEstado(row, 0)"
                dark
                :color="row.estado==='ACTIVO'?'primary':'negative'"
                :label="row.estado"
              />
            </q-td>
            <q-td class="text-center">
              <q-btn
                rounded
                size="sm"
                @click="cambiarEstado(row, 1)"
                dark
                :color="row.ejecutando?'primary':'negative'"
                :label="row.ejecutando ? 'SI': 'NO'"
              />
            </q-td>
            <q-td class="text-center">{{row.gestion}}</q-td>
            <q-td class="text-center">{{row.updatedAt}}</q-td>
            <q-td class="text-center">{{row.etapa}}</q-td>
            <q-td class="text-center">{{row.fechaInicio }}</q-td>
            <q-td class="text-center">{{row.fechaFin}}</q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-card-section>
</template>
<script>
import { useVModel } from 'src/composables/useVModel'
import { useQuasar } from 'quasar'
import { inject } from 'vue'
const columns = [
  {
    name: 'acciones',
    label: 'Acciones',
    align: 'center',
    sortable: false
  },
  {
    name: 'estado',
    label: 'Estado',
    align: 'center',
    sortable: false
  },
  {
    name: 'ejecutando',
    label: 'En Ejecución',
    align: 'center',
    sortable: false
  },
  {
    name: 'gestion',
    label: 'Gestión',
    align: 'center',
    sortable: false
  },
  {
    name: 'fechaUltimaModificacion',
    label: 'Ultima Modificación',
    align: 'center',
    sortable: false
  },
  {
    name: 'etapa',
    label: 'Etapa',
    align: 'center',
    sortable: false
  },
  {
    name: 'fechaInicio',
    label: 'Fecha Inicio',
    align: 'center',
    sortable: false
  },
  {
    name: 'fechaFin',
    label: 'Fecha Fin',
    align: 'center',
    sortable: false
  }
]
export default {
  emits: ['gestiones'],
  props: {
    listaGestiones: {
      type: Array,
      defaultValue: () => []
    },
    url: {
      type: String
    }
  },
  setup (props, { emit }) {
    const gestiones = useVModel(props, 'listaGestiones')
    const _http = inject('http')
    const $q = useQuasar()
    const cambiarEstado = (row, change) => {
      $q.dialog({
        title: 'Confirmacion',
        message: '¿Esta seguro de cambiar el estado de el registro?',
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
        let body = {
          ejecutando: row.ejecutando,
          estado: row.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO'
        }
        if (change === 1) {
          body = {
            ejecutando: !row.ejecutando,
            estado: row.estado
          }
        }
        const respuesta = await _http.patch(`${props.url}/${row.id}/estado`, body)
        if (respuesta) {
          await emit('gestiones')
        }
      }).onCancel(async () => {
      })
    }
    return {
      gestiones,
      cambiarEstado,
      columns
    }
  }
}
</script>
