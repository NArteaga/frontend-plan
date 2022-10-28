<template>
  <q-card class="my-card">
    <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
      <div class="absolute-bottom text-subtitle2 text-center">
        Pruebas unidades
      </div>
    </q-img>
    <q-card-section>
      <div class="row">
        <q-btn flat round color="primary" icon="badge" />
        <q-btn flat round color="primary" icon="edit_note" />
        <q-btn flat round color="primary" icon="insert_chart_outlined" />
      </div>
    </q-card-section>
  </q-card>
</template>
<script>
export default {
  name: 'Card',
  props: {}
}
</script>
