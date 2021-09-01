export default {
  methods: {
    async cambiarEstado (update, registro) {
      console.log('Cambiar estado', registro)
      try {
        const estadoOriginal = registro.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO'
        this.$q.dialog({
          title: 'Atención',
          message: `Esta seguro de que quiere ${registro.estado === 'ACTIVO' ? 'activar' : 'desactivar'} este registro?`,
          ok: {
            color: 'secondary',
            label: 'Aceptar'
          },
          cancel: {
            color: 'white',
            'text-color': 'black',
            label: 'Cancelar'
          },
          persistent: true
        }).onOk(async () => {
          await this.$http.put(`${this.url}/${registro.id}`, { estado: registro.estado })
          update()
        }).onCancel(() => {
          registro.estado = estadoOriginal
        })
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    async eliminar (update, id) {
      try {
        this.$q.dialog({
          title: 'Atención',
          message: 'Está seguro de que quiere eliminar este registro?',
          ok: {
            color: 'secondary',
            label: 'Aceptar'
          },
          cancel: {
            color: 'white',
            'text-color': 'black',
            label: 'Cancelar'
          },
          persistent: true
        }).onOk(async () => {
          await this.$http.delete(`${this.url}/${id}`)
          update()
        })
      } catch (error) {
        this.$message.error(error.message)
      }
    }
  }
}
