<template>
  <section>
    <q-dialog v-model="dialogModel">
      <q-card>
        <q-card-section>
          <q-form class="row q-col-gutter-md">
            <q-input
              v-for="(item, index) in 2"
              :key="index"
              v-model="usuarioModel"
            ></q-input>
            <q-input
              v-for="(item, index) in 3"
              :key="index"
              v-model="passwordModel"
            ></q-input>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </section>
  <section>
    dnjkndjknkdjwq
  </section>
</template>
<script>
import { useVModel } from '../composables/useVModel.js'

export default {
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    usuario: {
      type: String,
      default: 'SN'
    },
    contrasena: {
      type: String,
      default: 'SP'
    }
  },
  setup (props) {
    const usuarioModel = useVModel(props, 'usuario')
    const passwordModel = useVModel(props, 'contrasena')
    const dialogModel = useVModel(props, 'dialog')

    return {
      dialogModel,
      usuarioModel,
      passwordModel
    }
  }
}
</script>
