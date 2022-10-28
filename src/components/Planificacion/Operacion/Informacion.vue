<template>
    <div class="row">
        <q-item class="col-xs-3 col-md-2">
            <q-item-section>
                <q-item-label caption><b>Codigo:</b></q-item-label>
                <q-item-label >{{operacion?.codigo}}</q-item-label>
            </q-item-section>
        </q-item>
        <q-item class="col-xs-9 col-md-10">
            <q-item-section>
                <q-item-label caption><b>Descripción:</b></q-item-label>
                <q-item-label >{{operacion?.descripcion}}</q-item-label>
            </q-item-section>
        </q-item>
        <q-item v-if="completo" class="col-xs-3 col-md-2">
            <q-item-section>
                <q-item-label caption><b>Indicador:</b></q-item-label>
                <q-item-label >{{operacion?.tipoMeta}}</q-item-label>
            </q-item-section>
        </q-item>
        <q-item v-if="completo" class="col-xs-3 col-md-2">
            <q-item-section>
                <q-item-label caption><b>Meta:</b></q-item-label>
                <q-item-label >{{operacion?.meta}}</q-item-label>
            </q-item-section>
        </q-item>
        <q-item v-if="completo" class="col-xs-3 col-md-2">
            <q-item-section>
                <q-item-label caption><b>Fecha Inicio:</b></q-item-label>
                <q-item-label >{{operacion?.fechaInicio}}</q-item-label>
            </q-item-section>
        </q-item>
        <q-item v-if="completo" class="col-xs-3 col-md-2">
            <q-item-section>
                <q-item-label caption><b>Fecha Fin:</b></q-item-label>
                <q-item-label >{{operacion?.fechaFin}}</q-item-label>
            </q-item-section>
        </q-item>
        <q-item v-if="completo" class="col-xs-3 col-md-2">
            <q-item-section>
                <q-item-label caption><b>Ponderacion:</b></q-item-label>
                <q-item-label >
                    <q-chip dark color="primary" :label="`${operacion?.ponderacion} %`" />
                </q-item-label>
            </q-item-section>
        </q-item>
    </div>
</template>
<script>
export default {
  props: {
    operacion: Object,
    completo: {
      type: Boolean,
      default: true
    }
  },
  setup (props) {

  }
}
</script>
