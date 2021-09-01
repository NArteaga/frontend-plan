<template>
  <div class="row">
    <div class="col-xs-12">
      <q-dialog v-model="crudTableModal" persistent>
        <slot
          name="form"
          :close="closeModal"
          :update="updateList">Agregue su formulario aquí</slot>
      </q-dialog>
    </div>
    <div class="col-xs-12">
      <q-card class="q-ma-md">
        <q-toolbar inset class="q-gutter-md q-px-md q-pb-md">
          <slot name="buttons" :open="openModal"></slot>
          <q-btn
            v-if="filters.length > 0"
            @click="toggleSearch()">
            <q-icon
              center
              :name="enableSearch ? 'close' : 'search'"
              color="secondary" />
            <q-tooltip>{{ enableSearch ? 'Cerrar filtros' : 'Abrir filtros' }}</q-tooltip>
          </q-btn>
          <q-btn @click="updateList()">
            <q-icon center name="refresh" color="secondary" />
            <q-tooltip>Actualizar página</q-tooltip>
          </q-btn>
          <slot name="buttons-end"></slot>
        </q-toolbar>
        <q-table
          v-model:pagination="pagination"
          :grid="grid"
          :rows="registros"
          :columns="getColumns"
          :loading="loading"
          :rows-per-page-options="[10, 25, 50, 100]"
          :pagination-label="getPaginationLabel"
          no-data-label="No existe registros disponibles"
          no-results-label="No existe registros"
          loading-label="Cargando..."
          rows-per-page-label="Filas por pagina"
          v-model:selected="selected"
          @request="getData">
          <template
            v-slot:top v-if="enableSearch"
            class="full-width">
            <div class="row q-col-gutter-xs no-padding full-width">
              <div
                v-for="(item, index) of filters"
                :key="index"
                align="center"
                class="col-grow"
                style="max-width:280px;">
                <q-select
                  v-if="item.type === 'select'"
                  v-model="search[item.field]"
                  :options="item.options"
                  :label="item.label"
                  behavior="menu"
                  clearable
                  filled
                  dense
                  emit-value
                  map-options
                  :autofocus="index === 0" />
                <q-checkbox
                  v-if="item.type === 'checkbox'"
                  v-model="search[item.field]"
                  :label="item.label"
                  filled
                  dense
                  :autofocus="index === 0" />
                <q-input
                  v-if="item.type === 'input'"
                  v-model="search[item.field]"
                  :label="item.label"
                  clearable
                  filled
                  dense
                  :autofocus="index === 0" />
                 <q-input
                  v-if="item.type === 'date'"
                  v-model="search[item.field]"
                  :label="item.label"
                  clearable
                  filled
                  dense>
                  <template v-slot:append :props="item">
                    <q-icon name="event" class="cursor-pointer"></q-icon>
                    <q-popup-proxy
                      :ref="item.field"
                      transition-show="scale"
                      transition-hide="scale">
                      <q-date
                        v-model="search[item.field]"
                        color="primary"
                        mask="YYYY-MM-DD"
                        @input="(evt) => ocultarPopup(evt, item.field)" />
                    </q-popup-proxy>
                  </template>
                </q-input>
              </div>
            </div>
          </template>
          <template v-slot:body="props">
            <slot
              :row="props.row"
              :open="openModal"
              :update="updateList"
              name="row" />
          </template>
          <template v-slot:item="props">
            <slot
              :row="props.row"
              :selected="props.selected"
              :open="openModal"
              :update="updateList"
              name="item" />
          </template>
        </q-table>
      </q-card>
    </div>
  </div>
</template>

<script>
import { nextTick } from 'vue'

export default {
  name: 'PageIndex',
  props: {
    filters: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    url: {
      type: String,
      default: 'url'
    },
    order: {
      type: String,
      default: () => ''
    },
    grid: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      tamanioColumna: 3,
      registros: [],
      persistent: false,
      enableSearch: false,
      crudTableModal: false,
      search: '',
      page: 1,
      limit: 5,
      edit: false,
      loading: false,
      selected: [],
      pagination: {
        sortBy: this.order,
        descending: true,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        'rows-per-page-label': 'Páginas'
      }
    }
  },
  watch: {
    url: {
      async handler () {
        this.getData({
          pagination: this.pagination,
          filter: undefined
        })
      }
    },
    search: {
      handler () {
        this.getData({
          pagination: this.pagination,
          filter: undefined
        })
      },
      deep: true
    }
  },
  mounted () {
    const division = parseInt(this.filters.length / 12)
    this.tamanioColumna = division > 1 ? division : 2
    this.updateList()
  },
  computed: {
    getColumns () {
      const items = []
      for (const el of this.columns) {
        el.align = 'center'
        items.push(el)
      }
      return items
    }
  },
  methods: {
    getPaginationLabel (firstRowIndex, endRowIndex, totalRowsNumber) {
      return `${firstRowIndex} - ${endRowIndex} de ${totalRowsNumber}`
    },
    ocultarPopup (evt, field) {
      this.$refs[field][0].hide()
    },
    updateList () {
      this.getData({
        pagination: this.pagination,
        filter: undefined
      })
    },
    openModal () {
      this.crudTableModal = true
    },
    closeModal () {
      this.crudTableModal = false
    },
    toggleSearch () {
      this.enableSearch = !this.enableSearch
      this.search = {}
    },
    async getData (props) {
      this.loading = true
      const { page, rowsPerPage, sortBy, descending } = props.pagination
      const query = {
        limit: rowsPerPage === 0 ? 99999 : rowsPerPage,
        page: page
      }
      if (sortBy) {
        query.order = (descending ? '-' : '') + sortBy
      }
      if (Object.keys(this.search).length) {
        for (const key of Object.keys(this.search)) {
          if (this.search[key]) {
            if (this.search[key].toString().length > 0) {
              query[key] = this.search[key]
            }
          }
        }
      }
      const url = this.url
      const response = await this.$http.get(this.$http.convertQuery(url, query), false)
      nextTick(() => {
        this.loading = false
      })
      if (response) {
        this.registros = response.rows
        this.pagination = props.pagination
        this.pagination.rowsNumber = response.count
      }
    }
  }
}
</script>
