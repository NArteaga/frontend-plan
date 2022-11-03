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
          label="Nuevo Organismo Financiador"
        />
      </template>
      <template v-slot:form="{ close, update }">
        <q-card style="width: 800px; max-width: 90vw;">
          <q-toolbar class="q-pa-md">
            <q-icon
              name="account_balance_wallet"
              size="md"
            />
            <q-toolbar-title>
              {{ organismoFinanciador?.id ? 'Editar' : 'Agregar' }} Organismo Financiador
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
                v-model="organismoFinanciador.nombre"
                label="Nombre"
                clearable
                class="col-xs-6"
                filled
                :rules="valoresRules.required"
              />
              <q-input
                v-model="organismoFinanciador.sigla"
                label="Sigla"
                clearable
                filled
                class="col-xs-6"
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
          <q-td>{{ row.sigla }}</q-td>
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
    name: 'nombre',
    label: 'Organismo Financiador',
    sortable: true
  },
  {
    name: 'sigla',
    label: 'Sigla',
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
    const url = ref('financiera/organismo-financiador')
    const organismoFinanciador = ref({})
    const filters = ref([
      {
        label: 'Organismo Financiador',
        field: 'nombre',
        type: 'input'
      },
      {
        label: 'Sigla',
        field: 'sigla',
        type: 'input'
      }
    ])

    onMounted(() => {})

    const resetForm = () => {
      organismoFinanciador.value = {}
    }

    const openModal = async (open, id) => {
      resetForm()
      if (id) {
        organismoFinanciador.value = await _http.get(`/${url.value}/${id}`)
      }
      open()
    }

    const closeModal = (close) => {
      resetForm()
      close()
    }

    const guardar = async (update, close) => {
      if (organismoFinanciador.value.id) {
        await _http.put(`/${url.value}/${organismoFinanciador.value.id}`, organismoFinanciador.value)
      } else {
        await _http.post(`/${url.value}`, organismoFinanciador.value)
      }
      await update()
      closeModal(close)
    }

    return {
      filters,
      columns,
      url,
      closeModal,
      valoresRules,
      openModal,
      organismoFinanciador,
      guardar
    }
  }
}
</script>
