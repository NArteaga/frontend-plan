<template>
  <q-dialog
    v-model="showHistorialModel"
    @before-show="getHistorial"
    persistent
  >
    <q-card style="width: 700px; max-width: 90vw;">
      <q-toolbar class="q-pa-md ">
        <q-icon
          name="timeline"
          size="md"
        />
        <q-toolbar-title
          shrink
          class="text-body1 text-bold"
        >
          Historial
        </q-toolbar-title>
        <q-space />
        <Estado :estado="reclamo.estado" />
        <q-btn
          flat
          round
          icon="close"
          @click="closeModal()"
        />
      </q-toolbar>
      <q-card-section class="no-padding">
        <q-scroll-area style="height: 70vh;">
          <q-timeline class="q-px-xl">
            <q-timeline-entry
              :icon="index === 0 ? 'remove_red_eye' : 'done_all' "
              v-for="(historial, index) of reclamo.rows"
              :key="index"
              :color="index === 0 ? 'info' : 'positive'"
            >
              <template v-slot:title>
                <span class="text-bold text-body2">RESEÑA: </span>
                <span class="text-body2">
                  {{ historial.justificacion }}
                </span>
              </template>
              <template v-slot:subtitle>
                <Estado :estado="historial.estado" />
                Fecha de registro: {{ historial.createdAt }}
              </template>

              <div class="text-caption">
                <!-- <span class="text-body2"><span class="text-bold">USUARIO QUE ATENDIÓ:</span> {{ getNombreCompleto(historial.usuarioCreacion) }}</span> -->
                <!-- <br> -->
                <q-btn
                  icon="remove_red_eye"
                  color="accent"
                  flat
                  v-if="historial.documentoRespaldo"
                  :label="historial.documentoRespaldo"
                  @click="openAdjunto(reclamo.id, historial.documentoRespaldo)"
                />
              </div>
            </q-timeline-entry>
          </q-timeline>
        </q-scroll-area>

      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          label="aceptar"
          icon="done_all"
          color="positive"
          @click="closeModal()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { useVModel } from 'src/composables/useVModel'
import { inject, ref } from 'vue'

export default {
  props: {
    idReclamo: { type: String, default: '' },
    showHistorial: { type: Boolean, default: false }
  },
  setup (props) {
    const showHistorialModel = useVModel(props, 'showHistorial')
    const Http = inject('http')
    const reclamo = ref({})

    async function getHistorial () {
      reclamo.value = await Http.get(`rfuncional/historial/?rfuncionalSolicitudId=${props.idReclamo}`)
      console.log(reclamo.value)
      console.log(reclamo.value.historial)
      console.log(reclamo.value.rows)
    }

    function closeModal () {
      showHistorialModel.value = false
    }

    function getNombreCompleto (usuario) {
      if (!usuario) return ''
      return `${usuario.nombres} ${usuario.primerApellido} ${usuario.segundoApellido}`
    }

    function openAdjunto (idReclamo, nombreArchivo) {
      window.open(`${process.env.BACKEND_URL}/${idReclamo}/${nombreArchivo}`)
    }

    return {
      openAdjunto,
      getNombreCompleto,
      closeModal,
      reclamo,
      getHistorial,
      showHistorialModel
    }
  }
}
</script>
