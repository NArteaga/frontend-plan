<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-page-sticky position="top-left" :offset="[18,18]" expand>
      <img src="~assets/min_logo_2021_horizontal.png" style="max-width:350px;"/>
    </q-page-sticky>
    <q-page-sticky position="bottom-right" :offset="[18,18]" expand>
      <img src="~assets/logo-sippase.png" style="max-width:350px;"/>
    </q-page-sticky>
  </q-layout>
</template>

<script>
import { useQuasar } from 'quasar'
import { ref } from 'vue'

export default {

  setup () {
    const $q = useQuasar()
    const darkMode = ref($q.dark.isActive)

    return {
      darkMode,
      darkModeChange () {
        $q.dark.set(!$q.dark.isActive)
      }
    }
  }
}
</script>
