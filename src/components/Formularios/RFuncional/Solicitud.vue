<template>
  <q-form
    class="row q-col-gutter-md"
    @submit="$emit('guardar')"
  >
    <q-input
      filled
      class="col-xs-12 col-md-8"
      label="Nombre"
      v-model="valoresModel.nombre"
      :rules="valoresRules.nombre"
    ></q-input>
    <q-select
      filled
      :options="departamentos"
      class="col-xs-12 col-md-4"
      label="Departamento"
      v-model="valoresModel.departamento"
      :rules="valoresRules.departamento"
      emit-value
      map-options
    />
    <q-input
      filled
      class="col-xs-12 col-md-12"
      label="Direccion"
      v-model="valoresModel.direccion"
      :rules="valoresRules.direccion"
    ></q-input>
    <q-input
      filled
      type="textarea"
      class="col-xs-12 col-md-12"
      label="Servicios"
      v-model="valoresModel.servicios"
      :rules="valoresRules.servicios"
    ></q-input>
    <div class="col-xs-12">
      <div
        id="mapa-oficina"
        class="mapa"
      />
    </div>
    <div class="col-xs-12 text-right">
      <q-btn
        class="q-ml-sm"
        icon="close"
        label="Cancelar"
        @click="$emit('cancelar')"
      />
      <q-btn
        class="q-ml-sm"
        icon="check"
        color="primary"
        label="Guardar"
        type="submit"
      />
    </div>
  </q-form>
</template>
<script>

import { useVModel } from '../../../composables/useVModel.js'
// import { ref, onMounted, inject } from 'vue'
import { ref, onMounted } from 'vue'
import validaciones from '../../../common/validations'
import IconListOriginal from '../../../common/IconList'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const departamentos = [
  { label: 'LA PAZ', value: 'LA PAZ' },
  { label: 'COCHABAMBA', value: 'COCHABAMBA' },
  { label: 'ORURO', value: 'ORURO' },
  { label: 'POTOSI', value: 'POTOSI' },
  { label: 'TARIJA', value: 'TARIJA' },
  { label: 'SANTA CRUZ', value: 'SANTA CRUZ' },
  { label: 'BENI', value: 'BENI' },
  { label: 'PANDO', value: 'PANDO' },
  { label: 'CHUQUISACA', value: 'CHUQUISACA' }
]

const valoresRules = {
  nombre: [
    validaciones.requerido
  ],
  ruta: [
    validaciones.requerido
  ],
  icono: [
    validaciones.requerido
  ],
  orden: [
    validaciones.requerido
  ]
}

export default {
  props: {
    valores: {
      type: Object,
      default: () => ({})
    }
  },
  setup (props) {
    // const _http = inject('http')
    const valoresModel = useVModel(props, 'valores')
    const menus = ref([])
    const IconList = ref(IconListOriginal)
    let mymap = null

    onMounted(async () => {
      loadMap()
      // menus.value = await getMenus()
    })

    const loadMap = () => {
      try {
        const markers = L.layerGroup()
        mymap = L.map('mapa-oficina', {
          center: [-16.5, -68.15],
          zoom: 15,
          layers: [markers]
        })

        const myIcon = L.icon({
          iconRetinaUrl: require('../../../assets/marker.png'),
          iconUrl: require('../../../assets/marker.png'),
          imagePath: require('../../../assets/marker.png'),
          shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
          iconSize: [30, 30], // size of the icon
          iconAnchor: [15, 50], // point of the icon which will correspond to marker's location
          popupAnchor: [0, -50],
          shadowAnchor: [0, 0],
          shadowSize: [0, 0]
        })

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
          maxZoom: 18,
          attribution: '',
          id: 'mapbox/streets-v11',
          tileSize: 512,
          zoomOffset: -1
        }).addTo(mymap)

        if (valoresModel.value.latitud && valoresModel.value.longitud) {
          markers.clearLayers()
          L.marker({ lat: valoresModel.value.latitud, lng: valoresModel.value.longitud }, { icon: myIcon })
            .addTo(markers)
            .bindPopup(`Ubicacion de la oficina "${valoresModel.value.nombre}".`)
            .openPopup()
        }

        function onMapClick (e) {
          markers.clearLayers()
          L.marker(e.latlng, { icon: myIcon }).addTo(markers)
            .bindPopup(`Ubicacion de la oficina "${valoresModel.value.nombre}".`)
            .openPopup()
          valoresModel.value.latitud = e.latlng.lat
          valoresModel.value.longitud = e.latlng.lng
        }

        mymap.on('click', onMapClick)
      } catch (err) {
        console.log(err)
      }
    }

    const filtrarOpciones = (val, update) => {
      if (val === '') {
        update(() => {
          IconList.value = IconListOriginal
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        IconList.value = IconListOriginal.filter(v => v.toLowerCase().includes(needle))
      })
    }

    // async function getMenus () {
    //   const { rows } = await _http.get('/system/menus')
    //   return rows
    // }

    return {
      departamentos,
      IconList,
      IconListOriginal,
      valoresModel,
      valoresRules,
      menus,
      filtrarOpciones
    }
  }
}
</script>
<style scoped>
.mapa {
  width: 100%;
  height: 250px;
}
</style>
