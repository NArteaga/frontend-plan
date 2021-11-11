<template>
    <q-page>
    <Titulo
      titulo="Almacenes"
      icono="inventory_2"
    ></Titulo>
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
          label="NUEVO ALMACEN"
        />
    </template>
      <template v-slot:row="{ row, open, eliminar, cambiarEstado }">
        <q-tr>
          <q-td>{{ row.nombre }}</q-td>
          <q-td>{{ row.lugar }}</q-td>
          <q-td>
            <q-toggle
              v-model="row.estado"
              color="primary"
              false-value="INACTIVO"
              true-value="ACTIVO"
              @click="cambiarEstado({ registro: row, url: `${url}/${row.id}` })"
            />
          </q-td>
          <q-td>
            <Estado :estado="row.estado" />
          </q-td>
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
        </q-tr>
      </template>
    </CrudTable>
    </q-page>
</template>
<script>
import { ref } from 'vue'
import CrudTable from '@components/common/CrudTable'
const filters = [
  {
    label: 'Nombre',
    field: 'nombre',
    type: 'input'
  }
]
const columns = [
  {
    name: 'nombre',
    label: 'Nombre',
    sortable: true
  },
  {
    name: 'lugar',
    label: 'Ubicacion',
    sortable: true
  },
  {
    name: 'activo',
    label: 'Activo',
    sortable: true
  },
  {
    name: 'estado',
    label: 'Estado',
    sortable: false
  },
  {
    name: 'acciones',
    label: 'Acciones',
    sortable: false
  }
]
export default {
  components: { CrudTable },
  name: 'Almacenes',
  setup () {
    const url = ref('almacenes/almacen')
    return {
      filters,
      columns,
      url
    }
  }
}
</script>
