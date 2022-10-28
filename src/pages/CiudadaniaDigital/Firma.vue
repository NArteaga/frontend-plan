<template>
  <q-layout view="lHh Lpr lFf">
    <q-header :class="{ 'bg-white': ! $q.dark.isActive, 'q-dark': $q.dark.isActive }">
      <q-toolbar>
        <img
          src="https://firma.demo.gtic.gob.bo/img/logo_ciudadania2.png"
          width="150"
        />
        <q-space />
        <img
          src="https://firma.demo.gtic.gob.bo/img/logo_bolivia.png"
          width="70"
        />
      </q-toolbar>
    </q-header>
    <q-page-container style="padding-top:15px">
      <div class="row justify-center">
        <div class="column items-center col-12">
          <p>
            Confirmación de aprobación de documentos y envío a la cadena de bloques
          </p>
          <p>
            Documento: Poa Demo <br />
            Sistema: MJTI - SAJ
          </p>
          <p class="alert q-mr-lg">
            Descargue este documento, así podrá verificarlo cuando lo requiera.
          </p>
          <iframe
            style=" width:70vw; height:50vh"
            :src="pdfFile"
          />
        </div>
        <div class="col-12 column items-center q-pt-md">
          <p>
            ¿Deseas aprobar este documento con Ciudadanía digital?
          </p>
        </div>
        <div class="col-6 column items-end q-pb-lg">
          <q-btn
            rounded
            size="md"
            color="indigo-10"
            class="q-mr-md"
            label="Rechazar"
            to="/app/bandeja"
          />
        </div>
        <div class="col-6 column items-start q-pb-lg">
          <q-btn
            rounded
            size="md"
            color="light-green-14"
            label="Confirmar"
            @click="confirmar"
          />
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { useQuasar } from 'quasar'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import usePlugins from '../../common/usePlugins'

export default {

  setup () {
    const { Http } = usePlugins()
    const $q = useQuasar()
    const darkMode = ref($q.dark.isActive)
    const route = useRoute()
    const pdfFile = ref()
    const urlBase = ref(process.env.BACKEND_URL)
    const tokenAprobacion = ref(process.env.TOKEN_LOCAL_APROBACION)

    const uuidv4 = () => {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      )
    }

    onMounted(async _ => {
      const result = await Http.get(`planificacion/formulacion/${route.query.formulacion}/poa-pdf`)
      pdfFile.value = `data:application/pdf;base64,${result}`
    })

    const confirmar = () => {
      if (urlBase.value && tokenAprobacion.value) {
        const tramite = route.query.tramite
        const headers = {
          Authorization: tokenAprobacion.value
        }
        const body = {
          aceptado: true,
          introducido: true,
          requestUuid: tramite,
          codigoOperacion: uuidv4(),
          mensaje: 'COMPLETADO DE PRUEBAS',
          transaction_id: uuidv4(),
          fechaHoraSolicitud: Date.now(),
          hashDatos: '53b9f4e881e3b097b4e58e79fed7a93bcd5c21ca991c7387f492adccb548d962',
          ci: '7039950'
        }

        axios.post(`${urlBase.value}/ciudadania/aprobacion`, body, { headers })
          .then(({ data }) => {
            if (data.finalizado) {
              window.location.href = `/#/ciudadania/documento-aprobado?requestUuid=${tramite}&estado=true&finalizado=true&mensaje=firmado&linkVerificacion=http://gob.bo/&linkVerificacionVerificacionUnico=http://gob.bo&transactionCode=qweqweqwe-qweqwe-qwe`
            }
          }).catch(error => {
            $q.notify({
              type: 'negative',
              position: 'top-right',
              message: 'Error en aprobacion ciudadania digital LOCAL ' + error
            })
          })
      } else {
        $q.notify({
          position: 'top-right',
          type: 'negative',
          message: 'Error de configuracion para aprobacion LOCAL'
        })
      }
    }

    const onClick = () => {
    }

    return {
      darkMode,
      pdfFile,
      onClick,
      darkModeChange () {
        $q.dark.set(!$q.dark.isActive)
      },
      confirmar
    }
  }
}
</script>
<style scoped>
.alert {
  border-style: solid;
  border-color: #8fd300;
  background: #8fd30024;
  color: #2b2b2b;
  padding: 10px 5px;
  border-width: thin;
  border-radius: 8px;
  text-align: center;
}
</style>
