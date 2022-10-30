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
                <q-tab name="gestion" icon="settings" label="Configuración" />
                <q-tab name="planificacion" icon="book" label="Planificación" />
                <q-tab name="pilar" icon="account_balance" label="Pilar" />
                <!--<q-tab name="seguimiento" label="Seguimiento" v-if="$permisos.and('seguimiento:listar')" />-->
            </q-tabs>
            <q-tab-panels v-model="tab" animated class="transparent">
                <q-tab-panel  name="gestion" class="q-pa-none">
                    <Estructura />
                </q-tab-panel>
                <q-tab-panel  name="planificacion" class="q-pa-none">
                  <Planificacion />
                </q-tab-panel>
                <q-tab-panel  name="pilar" class="">
                  <Pilar />
                </q-tab-panel>
            </q-tab-panels>
        </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import Planificacion from '@components/Planificacion/Planificacion'
import Estructura from '@components/Planificacion/Estructura'
import Pilar from '@components/Planificacion/Pilar'
// import Reformulacion from '@components/Planificacion/Reformulacion'
// import Seguimiento from 'src/components/Planificacion/Seguimiento/index.vue'

export default {
  components: {
    Estructura,
    Planificacion,
    Pilar
    // Seguimiento,
    // Reformulacion
  },
  setup () {
    const tab = ref('gestion')
    return {
      tab
    }
  }
}
</script>
