<template>
    <q-list dense  class="rounded-borders q-px-none">
      <q-item v-ripple v-if="adicionar">
        <q-item-section>
          <q-btn color="primary" flat size="sm" icon="add" label="adicionar" @click="openDialog" />
        </q-item-section>
      </q-item>

      <q-item v-ripple v-for="(documento, index) in documentos" :key="index">
        <q-item-section avatar  class="q-px-none" style="min-width: 36px">
          <q-btn round flat color="negative" icon="picture_as_pdf" @click="goDocumento(documento)" />
        </q-item-section>
        <q-item-section class="ellipsis-2-lines">
            {{documento.nombre}}
        </q-item-section>
        <q-item-section side v-if="adicionar">
            <q-btn color="negative" icon="delete" round size="sm" flat @click="modificar(documento, index)" />
        </q-item-section>
      </q-item>
    </q-list>
    <q-dialog v-model="dialog" persistent>
        <q-card>
            <q-toolbar class="bg-grey-5">
                <q-btn flat round dense icon="attach_file" />
                <q-toolbar-title class="text-weight-medium">
                    Nuevo documento de respaldo
                </q-toolbar-title>
            </q-toolbar>
            <q-card-section class="row q-col-gutter-md">
              <div class="col-xs-12 text-justify">
                <span class="text-subtitle2 text-weight-bold">Medios de Verificacion :</span>
                Puedes registrar documentacion de respaldo referente a  <span v-for="(medio,index) in mediosVerificacion" :key="index">
                  {{medio}}, </span> y/o otros
              </div>
                 <q-file
                    filled
                    bottom-slots
                    v-model="archivo"
                    label="Archivo Adjunto"
                    counter
                    max-files="1"
                    class="col-xs-12 full-width q-py-2"
                    max-file-size="10000000"
                    @rejected="onRejected"
                >
                    <template v-slot:before>
                    <q-icon name="folder_open" />
                    </template>

                    <template v-slot:append>
                    <q-btn
                        round
                        dense
                        flat
                        icon="add"
                        @click.stop
                    />
                    </template>
                </q-file>
                <q-input
                    filled
                    v-model="documento.nombre"
                    label="Nombre del Documento"
                    clearable
                    class="col-xs-12 full-width q-py-2"
                />

                <div class="col-xs-12 text-center">
                    <q-img
                    v-if="['png','jpeg','jpg','gif'].includes(documento.extension)"
                    :src="documento.ruta"
                    spinner-color="white"
                    style="height: 300px; max-width: 300px"
                    />
                    <div v-if="['pdf'].includes(documento.extension)">
                    <iframe
                        :src="documento.ruta"
                        width="100%"
                        height="400px"
                    />
                    </div>
                </div>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn flat label="cancelar" color="negative" @click="closeDialog" />
                <q-btn label="Guardar" color="primary" @click="guardar" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
<script>
import { useVModel } from 'src/composables/useVModel'
import { inject, ref, watch } from 'vue'
import { useQuasar } from 'quasar'

export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    idCronograma: String,
    adicionar: {
      type: Boolean,
      default: false
    },
    mediosVerificacion: {
      type: Array,
      default: () => []
    }
  },
  setup (props) {
    const _http = inject('http')
    const $q = useQuasar()
    const documentos = useVModel(props, 'value')
    const documento = ref({})
    const dialog = ref(false)
    const archivo = ref(null)
    const cite = ref(null)

    watch(archivo, async (newValue, oldValue) => {
      if (newValue) {
        const form = new FormData()
        form.append('adjunto', newValue)
        const respuesta = await _http.post('planificacion/cronograma/documento/upload', form)

        documento.value = {
          ...documento.value,
          nombre: newValue.name.split('.').slice(0, -1).join('.'),
          extension: (newValue.name.split('.').pop()).toLowerCase(),
          ruta: respuesta
        }
      }
    })

    const openDialog = () => {
      documento.value = {}
      dialog.value = true
    }

    const closeDialog = () => {
      documento.value = {}
      dialog.value = false
    }

    const guardar = async () => {
      const respuesta = await _http.post(`planificacion/cronograma/${props.idCronograma}/documento`, documento.value)
      documentos.value = respuesta.documentos
      closeDialog()
    }

    const modificar = async (documento, index) => {
      $q.dialog({
        html: true,
        title: '<i class="q-icon text-orange material-icons" style="font-size: 35px;">gpp_maybe</i> <b class="q-mt-md">Confirmación</b>',
        message: '¿Esta seguro de <b>ELIMINAR</b> el documento?.',
        persistent: true,
        ok: {
          color: 'primary',
          label: 'Aceptar'
        },
        cancel: {
          color: 'white',
          'text-color': 'black',
          label: 'Cancelar'
        }
      }).onOk(async () => {
        const datos = documentos.value
        datos.splice(index, 1)
        const respuesta = await _http.patch(`planificacion/cronograma/${props.idCronograma}/documentos`, datos)
        documentos.value = respuesta.documentos
      }).onCancel(async () => {
      })
    }

    const goDocumento = (documento) => {
      if (documento.ruta) {
        window.open(documento.ruta)
      }
    }

    return {
      documentos,
      documento,
      dialog,
      archivo,
      cite,
      openDialog,
      closeDialog,
      guardar,
      modificar,
      onRejected (rejectedEntries) {
        $q.notify({
          type: 'negative',
          message: `${rejectedEntries.length} El archivo pesa mas de 10 MB, permitidos`
        })
      },
      goDocumento
    }
  }
}
</script>
