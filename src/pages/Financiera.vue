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
                <q-tab name="presupuesto" icon="wallet" label="Presupuesto" />
                <q-tab name="ejecucion" icon="receipt_long" label="Ejecucion" />
                <q-tab name="partidaPresupuestaria" icon="shopping_bag" label="Partida Presupuestaria" />
                <q-tab name="organismoFinanciera" icon="account_balance_wallet" label="Organismo Financiador" />
            </q-tabs>
            <q-tab-panels v-model="tab" animated class="transparent">
                <q-tab-panel  name="presupuesto" class="q-pa-none">
                  <Presupuesto />
                </q-tab-panel>
                <q-tab-panel  name="ejecucion" class="q-pa-none">
                  <Ejecucion />
                </q-tab-panel>
                <q-tab-panel  name="partidaPresupuestaria" class="q-pa-none">
                  <PartidaPresupuestaria />
                </q-tab-panel>
                <q-tab-panel  name="organismoFinanciera" class="">
                  <OrganismoFinanciador />
                </q-tab-panel>
            </q-tab-panels>
        </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import OrganismoFinanciador from '@components/Financiera/OrganismoFinanciador'
import PartidaPresupuestaria from '@components/Financiera/PartidaPresupuestaria'
import Presupuesto from '@components/Financiera/Presupuesto'
import Ejecucion from '@components/Financiera/Ejecucion'

export default {
  components: {
    OrganismoFinanciador,
    PartidaPresupuestaria,
    Presupuesto,
    Ejecucion
  },
  setup () {
    const tab = ref('presupuesto')
    return {
      tab
    }
  }
}
</script>
