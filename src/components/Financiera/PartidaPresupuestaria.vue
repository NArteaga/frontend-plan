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
          label="Nuevo Partida Presupuestaria"
        />
      </template>
      <template v-slot:form="{ close, update }">
        <q-card style="width: 800px; max-width: 90vw;">
          <q-toolbar class="q-pa-md">
            <q-icon
              name="shopping_bag"
              size="md"
            />
            <q-toolbar-title>
              {{ partidaPresupuestaria?.id ? 'Editar' : 'Agregar' }} Partida Presupuestaria
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
              <q-select
                v-model="partidaPresupuestaria.idPartidaPadre"
                :options="grupos"
                label="Partida Agrupada"
                behavior="menu"
                clearable
                class="col-xs-12"
                filled
                emit-value
                map-options
              />
              <q-input
                v-model="partidaPresupuestaria.nombre"
                label="Nombre"
                clearable
                class="col-xs-6 q-pb-none"
                filled
                :rules="valoresRules.required"
              />
              <q-input
                v-model="partidaPresupuestaria.codigo"
                label="Codigo"
                clearable
                filled
                class="col-xs-6 q-pb-none"
                :rules="valoresRules.required"
              />
              <q-select
                v-model="partidaPresupuestaria.tipo"
                :options="[{ label: 'GRUPO', value: 'GRUPO' }, { label: 'PARTIDA', value: 'PARTIDA' }]"
                label="Tipo"
                behavior="menu"
                clearable
                class="col-xs-12"
                filled
                emit-value
                map-options
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
          <q-td>{{ row.codigo }}</q-td>
          <q-td>{{ row.nombre }}</q-td>
          <q-td>{{ row.tipo }}</q-td>
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
    name: 'codigo',
    label: 'codigo',
    sortable: true
  },
  {
    name: 'nombre',
    label: 'Partida Presupuestaria',
    sortable: true
  },
  {
    name: 'tipo',
    label: 'Tipo',
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
    const url = ref('financiera/partida-presupuestaria')
    const partidaPresupuestaria = ref({})
    const grupos = ref([])
    const filters = ref([
      {
        label: 'Partida Presupuestaria',
        field: 'nombre',
        type: 'input'
      },
      {
        label: 'Codigo',
        field: 'codigo',
        type: 'input'
      },
      {
        label: 'Tipo',
        field: 'tipo',
        type: 'select',
        options: [{ label: 'GRUPO', value: 'GRUPO' }, { label: 'PARTIDA', value: 'PARTIDA' }]
      },
      {
        label: 'Partidas del Grupo',
        field: 'idPartidaPadre',
        type: 'select',
        options: []
      }
    ])

    onMounted(async () => {
      await refresh()
    })

    const refresh = async () => {
      const parameter = await getParametros()
      if (parameter) {
        grupos.value = parameter.map(item => { return { label: `${item.codigo} - ${item.nombre}`, value: item.id } })
        filters.value[3].options = [...grupos.value]
      }
    }
    const getParametros = async () => {
      const { rows } = await _http.get(`${url.value}?tipo=GRUPO`)
      return rows
    }

    const resetForm = () => {
      partidaPresupuestaria.value = {}
    }

    const openModal = async (open, id) => {
      resetForm()
      if (id) {
        partidaPresupuestaria.value = await _http.get(`/${url.value}/${id}`)
      }
      open()
    }

    const closeModal = (close) => {
      resetForm()
      close()
    }

    const guardar = async (update, close) => {
      if (partidaPresupuestaria.value.id) {
        await _http.put(`/${url.value}/${partidaPresupuestaria.value.id}`, partidaPresupuestaria.value)
      } else {
        await _http.post(`/${url.value}`, partidaPresupuestaria.value)
      }
      await refresh()
      await update()
      closeModal(close)
    }

    return {
      filters,
      columns,
      url,
      closeModal,
      grupos,
      valoresRules,
      openModal,
      partidaPresupuestaria,
      guardar
    }
  }
}
</script>
