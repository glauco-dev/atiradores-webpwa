<template>
  <!-- Esse é o documento de layout básico, onde constroi a estrutura ao
  redor do conteúdo -->

  <q-layout view="lHh Lpr lFf">
    <!-- lHh Lpr lFf deve ser as orientações de conteúdo -->
    <q-header bordered>
      <q-toolbar>
        <!-- <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        /> -->

        <q-toolbar-title style="align-items: center; display: flex; gap: 20px">
          <img
            src="./noun-shooting-range-1587083.svg"
            alt=""
            style="height: 40px; aspect-ratio: 1; margin: 5px"
          />
          <span> Atiradores Brasil </span>
        </q-toolbar-title>

        <!-- <div>v{{ $q.version }}</div> -->
      </q-toolbar>
    </q-header>

    <!-- <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Guias de navegação </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer> -->

    <q-page-container>
      <q-dialog v-model="loginPromptOpen" persistent>
        <q-card style="width: 100%">
          <q-card-section>
            <div class="text-h6">Você precisa estar logado</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input dense label="Email" v-model="loginModel.email" autofocus />
            <q-input
              dense
              type="password"
              label="Senha"
              v-model="loginModel.password"
            />
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Logar" v-on:click="loginAction" />
            <q-btn
              flat
              label="Não possui cadastro ainda?"
              v-on:click="
                loginPromptOpen = false;
                registroPromptOpen = true;
              "
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="registroPromptOpen" persistent>
        <q-card style="width: 100%">
          <q-card-section>
            <div class="text-h6">Registrar</div>
          </q-card-section>

          <q-form va>
            <q-card-section class="q-pt-none">
              <q-file
                rounded
                filled
                label="Foto"
                v-model="registroModel.foto_file"
              ></q-file>
              <q-input
                dense
                label="Nome"
                v-model="registroModel.apelido"
                autofocus
              />
              <q-input dense label="Email" v-model="registroModel.email" />
              <div
                class="flex gap-2"
                style="
                  margin-top: 1em;
                  margin-bottom: 1em;
                  justify-content: space-between;
                  padding-right: 1em;
                "
              >
                <span>{{ registroModel.nascimento || 'Nascimento' }}</span>
                <q-btn icon="event" rounded color="primary">
                  <q-popup-proxy
                    @before-show="registroModel.nascimento"
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="registroModel.nascimento">
                      <div class="row items-center justify-end q-gutter-sm">
                        <q-btn
                          label="Cancel"
                          color="primary"
                          flat
                          v-close-popup
                        />
                        <q-btn label="OK" color="primary" flat v-close-popup />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-btn>
              </div>
              <q-input
                dense
                type="password"
                label="Senha"
                :error="registroModel.password.length < 6"
                error-message="A senha deve ter pelo menos 6 caracteres"
                v-model="registroModel.password"
              />

              <q-input
                dense
                type="password"
                label="Confirmar senha"
                :error="
                  registroModel.password !== registroModel.confirmPassword
                "
                error-message="As senhas precisam ser iguais"
                v-model="registroModel.confirmPassword"
              />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Registrar" v-on:click="registroAction" />
              <q-btn
                flat
                label="Já tem um login?"
                v-on:click="
                  loginPromptOpen = true;
                  registroPromptOpen = false;
                "
              />
            </q-card-actions>
          </q-form>
        </q-card>
      </q-dialog>
      <router-view />
      <!-- Quasar possui seu próprio framework de componentes web bem preparados -->
    </q-page-container>

    <q-footer bordered class="bg-primary text-white">
      <q-toolbar>
        <q-tabs align="center" class="flex w-full justify-space-between">
          <q-route-tab
            to="/campeonatos"
            icon="military_tech"
            label="Campeonatos"
          />
          <q-route-tab to="/" label="Início" icon="home" />
          <q-route-tab
            to="/configuracoes"
            icon="settings"
            label="Configurações"
          />
        </q-tabs>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>
<style lang="sass">
.q-toolbar
  display: flex
  justify-content: space-between
  .q-tabs
    width: 100%
</style>

<script setup lang="ts">
import {
  signInWithEmailAndPassword,
  getAuth,
  UserCredential,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { Notify } from 'quasar';
import { RegistrationModel, Membro } from 'src/components/models';
import { fbApp, db, useAppStore } from 'src/stores/app';
import { ref } from 'vue';
import { getStorage, ref as sRef, uploadBytes } from 'firebase/storage';

defineOptions({
  name: 'MainLayout',
  // Aqui defino o nome do layout para ser usado em referência
});

const appStore = useAppStore();
const loginPromptOpen = ref(false);
const registroPromptOpen = ref(false);
const registroModel = ref({
  email: '',
  password: '',
  nascimento: '',
  apelido: '',
  foto: '',
  foto_file: undefined,
  confirmPassword: '',
  error: '',
} as RegistrationModel);

const loginModel = ref({
  email: '',
  password: '',
});

!appStore.auth.state
  ? (loginPromptOpen.value = true)
  : (loginPromptOpen.value = false);

const loginAction = () => {
  let { email, password } = loginModel.value;
  signInWithEmailAndPassword(getAuth(fbApp), email, password)
    .then(async (logincred: UserCredential) => {
      appStore.auth.state =
        (await getDoc(doc(db, 'membros', logincred.user.uid))).data() || null;
      console.log(logincred.user.uid, appStore.auth.state);
      Notify.create('Login efetuado com sucesso');
      loginPromptOpen.value = false;
    })
    .catch((error) => {
      switch (error.code) {
        case 'auth/user-not-found':
          Notify.create('Email invalido');
          break;
        case 'auth/wrong-password':
          Notify.create('Senha invalida');
          break;
        default:
          Notify.create(error.code);
      }
    });
};
const registroAction = () => {
  // TODO: Implementar registro
  let { email, password, apelido, nascimento, foto_file } = registroModel.value;
  createUserWithEmailAndPassword(getAuth(fbApp), email, password)
    .then((cred: UserCredential) => {
      foto_file &&
        uploadBytes(
          sRef(getStorage(fbApp), 'fotos/' + cred.user.uid),
          foto_file
        ).then((s) => {
          setDoc(doc(db, 'membros', cred.user.uid), {
            email,
            password,
            apelido,
            nascimento,
            foto: s.metadata.fullPath,
          } as Membro);
          Notify.create(
            'Cadastro realizado com sucesso.\nVerifique seu email para confirmação'
          );
        });
      // TODO: criar firedocument com os dados
    })
    .catch((error) => {
      switch (error.code) {
        case 'auth/email-already-in-use':
          Notify.create('Email em uso');
          break;
        case 'auth/invalid-email':
          Notify.create('Email invalido');
          break;
        case 'auth/weak-password':
          Notify.create('Senha fraca');
          break;
        default:
          Notify.create(error.message);
          break;
      }
    });
};
</script>
