<template>
  <q-page>
    <CrudTable
      :filters="filters"
      :columns="columns"
      :url="url"
      :order="'createdAt'"
    >
      <template v-slot:buttons="{ open }">
        <q-btn
          icon="add"
          color="secondary"
          @click="openModal(open)"
          label="Nuevo Ejecución Presupuestaria"
        />
      </template>
      <template v-slot:form="{ close, update }">
        <q-card style="width: 800px; max-width: 90vw;">
          <q-toolbar class="q-pa-md">
            <q-icon
              name="receipt_long"
              size="md"
            />
            <q-toolbar-title>
              {{ ejecucion?.id ? 'Editar' : 'Agregar' }} Ejecución Presupuestaria
            </q-toolbar-title>
            <q-space />
            <q-btn
              flat
              round
              icon="close"
              @click="closeModal(close)"
            />
          </q-toolbar>
          <q-card-section>
            <q-form
              ref="usuario"
              @submit="guardar(update, close)"
              class="row q-col-gutter-sm">
              <q-input
                v-model="ejecucion.objetivo"
                label="Justificacion"
                clearable
                class="col-xs-12"
                filled
                :rules="valoresRules.required"
              />
              <CrudTable
                class="col-xs-12"
                :columns="columnsDetalle"
                :url="urlDetalle"
                :order="'createdAt'"
                :query="addQuery"
              >
                <template v-slot:buttons="{ open }">
                  <q-btn
                    icon="add"
                    color="secondary"
                    @click="openModalItem(open)"
                    label="Nuevo Item"
                  />
                </template>
                <template v-slot:form="{ close, update, addRegistro }">
                  <q-card style="width: 800px; max-width: 90vw;">
                    <q-toolbar class="q-pa-md">
                      <q-icon
                        name="loyalty"
                        size="md"
                      />
                      <q-toolbar-title>
                        {{ detalle?.id ? 'Editar' : 'Agregar' }} Item
                      </q-toolbar-title>
                      <q-space />
                      <q-btn
                        flat
                        round
                        icon="close"
                        @click="closeModalItem(close)"
                      />
                    </q-toolbar>
                    <q-card-section>
                      <q-form
                        ref="usuario"
                        @submit="guardarItem(update, close, addRegistro)"
                        class="row q-col-gutter-md">
                        <q-select
                          v-model="detalle.idPresupuesto"
                          :options="presupuestos"
                          option-value="id"
                          label="Presupuestos"
                          behavior="menu"
                          clearable
                          class="col-xs-12"
                          filled
                          emit-value
                          map-options
                          :rules="valoresRules.required"
                        >
                          <template v-slot:option="scope">
                            <q-item v-bind="scope.itemProps">
                              <q-item-section>
                                <q-item-label>
                                  {{ scope.opt.operacion.codigo }} {{ scope.opt.operacion.descripcion }}
                                </q-item-label>
                                <q-item-label caption>
                                  {{scope.opt.partidaPresupuestaria.nombre}} / Fuente: {{scope.opt.organismoFinanciador.sigla}} / Saldo : {{parseFloat(scope.opt.saldo).toFixed(2)}} Bs.
                                </q-item-label>
                              </q-item-section>
                            </q-item>
                          </template>
                          <template v-slot:selected-item="scope">
                            <q-item>
                              <q-item-section>
                                <q-item-label>
                                  {{ scope.opt.operacion.codigo }} {{ scope.opt.operacion.descripcion }}
                                </q-item-label>
                                <q-item-label caption>
                                  {{scope.opt.partidaPresupuestaria.codigo}} / Fuente: {{scope.opt.organismoFinanciador.sigla}} / Saldo : {{parseFloat(scope.opt.saldo).toFixed(2)}} Bs.
                                </q-item-label>
                              </q-item-section>
                            </q-item>
                          </template>
                        </q-select>
                        <q-input
                          v-model="detalle.descripcion"
                          label="Descripcion"
                          clearable
                          class="col-xs-12 q-pb-none"
                          filled
                          :rules="valoresRules.required"
                        />
                        <q-select
                          filled
                          label="Unidad de Medida"
                          v-model="detalle.idUnidadMedida"
                          :options="unidadesMedidas"
                          option-label="nombre"
                          option-value="id"
                          class="col-xs-4"
                          emit-value
                          map-options
                          :rules="valoresRules.required"
                        />
                        <q-input
                          filled
                          label="Cantidad"
                          v-model="detalle.cantidad"
                          class=" col-xs-4"
                          :rules="valoresRules.required"/>
                        <q-input
                          filled
                          label="Precio Unitario"
                          v-model="detalle.precioUnitario"
                          class="col-xs-4"
                          :rules="valoresRules.required"/>
                        <div class="col-xs-12 text-right q-gutter-sm">
                          <q-btn
                            icon="close"
                            label="Cancelar"
                            @click="closeModal(close)"
                          />
                          <q-btn
                            icon="check"
                            color="primary"
                            label="Guardar"
                            type="submit"
                          />
                        </div>
                      </q-form>
                    </q-card-section>
                  </q-card>
                </template>
                <template v-slot:row="{ row, open, eliminar, index }">
                  <q-tr>
                    <q-td>
                      <q-btn
                        class="q-pa-xs"
                        flat
                        round
                        icon="edit"
                        @click="openModalItem(open, row.id, row, index)"
                      />
                      <q-btn
                        class="q-pa-xs"
                        flat
                        round
                        color="negative"
                        icon="delete"
                        @click="eliminar({ url: `${urlDetalle}/${row.id}` })"
                      />
                    </q-td>
                    <q-td>{{ row.descripcion }}</q-td>
                    <q-td>{{ row?.unidadMedida?.nombre }}</q-td>
                    <q-td>{{ row.cantidad }}</q-td>
                    <q-td>{{ row.precioUnitario }}</q-td>
                  </q-tr>
                </template>
              </CrudTable>
              <div class="col-xs-12 text-right q-gutter-sm">
                <q-btn
                  icon="close"
                  label="Cancelar"
                  @click="closeModalItem(close)"
                />
                <q-btn
                  icon="check"
                  color="primary"
                  label="Guardar"
                  type="submit"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </template>
      <template v-slot:row="{ row, open, eliminar }">
        <q-tr>
          <q-td>
            <q-btn
              class="q-pa-xs"
              flat
              round
              icon="edit"
              @click="openModal(open, row.id)"
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
          <q-td>{{ row.objetivo }}</q-td>
          <q-td>{{ row.montoTotal }}</q-td>
          <q-td>{{ row.createdAt }}</q-td>
          <q-td>{{ row.updatedAt }}</q-td>
        </q-tr>
      </template>
    </CrudTable>
  </q-page>

