<!--
  Esse documento é responsável pela renderização da página de campeonatos assim como os dialogs modals que trabalham com:
  - Listagem de campeonatos em cards
  - Visualização de campeonatos e squads registrados em cada um deles
  - Registro de novos squads
  - Pontuação em pista dos membros
 -->

<template>
  <q-page padding v-if="auth">
    <!-- Listagem de campeonatos em banners -->
    <q-intersection transition="scale">
      <q-banner
        v-for="championShip in championShips"
        :key="championShip.id"
        class="bg-primary text-white"
        :style="{
          backgroundimage: `url(${championShip.banner})`,
        }"
      >
        <div style="">
          <div style="display: flex; justify-content: space-between">
            <small>
              {{ championShip.localidade }}
              {{ championShip.categoria }}
            </small>
            <small>
              {{ championShip.dataInicio.toDate().toLocaleDateString() }}
              {{ championShip.dataFim.toDate().toLocaleDateString() }}
            </small>
          </div>
          <h4 v-on:click="() => handleConcreteId(championShip.id)">
            {{ championShip.nome.toUpperCase() }}
          </h4>
        </div>

        <small style="margin-left: auto; display: table">
          Membros já registrados
          {{ championShip.atletasRegistrados }}
        </small>

        <q-btn
          v-on:click="
            openRegistrateSquad = true;
            championShipRegistrationSquad = championShip.id;
          "
          flat
          color="white"
          label="Registrar Squad"
        />
      </q-banner>
    </q-intersection>

    <!-- Modal de registro de squad -->
    <q-dialog
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
      full-width
      full-height
      v-model="openRegistrateSquad"
    >
      <!-- Modals header -->
      <q-card>
        <div
          class="text-h6"
          style="
            margin-bottom: -8em;
            z-index: 10;
            position: relative;
            color: beige;
          "
        >
          Registrar Squad:
          <small>
            {{ auth.apelido + ' (capitão)' }}
          </small>
        </div>

        <q-parallax :height="300" :src="registrationSquad.bg_banner">
          <q-input
            style="position: absolute; bottom: 2em; right: 2em"
            autofocus
            v-model="registrationSquad.nome"
            label="Nome do squad"
            dark
            label-color="white"
          />
        </q-parallax>

        <!-- Members table and addition -->
        <q-table
          class="squad-membros"
          flat
          bordered
          title="Membros do squad"
          :rows="registrationSquad.membros"
          :columns="[
            {
              name: 'Nome',
              required: true,
              label: 'Atleta',
              align: 'left',
              field: (row) => row.apelido,
              format: (val) => `${val}`,
              sortable: true,
            },

            {
              name: 'Delete',
              required: true,
              label: 'Remover',
              align: 'right',
              field: (row) => row,
            },
          ]"
          hide-bottom
          hide-pagination
          no-data-label="Nenhum membro adicionado"
          row-key="apelido"
        >
          <!-- Members table header and addition dropdown q-btn -->
          <template v-slot:top-right>
            <q-tr>
              <q-btn-dropdown
                color="primary"
                label="Adicionar Membros"
                icon="add"
              >
                <q-list>
                  <q-item
                    v-for="membro in membros.values()"
                    v-bind:key="membro.id"
                    clickable
                    v-close-popup
                    v-on:click="addSquadRegistrationMembroFac(membro.id)"
                  >
                    <q-item-section>
                      <q-item-label>{{ membro.apelido }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-tr>
          </template>

          <!-- Added members table body with remove q-btn-->
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="Nome" :props="props">{{ props.row.apelido }}</q-td>
              <q-td
                key="Delete"
                :props="props"
                style="position: relative; width: 4em"
              >
                <q-btn
                  v-on:click="removerRegistrationSquadMembro(props.row.id)"
                  flat
                  color="primary"
                  icon="remove"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>

        <q-btn flat label="Registrar Squad" v-on:click="registerSquad" />
      </q-card>
    </q-dialog>

    <!-- Modal de detalhes do campeonato -->
    <q-dialog
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
      full-width
      full-height
      v-model="openChampionModal"
    >
      <!-- Em formato de carrousel, com a primeira página, a de detahes do campeonato -->
      <q-carousel
        v-model="championSlide"
        transition-prev="scale"
        transition-next="scale"
        swipeable
        animated
        control-color="white"
        navigation
        padding
        class="bg-primary shadow-1 rounded-borders"
      >
        <!-- Primeira página, informações do campeonato -->
        <q-carousel-slide name="index" class="" style="min-height: 140vh">
          <div class="row justify-between">
            <q-parallax :height="300" :src="championShipModal.banner">
              <h3 class="text-white">{{ championShipModal.nome }}</h3>
            </q-parallax>
          </div>
          <q-separator />

          <!-- Descrição básica -->
          <q-card square bordered text-color="black">
            <q-card-section class="q-pt-2">
              <h6>Descrição</h6>
              <p>
                {{ championShipModal.descricao }}
              </p>
            </q-card-section>
            <q-card-section style="">
              <div style="display: flex; justify-content: space-between">
                <small>
                  {{ championShipModal.localidade }}
                  {{ championShipModal.categoria }}
                </small>
                <small>
                  {{
                    championShipModal.dataInicio.toDate().toLocaleDateString()
                  }}
                  à
                  {{ championShipModal.dataFim.toDate().toLocaleDateString() }}
                </small>
              </div>
            </q-card-section>
          </q-card>

          <q-separator />

          <!-- Squads registrados -->
          <q-card square bordered text-color="black">
            <q-card-section class="q-pt-2">
              <q-table
                class="squads"
                flat
                bordered
                title="Squads"
                :rows="championShipModal.squads"
                :columns="[
                  {
                    name: 'Nome',
                    required: true,
                    label: 'Squad',
                    align: 'left',
                    field: (row) => row.nome,
                    format: (val) => `${val}`,
                    sortable: true,
                  },
                  {
                    name: 'Membros',
                    required: true,
                    label: 'Membros',
                    align: 'left',
                    field: (row) => row.membros,
                    format: (val) => `${val.length} atletas`,
                  },
                  {
                    name: 'Etapa',
                    required: true,
                    label: 'Etapa',
                    align: 'left',
                    field: (row) =>
                      pistas.find((pista) => pista.id == row.etapa)?.nome,
                  },
                  {
                    name: 'Capitão',
                    required: false,
                    label: 'Capitão',
                    align: 'left',
                    field: (row) => row.capitao,
                    format: (val) => `${val || 'Sem capitão'}`,
                  },
                ]"
                hide-pagination
                no-data-label="Nenhum squad registrado"
                row-key="id"
              ></q-table>
            </q-card-section>
          </q-card>
        </q-carousel-slide>

        <!-- Slides dos squads registrados com lista de membros e botão de
          ação para abrir modal de pontuação de membros -->
        <q-carousel-slide
          v-for="squad in championShipModal.squads"
          v-bind:key="squad.id"
          :name="squad.id"
          style="overflow-y: scroll; height: fit-content"
          class="column no-wrap flex-center"
        >
          <!-- Detalhes gerais do squad -->
          <q-card
            class="row justify-between"
            style="width: 100%; min-height: 100%; display: flex"
          >
            <q-card-section style="width: 100%">
              <q-parallax :height="200" :src="squad.bg_banner">
                <h3 class="text-white">{{ squad.nome }}</h3>
                <!-- demais detalhes -->

                <!-- Elemento com ação para exibir membros para pontuação -->
              </q-parallax>
            </q-card-section>
            <q-card-section>
              <span>
                {{ squad.etapa || 'Nenhuma etapa definida' }}
              </span>
            </q-card-section>
            <q-card-section style="width: 100%">
              <q-separator />
              <q-table
                class="squad-membros"
                flat
                bordered
                title="Membros do squad"
                :rows="squad.membros"
                :columns="[
                  {
                    name: 'Nome',
                    required: true,
                    label: 'Atleta',
                    align: 'left',
                    field: (row) => row.apelido,
                    format: (val) => `${val}`,
                    sortable: true,
                  },

                  {
                    name: 'Pontuação',
                    required: true,
                    label: 'Pontuação',
                    align: 'right',
                    field: (row) =>
                      // calcular as pontuações do membro no campeonato
                      row,
                  },
                ]"
                hide-bottom
                hide-pagination
                no-data-label="Nenhum membro adicionado"
                row-key="apelido"
              ></q-table>
            </q-card-section>
            <q-card-section>
              <q-btn
                v-on:click="
                  squadMembrosOpen = true;
                  squadMembrosSlide = 'none';
                "
              >
                Pontuação
              </q-btn>
            </q-card-section>
          </q-card>

          <!-- Modal dos membros do squad -->
          <q-dialog v-model="squadMembrosOpen" maximized>
            <q-card style="width: 100%; height: 100%; display: flex">
              <q-card-section style="width: 100%; height: 100%">
                <h4>Membros</h4>
                <q-separator />
                <q-tabs v-model="membrosTab" dense class="text-teal">
                  <q-tab
                    v-for="member in squad.membros"
                    v-bind:key="member.id"
                    :name="member.id"
                  >
                    <q-avatar>
                      <img :src="member.foto" />
                    </q-avatar>
                    <q-tab-label>{{ member.apelido }}</q-tab-label>
                  </q-tab>
                </q-tabs>
                <q-separator />

                <q-tab-panels v-model="membrosTab" animated>
                  <q-tab-panel
                    v-for="atleta in squad.membros"
                    v-bind:key="atleta.id"
                    :name="atleta.id"
                  >
                    <q-card style="width: 100%; height: 100%; padding-top: 1em">
                      <!-- No slide do membro, form para pontuação -->
                      <div
                        id="scoring"
                        style="
                          display: grid;
                          grid-template-rows: 50px 50px 50px;
                          grid-template-columns: repeat(3, 30%);
                          grid-gap: 20px;
                          grid-template-areas: 'a a c' 'd e f';
                          margin: 3em;
                        "
                      >
                        <q-input
                          v-model="pontuacao.tempo"
                          type="number"
                          style="grid-area: a"
                          placeholder="Tempo"
                        >
                          <template v-slot:prepend>
                            <q-icon name="timer" />
                          </template>
                        </q-input>

                        <q-input
                          v-model="pontuacao.factor"
                          type="number"
                          disable
                          placeholder="Hit factor"
                        />
                        <q-btn
                          v-touch-hold.400="
                            ({ evt, ...newInfo }) => (pontuacao.pontos -= 10)
                          "
                          v-on:click="pontuacao.pontos += 10"
                          >A</q-btn
                        >
                        <q-btn
                          v-touch-hold.400="
                            ({ evt, ...newInfo }) => (pontuacao.pontos -= 5)
                          "
                          v-on:click="pontuacao.pontos += 5"
                          >C</q-btn
                        >
                        <q-btn
                          v-touch-hold.400="
                            ({ evt, ...newInfo }) => (pontuacao.pontos -= 1)
                          "
                          v-on:click="pontuacao.pontos += 1"
                          >D</q-btn
                        >
                        <q-btn
                          v-touch-hold.400="
                            ({ evt, ...newInfo }) => (pontuacao.pontos -= 0)
                          "
                          v-on:click="pontuacao.pontos += 0"
                          >Miss</q-btn
                        >
                        <q-btn
                          v-touch-hold.400="
                            ({ evt, ...newInfo }) => (pontuacao.pontos += 10)
                          "
                          v-on:click="pontuacao.pontos -= 10"
                          >No shoot</q-btn
                        >
                        <q-btn>Proc</q-btn>
                      </div>
                      <q-btn>
                        <q-icon
                          v-on="{ click: registerPontuacao }"
                          name="thumb_up"
                        />
                      </q-btn>
                    </q-card>
                  </q-tab-panel>
                </q-tab-panels>
              </q-card-section>
            </q-card>
          </q-dialog>
        </q-carousel-slide>
      </q-carousel>
    </q-dialog>

    <q-separator />
  </q-page>
