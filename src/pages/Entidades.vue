<template>
  <q-page>
    <Titulo
      titulo="Entidades"
      icono="business"
    ></Titulo>
    <CrudTable
      :filters="filters"
      :columns="columns"
      :url="url"
      :grid="true"
      :paginationPerPage="paginationPerPage"
      :rowsPerPage="rowsPerPage"
      :order="'createdAt'"
    >
      <template v-slot:buttons="{ open }">
        <q-btn
          icon="add"
          color="secondary"
          @click="openModal(open)"
          label="Nueva entidad"
        />
      </template>
      <template v-slot:form="{ close, update}">
        <q-card style="width: 700px; max-width: 90vw;">
          <q-toolbar class="q-pa-md">
            <q-icon
              name="home_work"
              size="md"
            />
            <q-toolbar-title>
              {{ entidad.id ? 'Editar' : 'Agregar' }} entidad
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
            <Entidad
              v-model:valores="entidad"
              @guardar="guardar(update, close)"
              @cancelar="closeModal(close)"
            ></Entidad>
          </q-card-section>
        </q-card>
      </template>
      <template v-slot:item="{ row, open, cambiarEstado }">
        <div class="q-pa-xs col-xs-12 col-sm-4 col-md-3">
          <q-card class="my-card">
            <q-img :class="row.estado === 'ACTIVO'? '' : 'gray'" src="~assets/logo-mjti.png">
              <div class="absolute-bottom bg-white text-black text-subtitle2 text-center">
                <q-btn
                  round
                  :color="row.estado === 'ACTIVO'? 'primary': 'red-7'"
                  :icon="row.estado === 'ACTIVO'? 'check' : 'close'"
                  class="absolute"
                  @click="cambiarEstado(cambioEstado(row))"
                  style="top: 0; right: 12px; transform: translateY(-50%);"
                >
                  <q-tooltip class="bg-indigo" :offset="[10, 10]">
                    Activar o Inactivar la Institución
                  </q-tooltip>
                </q-btn>
                {{ row.nombre }}
              </div>
            </q-img>
            <q-card-section>
              <div class="row">
                <div class="col-xs-4 text-center">
                  <q-btn flat round color="primary" size="lg" icon="badge" @click="$router.push(`entidades/${row.id}`)">
                    <q-tooltip class="bg-indigo" :offset="[10, 10]">
                      Lista del Personal
                    </q-tooltip>
                  </q-btn>
                </div>
                <div class="col-xs-4 text-center">
                  <q-btn flat round color="primary" size="lg" icon="edit_note" @click="openModal(open, row.id)">
                    <q-tooltip class="bg-indigo" :offset="[10, 10]">
                      Editar datos de la Institución
                    </q-tooltip>
                  </q-btn>
                </div>
                <div class="col-xs-4 text-center">
                  <q-btn flat round color="primary" size="lg" icon="book" @click="$router.push(`entidades/plan/${row.id}`)">
                    <q-tooltip class="bg-indigo" :offset="[10, 10]">
                      Ver Planificación
                    </q-tooltip>
                  </q-btn>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </CrudTable>
  </q-page>
</template>

<script>
import { ref, inject } from 'vue'
import CrudTable from '@components/common/CrudTable'
import Entidad from 'components/Formularios/Entidad'

const filters = [
  {
    label: 'Nombre',
    field: 'nombre',
    type: 'input'
  },
  {
    label: 'Departamento',
    field: 'departamento',
    type: 'input'
  },
  {
    label: 'Correo electronico',
    field: 'email',
    type: 'input'
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
    sortable: false
  },
  {
    name: 'email',
    label: 'Correo electronico',
    sortable: false
  },
  {
    name: 'telefono',
    label: 'Telefono',
    sortable: false
  },
  {
    name: 'estado',
    label: 'Estado',
    sortable: false
  }
]

export default {
  components: { CrudTable, Entidad },
  name: 'Dashboard',
  setup () {
    const _http = inject('http')
    const url = ref('system/entidades')
    const entidad = ref({
      nombre: null,
      departamento: null,
      provincia: null,
      municipio: null,
      direccion: null,
      horario: null,
      servicio: [],
      email: null,
      telefono: null,
      lenguas: [],
      latitud: null,
      longitud: null,
      estado: 'ACTIVO'
    })
    const paginationPerPage = ref([16, 32, 64])
    const rowsPerPage = ref(8)
    const resetForm = () => {
      entidad.value = {
        nombre: null,
        departamento: null,
        provincia: null,
        municipio: null,
        direccion: null,
        horario: null,
        servicio: [],
        email: null,
        telefono: null,
        lenguas: [],
        latitud: null,
        longitud: null,
        estado: 'ACTIVO'
      }
    }

    const openModal = async (open, id) => {
      resetForm()
      if (id) {
        entidad.value = await _http.get(`/${url.value}/${id}`)
      }
      open()
    }

    const closeModal = (close) => {
      resetForm()
      close()
    }

    const guardar = async (update, close) => {
      entidad.value.departamento = entidad.value.departamento.nombre
      entidad.value.provincia = entidad.value.provincia.nombre
      entidad.value.municipio = entidad.value.municipio.nombre
      if (entidad.value.id) {
        await _http.put(`/${url.value}/${entidad.value.id}`, entidad.value)
      } else {
        await _http.post(`/${url.value}`, entidad.value)
      }
      await update()
      closeModal(close)
    }

    const cambioEstado = (row) => {
      if (row.estado === 'ACTIVO') row.estado = 'INACTIVO'
      else row.estado = 'ACTIVO'
      return { registro: row, url: `${url.value}/${row.id}` }
    }

    const getNombreCompleto = (usuario) => {
      return `${usuario.nombres} ${usuario.primerApellido} ${usuario.segundoApellido}`
    }

    return {
      entidad,
      filters,
      columns,
      url,
      cambioEstado,
      closeModal,
      openModal,
      paginationPerPage,
      rowsPerPage,
      getNombreCompleto,
      guardar
    }
  }
}
</script>
<style>
  .gray img{
    filter: grayscale(1)
  }
</style>
