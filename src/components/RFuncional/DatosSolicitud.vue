<template>
  <q-dialog v-model="dialogAccion">
    <q-card style="width: 700px; max-width: 90vw;">
      <q-toolbar class="q-pt-md q-px-md text-primary">
        <q-icon
          name="timeline"
          size="md"
        />
        <q-toolbar-title
          shrink
          class="text-body1 text-bold "
        >
          Registrar acción
        </q-toolbar-title>
        <q-space />
        <q-btn
          flat
          round
          icon="close"
          @click="closeModalAccion()"
        />
      </q-toolbar>
      <q-card-section>
        <q-form
          class="row q-col-gutter-sm"
          @submit="guardarAccion"
        >
          <q-input
            type="textarea"
            class="col-xs-12"
            filled
            label="Reseña"
            v-model="accion.justificacion"
            :rules="accionRules.justificacion"
          />
          <q-file
            accept=".pdf"
            class="col-xs-12 col-md-8"
            filled
            label="Adjuntar pdf"
            v-model="accion.adjunto"
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
          <q-select
            :options="estados"
            class="col-xs-12 col-md-4"
            label="Estado"
            filled
            v-model="accion.estado"
            :rules="accionRules.estado"
          />
          <div class="col-xs-12 text-right q-gutter-sm">
            <q-btn
              label="Cancelar"
              icon="close"
              @click="closeModalAccion"
            />
            <q-btn
              color="primary"
              label="Registrar"
              icon="done_all"
              type="submit"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showDatosModal"
    @before-show="getDatos"
    persistent
  >
    <q-card style="width: 900px; max-width: 90vw;">
      <q-toolbar class="q-pt-md q-px-md text-primary">
        <q-icon
          name="account_tree"
          size="md"
        />
        <q-toolbar-title
          shrink
          class="text-body1 text-bold "
        >
        Solicitud: {{ valoresModel.nombre }}
        </q-toolbar-title>
        <q-space />
        <Estado :estado="valoresModel.estado" />
        <q-btn
          flat
          round
          icon="close"
          @click="closeModal()"
        />
      </q-toolbar>
      <q-card-section>
  <q-form
    class="row q-col-gutter-md"
    @submit="$emit('guardar')"
  >
    <q-input
      filled
      readonly
      class="col-xs-12 col-md-8"
      label="Nombre"
      v-model="valoresModel.nombre"
      :rules="valoresRules.nombre"
    ></q-input>
    <q-input
      filled
      readonly
      class="col-xs-12 col-md-4"
      label="Departamento"
      v-model="valoresModel.departamento"
      :rules="valoresRules.departamento"
    ></q-input>
    <q-input
      filled
      readonly
      class="col-xs-12 col-md-12"
      label="Direccion"
      v-model="valoresModel.direccion"
      :rules="valoresRules.direccion"
    ></q-input>
    <q-input
      filled
      readonly
      type="textarea"
      class="col-xs-12 col-md-12"
      label="Descripcion"
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
        label="Cancelar"
        icon="close"
        @click="closeModal"
      />
      <q-btn
        @click="dialogAccion = true"
        label="Registrar acción"
        icon="done_all"
        color="primary"
      />
    </div>
  </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>

import { useVModel } from '../../composables/useVModel.js'
// import { ref, onMounted, inject } from 'vue'
import { ref, inject } from 'vue'
import axios from 'axios'
import validations from 'src/common/validations'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

export default {
  props: {
    idReclamo: { type: String, default: '' },
    valores: {
      type: Object,
      default: () => ({})
    },
    showDatos: { type: Boolean, default: false }
  },
  setup (props, { emit }) {
    const Http = inject('http')
    const instituciones = ref([])
    const valoresRules = ref({})
    const archivo = ref(null)
    const Storage = inject('storage')
    const Message = inject('message')
    let mymap = null

    const loadMap = () => {
      try {
        const markers = L.layerGroup()
        mymap = L.map('mapa-oficina', {
          center: [-16.5, -68.15],
          zoom: 15,
          layers: [markers]
        })

        const myIcon = L.icon({
          iconRetinaUrl: require('../../assets/marker.png'),
          iconUrl: require('../../assets/marker.png'),
          imagePath: require('../../assets/marker.png'),
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
        // console.log(err)
      }
    }
    // MODAL SHOW DATA -------------------------------------------
    const showDatosModal = useVModel(props, 'showDatos')
    const valoresModel = ref({})

    async function getDatos () {
      valoresModel.value = await Http.get(`rfuncional/solicitudes-pendientes/${props.idReclamo}`)
      resetForm()
      loadMap()
    }

    function closeModal () {
      showDatosModal.value = false
    }

    // MODAL ACCION ---------------------------------------------
    const dialogAccion = ref(false)
    const accion = ref([])
    const estados = ['PENDIENTE', 'CERTIFICADO', 'CANCELADO', 'ANULADO']
    const accionRules = {
      justificacion: [validations.requerido],
      estado: [validations.requerido]
    }

    function resetForm () {
      accion.value = {
        rfuncionalSolicitudId: valoresModel.value.id,
        justificacion: '',
        adjunto: '',
        latitud: '',
        longitud: '',
        estado: valoresModel.value.estado
      }
    }

    function closeModalAccion () {
      dialogAccion.value = false
      resetForm()
    }

    async function guardarAccion () {
      try {
        await axios({
          url: `${process.env.API_URL}rfuncional/historial/`,
          method: 'POST',
          data: convertFormData(accion.value),
          headers: {
            Authorization: `Bearer ${Storage.get('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        })
        Message.success('Accion registrada correctamente.')
        closeModalAccion()
        closeModal()
        emit('update')
      } catch (error) {
        Message.error('Ocurrio un error al registrar la accion.')
      }
    }

    function convertFormData (value) {
      const formData = new FormData()
      for (const key in value) {
        formData.append(key, value[key])
      }
      return formData
    }
    // ---------------------------------------------------
    async function subirArchivoPublico () {
      const { data } = await axios({
        url: `${process.env.API_URL}public/archivo-adjunto-publico`,
        method: 'POST',
        data: convertFormData({ archivo: archivo.value }),
        headers: {
          Authorization: `Bearer ${Storage.get('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      valoresModel.value.rutaLogo = data.datos
    }
    return {
      // View Data -------------
      getDatos,
      closeModal,
      // Accion ----------------
      estados,
      accionRules,
      dialogAccion,
      closeModalAccion,
      resetForm,
      accion,
      guardarAccion,
      // ----------
      archivo,
      subirArchivoPublico,
      valoresModel,
      valoresRules,
      instituciones,
      showDatosModal
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
