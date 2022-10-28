<template>
  <q-page>
    <Titulo
      titulo="Planificación"
      icono="content_paste"
    ></Titulo>
    <div class="row">
        <div class="col-xs-12">
            <q-tabs
            v-model="tab"
            dense
            class="text-black"
            active-color="indigo"
            indicator-color="indigo"
            align="justify"
            narrow-indicator
            inline-label
            >
                <q-tab name="gestion" icon="settings" label="Estructura" />
                <q-tab name="planificacion" icon="book" label="Planificación" />
                <!--<q-tab name="seguimiento" label="Seguimiento" v-if="$permisos.and('seguimiento:listar')" />-->
            </q-tabs>
            <q-tab-panels v-model="tab" animated class="transparent">
                <q-tab-panel  name="gestion" class="q-pa-none">
                    <Estructura />
                </q-tab-panel>
                <q-tab-panel  name="planificacion" class="q-pa-none">
                  <Planificacion />
                </q-tab-panel>
                <q-tab-panel  name="formulacion" class="q-pa-none">
                    <Formulacion />
                </q-tab-panel>
                <!-- <q-tab-panel  name="seguimiento" class="q-pa-none">
                    <Seguimiento />
                </q-tab-panel>
                <q-tab-panel  name="reformulacion" class="q-pa-none">
                    <Reformulacion />
                </q-tab-panel> -->
            </q-tab-panels>
        </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import Planificacion from '@components/Planificacion/Planificacion'
import Estructura from '@components/Planificacion/Estructura'
import Formulacion from '@components/Planificacion/Formulacion'
// import Reformulacion from '@components/Planificacion/Reformulacion'
// import Seguimiento from 'src/components/Planificacion/Seguimiento/index.vue'

export default {
  components: {
    Estructura,
    Planificacion,
    Formulacion
    // Seguimiento,
    // Reformulacion
  },
  setup () {
    const tab = ref('gestion')
    // const permisos = inject('permisos')

    /* onMounted(async () => {
      if (permisos.and(['poappto:listar'])) {
        tab.value = 'poa'
      } else {
        tab.value = 'seguimiento'
      }
    }) */

    return {
      tab
    }
  }
}
</script>