</template>

<script>
import { ref, inject, onMounted } from 'vue'
import CrudTable from '@components/common/CrudTable'
import validaciones from '../../common/validations'
const columns = [
  {
    name: 'acciones',
    label: 'Acciones',
    sortable: false
  },
  {
    name: 'objetivo',
    label: 'Justificación',
    sortable: true
  },
  {
    name: 'montoTotal',
    label: 'Monto Total',
    sortable: true
  },
  {
    name: 'createdAt',
    label: 'Fecha de Creado',
    sortable: true
  },
  {
    name: 'createdAt',
    label: 'Fecha de Actualización',
    sortable: true
  }
]
const columnsDetalle = [
  {
    name: 'acciones',
    label: 'Acciones',
    sortable: false
  },
  {
    name: 'descripcion',
    label: 'Descripción',
    sortable: true
  },
  {
    name: 'unidadMedidad',
    label: 'Unidad de Medida',
    sortable: true
  },
  {
    name: 'cantidad',
    label: 'Cantidad',
    sortable: true
  },
  {
    name: 'precioUnitario',
    label: 'Precio Unitario',
    sortable: true
  }
]
const valoresRules = {
  required: [
    validaciones.requerido
  ]
}
export default {
  components: { CrudTable },
  name: 'Dashboard',
  setup () {
    const _http = inject('http')
    const url = ref('financiera/ejecucion')
    const urlDetalle = ref('financiera/detalle')
    const ejecucion = ref({})
    const presupuestos = ref([])
    const unidadesMedidas = ref([])
    const position = ref()
    const detalle = ref({})
    const addQuery = ref({ idEjecucion: '00000000-0000-0000-0000-000000000000' })
    const filters = ref([
      {
        label: 'idPresupuesto',
        field: 'Presupuesto',
        type: 'select',
        options: []
      }
    ])

    onMounted(async () => {
      const presupuesto = await getPresupuesto()
      unidadesMedidas.value = await getParametros()
      if (presupuesto) {
        presupuestos.value = presupuesto
        filters.value[0].options = [...presupuestos.value]
      }
    })

    const getPresupuesto = async () => {
      const { rows } = await _http.get('financiera/presupuesto')
      return rows
    }

    const getParametros = async () => {
      const { rows } = await _http.get('system/parametros?grupo=TIPO_UNIDAD')
      return rows
    }

    const resetForm = () => {
      ejecucion.value = {}
    }

    const resetFormDetalle = () => {
      detalle.value = {}
    }

    const openModal = async (open, id) => {
      resetForm()
      resetFormDetalle()
      if (id) {
        ejecucion.value = await _http.get(`/${url.value}/${id}`)
        addQuery.value.idEjecucion = id
      } else addQuery.value.idEjecucion = '00000000-0000-0000-0000-000000000000'
      open()
    }

    const openModalItem = async (open, id, row, index) => {
      resetFormDetalle()
      if (id) {
        detalle.value = await _http.get(`/${urlDetalle.value}/${id}`)
      } else if (row) {
        if (index) position.value = index
        else position.value = -1
        detalle.value = row
      }
      open()
    }

    const closeModal = (close) => {
      resetForm()
      resetFormDetalle()
      close()
    }

    const closeModalItem = (close) => {
      resetFormDetalle()
      close()
    }

    const guardar = async (update, close) => {
      if (ejecucion.value.id) {
        await _http.put(`/${url.value}/${ejecucion.value.id}`, ejecucion.value)
      } else {
        await _http.post(`/${url.value}`, ejecucion.value)
      }
      await update()
      closeModal(close)
    }

    const guardarItem = async (update, close, addRegistro) => {
      if (detalle.value.id) {
        await _http.put(`/${urlDetalle.value}/${detalle.value.id}`, detalle.value)
        await update()
      } else {
        if (ejecucion.value.id) {
          await _http.post(`/${urlDetalle.value}`, { ...detalle.value, idEjecucion: ejecucion.value.id })
          await update()
        } else {
          ejecucion.value.detalles = [detalle.value]
          await _http.post(`/${url.value}`, ejecucion.value)
          await update()
        }
      }
      closeModalItem(close)
    }

    return {
      filters,
      columns,
      columnsDetalle,
      unidadesMedidas,
      openModalItem,
      url,
      urlDetalle,
      detalle,
      closeModal,
      closeModalItem,
      valoresRules,
      openModal,
      presupuestos,
      addQuery,
      ejecucion,
      guardar,
      guardarItem
    }
  }
}
</script>
