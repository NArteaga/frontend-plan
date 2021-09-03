<template>
  <q-page>
    <Titulo
      titulo="Menus"
      icono="menu"
    ></Titulo>
    <CrudTable
      :filters="filters"
      :columns="columns"
      :url="url"
      :order="'createdAt'"
    >
      <template v-slot:buttons="props">
        <q-btn
          icon="add"
          color="secondary"
          @click="openModal(props.open)"
        > Agregar
        </q-btn>
      </template>
      <template v-slot:form="props">
        <q-card style="width: 700px; max-width: 90vw;">
          <q-toolbar class="q-pa-md">
            <q-icon
              name="home_work"
              size="md"
            />
            <q-toolbar-title>
              {{ menu.id ? 'Editar' : 'Agregar' }} menu
            </q-toolbar-title>
            <q-space />
            <q-btn
              flat
              round
              icon="close"
              @click="closeModal(props.close)"
            />
          </q-toolbar>
          <q-card-section>
            <q-form
              class="row q-col-gutter-md"
              @submit="guardar(props)"
            >
              <q-input
                class="col-xs-12 col-md-6"
                label="Nombre"
                filled
                v-model="menu.nombre"
              ></q-input>
              <q-input
                class="col-xs-12 col-md-6"
                label="Ruta"
                filled
                v-model="menu.ruta"
              ></q-input>
              <q-input
                class="col-xs-12 col-md-6"
                label="Icono"
                filled
                v-model="menu.icono"
              />
              <q-select
                class="col-xs-12 col-md-6"
                filled
                label="Menu padre"
                v-model="menu.idMenu"
                :options="menus"
                option-value="id"
                option-label="nombre"
                emit-value
                map-options
              />
              <q-input
                class="col-xs-12 col-md-6"
                label="Orden"
                filled
                v-model="menu.orden"
              />
              <div class="col-xs-12 text-right">
                <q-btn
                  label="Cancelar"
                  @click="closeModal(props.close)"
                />
                <q-btn
                  label="Guardar"
                  type="submit"
                  color="primary"
                  class="q-ml-sm"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </template>
      <template v-slot:row="props">
        <q-tr class="text-center">
          <q-td>
            <q-btn
              class="q-pa-xs"
              flat
              round
              icon="edit"
              @click="openModal(props.open, props.row.id)"
            />
            <q-btn
              class="q-pa-xs"
              flat
              round
              color="negative"
              icon="delete"
              @click="eliminar(props, props.row.id)"
            />
          </q-td>
          <q-td>
            <q-toggle
              v-model="props.row.estado"
              color="primary"
              false-value="INACTIVO"
              true-value="ACTIVO"
              @click="cambiarEstado(props, props.row)"
            />
          </q-td>
          <q-td>{{ props.row.nombre }}</q-td>
          <q-td>{{ props.row.ruta }}</q-td>
          <q-td>{{ props.row.icono }}</q-td>
          <q-td>
            <q-chip
              v-if="props.row.estado === 'ACTIVO'"
              square
              color="info"
              text-color="white"
              label="ACTIVO"
            />
            <q-chip
              v-if="props.row.estado === 'INACTIVO'"
              square
              color="warning"
              text-color="white"
              label="INACTIVO"
            />
          </q-td>
        </q-tr>
      </template>
    </CrudTable>
  </q-page>
</template>

<script>
import { ref, inject, onMounted } from 'vue'
import CrudTable from '@components/common/CrudTable'

const filters = [
  {
    label: 'Nombre',
    field: 'nombre',
    type: 'input'
  },
  {
    label: 'Fecha',
    field: 'fecha',
    type: 'date'
  },
  {
    label: 'Fecha2',
    field: 'fecha2',
    type: 'date'
  }

]

const columns = [
  {
    name: 'acciones',
    label: 'Acciones',
    sortable: false
  },
  {
    name: 'activo',
    label: 'Activo',
    sortable: false
  },
  {
    name: 'nombre',
    label: 'Nombre',
    sortable: true
  },
  {
    name: 'ruta',
    label: 'Ruta',
    sortable: true
  },
  {
    name: 'icono',
    label: 'Icono',
    sortable: true
  },
  {
    name: 'estado',
    label: 'Estado',
    sortable: true
  }
]

const url = '/system/menus'

export default {
  components: { CrudTable },
  name: 'Dashboard',
  setup () {
    const _http = inject('http')
    const menus = ref([])
    onMounted(async () => {
      const { rows } = await _http.get('/system/menus')
      menus.value = rows
    })

    const menu = ref({
      id: null,
      nombre: '',
      ruta: '',
      icono: '',
      orden: 0,
      estado: 'ACTIVO'
    })

    const resetForm = () => {
      menu.value = {
        id: null,
        nombre: '',
        ruta: '',
        icono: '',
        orden: 0,
        estado: 'ACTIVO'
      }
    }

    const openModal = async (open, id) => {
      resetForm()
      if (id) {
        menu.value = await _http.get(`${url}/${id}`)
      }
      open()
    }

    const closeModal = (close) => {
      resetForm()
      close()
    }

    const guardar = (props) => {
      if (menu.value.id) {
        _http.put(`${url}/${menu.value.id}`, menu.value)
      } else {
        _http.post(url, menu.value)
      }
      props.update()
      closeModal(props.close)
    }

    const eliminar = async (props, id) => {
      await props.eliminar({ url: `${url}/${id}` })
    }

    const cambiarEstado = async (props, row) => {
      await props.cambiarEstado({ registro: row, url: `${url}/${row.id}` })
    }

    return {
      menus,
      closeModal,
      openModal,
      guardar,
      eliminar,
      cambiarEstado,
      url,
      menu,
      filters,
      columns
    }
  }
}
</script>
