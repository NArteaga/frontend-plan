<template>
  <section>
    <q-chip
      v-if="estado === 'ACTIVO'"
      square
      color="info"
      text-color="white"
      label="ACTIVO"
    />
    <q-chip
      v-if="estado === 'INACTIVO'"
      square
      color="warning"
      text-color="white"
      label="INACTIVO"
    />

    <q-chip
      v-if="estado === 'EN ESPERA'"
      square
      color="accent"
      text-color="white"
      label="EN ESPERA"
    />

    <q-chip
      v-if="estado === 'EN ATENCION'"
      square
      color="orange"
      text-color="white"
      label="EN ATENCION"
    />

    <q-chip
      v-if="estado === 'ATENDIDO'"
      square
      color="positive"
      text-color="white"
      label="ATENDIDO"
    />

    <q-chip
      v-if="estado === 'ARCHIVADO'"
      square
      color="blue-grey"
      text-color="white"
      label="ARCHIVADO"
    />

    <q-chip
      v-if="estado === 'NO CORRESPONDE'"
      square
      color="negative"
      text-color="white"
      label="NO CORRESPONDE"
    />

    <q-chip
      v-if="estado === 'CERRADO'"
      square
      color="indigo"
      text-color="white"
      label="CERRADO"
    />

    <q-chip
      v-if="estado === 'ADMITIDO'"
      square
      color="positive"
      text-color="white"
      label="ADMITIDO"
    />

    <q-chip
      v-if="estado === 'INICIO'"
      square
      color="info"
      text-color="white"
      label="INICIO"
    />

    <q-chip
      v-if="estado === 'PENDIENTE'"
      square
      color="warning"
      text-color="white"
      label="PENDIENTE"
    />

    <q-chip
      v-if="estado === 'CERTIFICADO'"
      square
      color="positive"
      text-color="white"
      label="CERTIFICADO"
    />

    <q-chip
      v-if="estado === 'VERIFICADO'"
      square
      color="positive"
      text-color="white"
      label="VERIFICADO"
    />

    <q-chip
      v-if="estado === 'RECHAZADO'"
      square
      color="negative"
      text-color="white"
      label="RECHAZADO"
    />

    <q-chip
      v-if="estado === 'CANCELADO'"
      square
      color="negative"
      text-color="white"
      label="CANCELADO"
    />

    <q-chip
      v-if="estado === 'ANULADO'"
      square
      color="secondary"
      text-color="white"
      label="ANULADO"
    />
  </section>
</template>
<script>
export default {
  props: {
    estado: {
      type: String,
      default: () => 'ACTIVO'
    }
  }
}
</script>
