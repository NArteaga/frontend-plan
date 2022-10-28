<template>
    <q-chip
        :label="label"
        :color="getColor(label)"
        dark
    />
</template>
<script>
const colores = {
  'EN PROCESO': 'negative',
  'POR REVISAR': 'warning',
  'POR APROBAR': 'warning',
  'POR VALIDAR': 'warning',
  'POR FIRMAR': 'warning',
  CONCLUIDO: 'positive',
  OBSERVADO: 'orange'
}
export default {
  props: {
    label: String
  },
  setup (props) {
    return {
      getColor: () => {
        return colores[props.label] || 'grey'
      }
    }
  }
}
</script>
