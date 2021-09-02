<template>
  <q-page class="flex flex-center">
    <div class="row q-col-gutter-md justify-center">
      <div class="col-xs-12 text-center">
        <p class="text-h4 text-bold">Frontend base</p>
      </div>
      <div class="col-xs-12 flex flex-center">
        <q-card style="width: 400px; max-width: 95vw;">
          <q-toolbar class="q-pa-md">
            <q-toolbar-title>
              <span> Ingresar como usuario</span>
            </q-toolbar-title>
          </q-toolbar>
          <q-card-section class="q-pt-none">
            <q-form @submit="login">
              <q-input
                filled
                v-model="formulario.usuario"
                label="Usuario o correo electrónico"
                lazy-rules
                square
                class="q-mb-md"
                autofocus
                :rules="rulesLogin.usuario"
              >
                <template v-slot:append>
                  <q-icon
                    name="people"
                    color="primary"
                  />
                </template>
              </q-input>
              <q-input
                filled
                v-model="formulario.contrasena"
                label="Contraseña"
                lazy-rules
                square
                :type="isPwd ? 'password' : 'text'"
                :rules="rulesLogin.contrasena"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                    color="primary"
                  />
                </template>
              </q-input>
              <q-btn
                color="primary"
                type="submit"
                size="16px"
                padding="10px"
                no-caps
                class="full-width q-ma-md"
                label="Ingresar"
              />
              <div class="text-center">ó</div>
              <q-btn
                color="secondary"
                size="16px"
                padding="10px"
                no-caps
                class="full-width q-ma-md"
                label="Ingresar con Ciudadania"
                @click="loginCiudadania"
              />
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>

import { reactive, ref, inject } from 'vue'
import validaciones from '../common/validations'

const rulesLogin = {
  usuario: [
    validaciones.requerido
  ],
  contrasena: [
    validaciones.requerido,
    validaciones.contrasena
  ]
}

export default {
  setup () {
    const isPwd = ref(true)
    const _auth = inject('auth')
    const formulario = reactive({
      usuario: '',
      contrasena: ''
    })

    const login = async () => {
      await _auth.login({ usuario: formulario.usuario, contrasena: formulario.contrasena })
    }

    const loginCiudadania = async () => {
      await _auth.loginCiudadania()
    }

    return {
      login,
      loginCiudadania,
      isPwd,
      formulario,
      rulesLogin
    }
  }
}
</script>
