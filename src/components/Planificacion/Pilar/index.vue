<template>
  <q-page>
    <CrudTable
      :filters="filters"
      :columns="columns"
      :url="url"
      :order="'createdAt'"
      :query="addQuery"
    >
      <template v-slot:buttons="{ open }">
        <q-btn
          icon="add"
          color="secondary"
          @click="openModal(open)"
          label="Nuevo Pilar"
        />
      </template>
      <template v-slot:form="{ close, update }">
        <q-card style="width: 800px; max-width: 90vw;">
          <q-toolbar class="q-pa-md">
            <q-icon
              name="account_balance"
              size="md"
            />
            <q-toolbar-title>
              {{ pilar?.id ? 'Editar' : 'Agregar' }} Pilar
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
              class="row q-col-gutter-md">
              <q-input
                v-model="pilar.nombre"
                label="Nombre"
                clearable
                class="col-xs-6"
                filled
                dense
                :rules="valoresRules.required"
              />
              <q-input
                v-model="pilar.codigo"
                label="Codigo"
                clearable
                filled
                class="col-xs-6"
                dense
                :rules="valoresRules.required"
              />
              <q-select
                v-model="pilar.idEje"
                :options="ejes"
                label="EJES"
                behavior="menu"
                clearable
                class="col-xs-12"
                filled
                dense
                emit-value
                map-options
                multiple
                :rules="valoresRules.required"
              />
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
          <q-td>{{ row.nombre }}</q-td>
          <q-td>{{ row.codigo }}</q-td>
        </q-tr>
      </template>
    </CrudTable>
  </q-page>

</template>

<script>
import { ref, inject, onMounted } from 'vue'
import CrudTable from '@components/common/CrudTable'
import validaciones from '../../../common/validations'
const columns = [
  {
    name: 'acciones',
    label: 'Acciones',
    sortable: false
  },
  {
    name: 'nombre',
    label: 'Nombre Pilar',
    sortable: true
  },
  {
    name: 'codigo',
    label: 'Codigo',
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
    const url = ref('planificacion/pilar')
    const pilar = ref({})
    const ejes = ref([])
    const filters = ref([
      {
        label: 'Nombre',
        field: 'nombre',
        type: 'input'
      },
      {
        label: 'Codigo',
        field: 'codigo',
        type: 'input'
      },
      {
        label: 'Eje',
        field: 'idEje',
        type: 'select',
        options: []
      }
    ])

    onMounted(async () => {
      const parameter = await getParametros('TIPO_EJE')
      if (parameter) {
        ejes.value = parameter.map(item => { return { label: `${item.codigo} - ${item.nombre}`, value: item.id } })
        filters.value[2].options = [...ejes.value]
      }
    })

    const getParametros = async (grupo) => {
      const { rows } = await _http.get(`system/parametros?grupo=${grupo}`)
      return rows
    }

    const resetForm = () => {}

    const openModal = async (open, id) => {
      resetForm()
      if (id) {
        pilar.value = await _http.get(`/${url.value}/${id}`)
      }
      open()
    }

    const closeModal = (close) => {
      resetForm()
      close()
    }

    const guardar = async (update, close) => {
      if (pilar.value.id) {
        await _http.put(`/${url.value}/${pilar.value.id}`, pilar.value)
      } else {
        await _http.post(`/${url.value}`, pilar.value)
      }
      await update()
      closeModal(close)
    }

    return {
      filters,
      columns,
      url,
      ejes,
      closeModal,
      valoresRules,
      openModal,
      pilar,
      guardar
    }
  }
}
</script>
