<template>
  <q-page v-if="authState" class="row items-center justify-evenly">
    <!-- Atleata Profile -->
    <!-- Banner ao fundo -->
    <!-- ^ -->
    <q-parallax src="https://cdn.quasar.dev/img/parallax2.jpg">
      <q-avatar size="24px" color="orange">
        <img src="{atletaImagem}" alt="" srcset="" />
        <!-- <h1 class="text-white">{{ atleta.nome }}</h1> -->
        <!-- <small>{{ atleta.PontosTotais }}</small> -->
      </q-avatar>
    </q-parallax>

    <!-- Squads -->
    <div v-bind:key="squad.id" v-for="squad in squads.state">
      <!-- Como capitão primeiro -->
      <!-- Squads em tabela com background personalizado e etapa | campeonato atuais-->
      <div
        class="q-pa-md"
        :on-click="
          () => {
            // TODO: Levar para tela de pontuação com o squad como argumento
            console.log(squad);
          }
        "
      >
        <!-- <q-table
          :title="squad.nome"
          :rows="squad.membros"
          :columns="[
            {
              name: 'Nome',
              required: true,
              label: 'Dessert (100g serving)',
              align: 'left',
              field: (membro) => membro.nome,
              format: (val) => `${[val[0].toUpperCase(), ...val.substring(1)]}`,
              sortable: true,
            },
          ]"
          row-key="name"
        /> -->
        <!-- lista de atletas com pontuações ao lado -->
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '../stores/app';
defineOptions({
  name: 'IndexPage',
});

const appStore = useAppStore();
const authState = computed(() => appStore.auth.state);
const squads = computed(() => appStore.squads);
</script>