</template>

<script lang="ts" setup>
import {
  arrayUnion,
  collection,
  doc,
  increment,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { Notify } from 'quasar';
import {
  Campeonato,
  CCampeonato,
  CSquad,
  Membro,
  Pista,
  // RegistroDePontuacao,
  Squad,
} from 'src/components/models';
import { db, useAppStore } from 'src/stores/app';
import { computed, Ref, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const appStore = useAppStore();

var auth = computed(() => appStore.auth.state);
var championShips = computed(() => appStore.campeonatos.state as Campeonato[]);
var membros = computed(() => appStore.membros.state as Membro[]);
var squads = computed(() => appStore.squads.state as CSquad[]);
var pistas = computed(() => appStore.pistas.state as Pista[]);
var pontuacoes = computed(() => appStore.pontuacoes.state as Pista[]);

const route = useRoute();

const handleConcreteId = (id: string) => {
  if (!id) return;
  let aux = championShips.value.filter(
    (championShip) => championShip.id == id
  )[0];
  let auxSquads = aux.squads.map(
    (squadId) => squads.value.find((s) => s.id == squadId) as CSquad
  );

  console.log(id, aux.squads, squads.value);
  championShipModal.value = {
    ...aux,
    squads: auxSquads,
  };
  openChampionModal.value = true;
};
const id = computed(() => route.params.id);

watch(squads, (d) => console.log(d));

watch(championShips, () =>
  id.value ? handleConcreteId(id.value as string) : null
);
watch(
  () => route.params.id,
  (id) => handleConcreteId(id as string)
);

// modal states
const openChampionModal = ref(false);
const championShipModal: Ref<CCampeonato> = ref({} as CCampeonato);
const openRegistrateSquad = ref(false);
const championShipRegistrationSquad = ref('');

// form models
const registrationSquad = ref({
  id: '',
  nome: '',
  membros: [] as Membro[],
  bg_banner: 'https://cdn.quasar.dev/img/mountains.jpg',
} as CSquad);
// form actions
const removerRegistrationSquadMembro = (id: string) => {
  registrationSquad.value.membros = registrationSquad.value.membros.filter(
    (membro) => membro.id != id
  );
};
const addSquadRegistrationMembroFac = (id: string) => {
  console.log(registrationSquad.value.membros, membros.value);
  registrationSquad.value.membros = [
    ...registrationSquad.value.membros,
    membros.value.find((m) => m.id == id) as Membro,
  ];
};
const registerSquad = async () => {
  const collectionRef = collection(db, 'squads');

  // Generate "locally" a new document for the given collection reference
  const docRef = doc(collectionRef);

  // Get the new document Id
  const documentUuid = docRef.id;

  let registrationMembros = registrationSquad.value.membros;
  console.log(registrationMembros);
  //  Sets the new document with its uuid as property
  await setDoc(docRef, {
    ...registrationSquad.value,
    id: documentUuid,
    membros: registrationMembros.map((m) => m.id),
  });

  await updateDoc(
    doc(collection(db, 'campeonatos'), championShipRegistrationSquad.value),
    {
      squads: arrayUnion(documentUuid),
      atletasRegistrados: increment(
        registrationMembros.map((m) => m.id).length
      ),
    }
  );

  let storeChampionships = await appStore.campeonatos;
  let championShipStoreIndex = storeChampionships.state.value.findIndex(
    (championShip) => championShip.id == championShipRegistrationSquad.value
  );

  storeChampionships.state.value[championShipStoreIndex] = {
    ...storeChampionships.state.value[championShipStoreIndex],
    atletasRegistrados:
      storeChampionships.state.value[championShipStoreIndex]
        .atletasRegistrados +
      registrationSquad.value.membros.map((m) => m.id).length,
    squads: [
      ...(storeChampionships.state.value[championShipStoreIndex]
        .squads as Squad[]),
      registrationSquad.value.id,
    ],
  };

  Notify.create('Squad registrada com sucesso');

  openRegistrateSquad.value = false;
  registrationSquad.value = {
    id: '',
    nome: '',
    membros: [],
    bg_banner: 'https://cdn.quasar.dev/img/mountains.jpg',
  };
};

// carousel indexes
const championSlide = ref('index');
const squadMembrosOpen = ref(false);
const squadMembrosSlide = ref('none');

// Membros scoring tabs
const membrosTab = ref('mails');
const pontuacao = ref({
  tempo: 0,
  factor: 0,
  pontos: 0,
});
const registerPontuacao = () => {
  // produzir objeto de pontuação
  // fazer upload no banco de dados
  console.log(pontuacao.value);
};
</script>
CCampeonato, CSquad, CCampeonato, CSquad,
