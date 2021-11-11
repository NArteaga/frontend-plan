<template>
  <q-page>
    <Titulo
      titulo="Dashboard"
      icono="dashboard"
    ></Titulo>
   <div class="q-pa-md row items-start q-gutter-md">
     <div  v-for="i in almacenes" :key="i">
    <q-card  :style="{ 'background-color': i.color}">
      <q-card-section>
        <div class="text-h6">{{i.nombre}}</div>
      </q-card-section>
      <q-separator dark />
      <q-card-actions>
     <div class="q-pa-md" style="max-width: 300px;">
    <q-toggle v-model="visible" dense label="Ver detalle" class="q-mb-md" />
    <q-slide-transition>
      <div v-show="visible">
         {{i.lugar}}
         {{i.observacion}}
         {{i.descripcion}}
      </div>
    </q-slide-transition>
  </div>
      </q-card-actions>
    </q-card>
     </div>
   </div>
    <!-- <q-card
      class="q-mx-md"
      style="min-height: 300px;"
    >
      <q-card-section>
        <p class="text-h5 text-bold text-center">FRONTEND BASE</p>
      </q-card-section>
    </q-card> -->
  </q-page>
</template>

<script>
import { ref, inject, onMounted } from 'vue'
export default {
  name: 'Dashboard',
  setup () {
    const _http = inject('http')
    const almacenes = ref([])
    onMounted(async () => {
      almacenes.value = await getAlmacenes()
      console.log('ALMA', almacenes.value)
    })
    async function getAlmacenes () {
      const { rows } = await _http.get('/almacenes/almacen')
      return rows
    }
    return {
      visible: ref(false),
      almacenes
    }
  }
}
</script>
