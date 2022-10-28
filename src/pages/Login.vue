<template>
  <q-page class="flex flex-center login">
    <div class="row q-col-gutter-md justify-center">
      <div class="col-xs-12 flex flex-center">
        <q-card style="width: 400px; max-width: 95vw;">
          <q-toolbar class="q-pa-md">
            <div class="col-xs-12 text-center">
              <img src="~assets/logo.png" width="200"/>
            </div>
          </q-toolbar>
          <q-card-section class="q-pt-none">
            <q-form @submit="login">
              <q-input
                filled
                v-show="SHOW_LOGIN"
                v-model="formulario.usuario"
                label="Usuario o correo electrónico"
                lazy-rules
                square
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
                v-show="SHOW_LOGIN"
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
                v-show="SHOW_LOGIN"
                type="submit"
                size="16px"
                no-caps
                class="full-width"
                label="Ingresar"
              />
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

    const SHOW_LOGIN = process.env.SHOW_LOGIN

    const login = async () => {
      await _auth.login({ usuario: formulario.usuario, contrasena: formulario.contrasena })
    }

    const loginCiudadania = async () => {
      await _auth.loginCiudadania()
    }

    return {
      login,
      SHOW_LOGIN,
      loginCiudadania,
      isPwd,
      formulario,
      rulesLogin
    }
  }
}
</script>
<style>
.login {
  background: url("~assets/login.png") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}
</style>
