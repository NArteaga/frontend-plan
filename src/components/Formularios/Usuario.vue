<template>
  <q-form
    ref="usuario"
    @submit="$emit('guardar')"
  >
    <div class="row q-col-gutter-md">
      <div class="col-xs-12 text-subtitle1 text-secondary text-weight-bold">
        Datos personales
      </div>
      <div class="col-xs-12 col-md-4">
        <q-input
          filled
          class="required"
          :dense="dense"
          label="Cedula de identidad"
          v-model="valoresModel.numeroDocumento"
          :rules="valoresRules.numeroDocumento"
        ></q-input>
      </div>
      <div class="col-xs-12 col-md-4">
        <q-input
          filled
          :dense="dense"
          label="Nombres"
          class="required"
          v-model="valoresModel.nombres"
          :rules="valoresRules.numeroDocumento"
        ></q-input>
      </div>
      <div class="col-xs-12 col-md-4">
        <q-input
          filled
          :dense="dense"
          label="Primer apellido"
          class="required"
          v-model="valoresModel.primerApellido"
          :rules="valoresRules.numeroDocumento"
        ></q-input>
      </div>
      <div class="col-xs-12 col-md-4">
        <q-input
          filled
          :dense="dense"
          label="Segundo apellido"
          v-model="valoresModel.segundoApellido"
        ></q-input>
      </div>
      <div class="col-xs-12 col-md-4">
        <q-input
          filled
          :dense="dense"
          label="Telefono"
          v-model="valoresModel.telefono"
        ></q-input>
      </div>
      <div class="col-xs-12 col-md-4">
        <q-input
          filled
          :dense="dense"
          label="Celular"
          v-model="valoresModel.celular"
          :rules="valoresRules.celular"
        ></q-input>
      </div>
      <div class="col-xs-12 text-subtitle1 text-secondary text-weight-bold">
        Datos de usuario
      </div>
      <div class="col-xs-12 col-md-4">
        <q-select
          ref="entidad"
          filled
          :dense="dense"
          v-model="valoresModel.idEntidad"
          :options="entidades"
          label="Entidad"
          option-value="id"
          option-label="nombre"
          emit-value
          map-options
          :rules="valoresRules.id_rol"
          class="required"
          @input="getRoles($event,true)"
        />
      </div>
      <div class="col-xs-12 col-md-8">
        <q-input
          filled
          :dense="dense"
          label="Cargo"
          v-model="valoresModel.cargo"
        ></q-input>
      </div>
      <div class="col-xs-12 col-md-6">
        <q-select
          v-model="valoresModel.roles"
          filled
          :dense="dense"
          :options="roles"
          label="Rol"
          option-value="id"
          option-label="nombre"
          use-chips
          emit-value
          map-options
          multiple
          :rules="valoresRules.id_rol"
          class="required"
        />
      </div>
      <div class="col-xs-12 col-md-6">
        <q-input
          filled
          :dense="dense"
          label="Correo electronico"
          class="required"
          v-model="valoresModel.correoElectronico"
          :rules="valoresRules.correoElectronico"
        ></q-input>
      </div>
      <div class="col-xs-12 col-md-6">
        <q-input
          filled
          :dense="dense"
          label="Nombre Usuario"
          v-model="valoresModel.usuario"
          class="required"
          :rules="valoresRules.usuario"
        ></q-input>
      </div>
      <div class="col-xs-12 col-md-6">
        <q-input
          filled
          :dense="dense"
          label="Contraseña"
          class="required"
          v-model="valoresModel.contrasena"
          :rules="disableContrasena ? null : valoresRules.contrasena  "
        ></q-input>
      </div>
      <div class="col-xs-12 col-md-6">
        <q-input
          filled
          :dense="dense"
          :disable="disableContrasena"
          :readonly="disableContrasena"
          label="Confirmacion de contraseña"
          v-model="valoresModel.confirmarContrasena"
          :rules="disableContrasena ? null : valoresRules.contrasena"
        ></q-input>
      </div>

      <div class="col-xs-12 text-right q-gutter-sm">
        <q-btn
          icon="close"
          label="Cancelar"
          @click="$emit('cancelar')"
        />
        <q-btn
          icon="check"
          color="primary"
          label="Guardar"
          type="submit"
        />
      </div>
    </div>
  </q-form>
</template>
<script>

import { useVModel } from '../../composables/useVModel.js'
import { ref, onMounted, inject } from 'vue'
import validaciones from '../../common/validations'

const valoresRules = {
  nombre: [
    validaciones.requerido
  ],
  descripcion: [
    validaciones.requerido
  ],
  idEntidad: [
    validaciones.requerido
  ]
}

export default {
  props: {
    valores: {
      type: Object,
      default: () => ({})
    }
  },
  setup (props) {
    const _http = inject('http')
    const valoresModel = useVModel(props, 'valores')
    const entidades = ref([])
    const roles = ref([])

    onMounted(async () => {
      const { rows } = await _http.get('/system/entidades')
      entidades.value = rows
    })

    return {
      valoresModel,
      valoresRules,
      entidades,
      roles
    }
  }
}
</script>
