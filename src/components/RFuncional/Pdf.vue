<template>
  <q-dialog
    v-model="showPdfModel"
    @before-show="getPdf"
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
          Certificacion
        </q-toolbar-title>
        <q-space />
        <Estado estado="CERTIFICADO" />
        <q-btn
          flat
          round
          icon="close"
          @click="closeModal()"
        />
      </q-toolbar>
      <q-card-section align="center">
        <q-spinner-gears
          size="15em"
          color="info"
          v-if="!documento"
        />
        <p
          v-if="!documento"
          class="text-body1 text-info text-bold"
        >Generando documento pdf . . .</p>
        <iframe
          v-if="documento"
          :src="documento"
          frameborder="0"
          width="100%"
          height="500px"
        ></iframe>
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
    showPdf: { type: Boolean, default: false }
  },
  setup (props) {
    const showPdfModel = useVModel(props, 'showPdf')
    const Http = inject('http')
    const documento = ref('')

    function base64toBlob (base64Data, contentType) {
      contentType = contentType || ''
      const sliceSize = 1024
      const byteCharacters = window.atob(base64Data)
      const bytesLength = byteCharacters.length
      const slicesCount = Math.ceil(bytesLength / sliceSize)
      const byteArrays = new Array(slicesCount)

      for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        const begin = sliceIndex * sliceSize
        const end = Math.min(begin + sliceSize, bytesLength)

        const bytes = new Array(end - begin)
        for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
          bytes[i] = byteCharacters[offset].charCodeAt(0)
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes)
      }
      return new Blob(byteArrays, { type: contentType })
    }

    async function getPdf () {
      documento.value = null
      documento.value = await Http.get(`rfuncional/solicitudes/${props.idReclamo}/certificado`)
      documento.value = URL.createObjectURL(base64toBlob(documento.value, 'application/pdf'))
    }

    function closeModal () {
      showPdfModel.value = false
    }

    function getNombreCompleto (usuario) {
      if (!usuario) return ''
      return `${usuario.nombres} ${usuario.primerApellido} ${usuario.segundoApellido}`
    }

    return {
      documento,
      getNombreCompleto,
      closeModal,
      getPdf,
      showPdfModel
    }
  }
}
</script>
