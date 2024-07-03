import { defineStore } from 'pinia';
import { useAsyncState } from '@vueuse/core';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getDocs,
  getFirestore,
  collection,
  doc,
  getDoc,
} from 'firebase/firestore';
import { CSquad, Membro } from 'src/components/models';

const firebaseConfig = {
  apiKey: 'AIzaSyCd2r5Oc_vYmy5M1mqwdfnFC3xV1KZKtZY',
  authDomain: 'atiradores-brasil-zevm8u.firebaseapp.com',
  databaseURL: 'https://atiradores-brasil-zevm8u-default-rtdb.firebaseio.com',
  projectId: 'atiradores-brasil-zevm8u',
  storageBucket: 'atiradores-brasil-zevm8u.appspot.com',
  messagingSenderId: '1074026160535',
  appId: '1:1074026160535:web:5beafb1b2f2f512b67e4d2',
  measurementId: 'G-MLLD24KLGT',
};

export const fbApp = initializeApp(firebaseConfig);
export const db = getFirestore(fbApp);
export const useAppStore = defineStore('App', {
  state: () => ({
    auth: useAsyncState(async () => {
      const auth = getAuth(fbApp);
      return auth.currentUser
        ? (await getDoc(doc(db, 'membros', auth.currentUser.uid))).data()
        : null;
    }, null),
    membros: useAsyncState(
      async () =>
        (await getDocs(collection(db, 'membros'))).docs.map((membro) =>
          membro.data()
        ),
      []
    ),
    squads: useAsyncState(async () => {
      const squads = (await getDocs(collection(db, 'squads'))).docs.map(
        (squad) => squad.data()
      );
      // handle members ids to members
      const tempStore = useAppStore();
      const membros = tempStore.membros.state;
      console.log(squads);

      return squads.map((s) => {
        return {
          ...s,
          membros: s.membros.map((m: string) => {
            return membros.find((mem) => mem.id == m) as Membro;
          }),
        };
      }) as CSquad[];
    }, []),
    campeonatos: useAsyncState(
      async () =>
        (await getDocs(collection(db, 'campeonatos'))).docs.map((campeonato) =>
          campeonato.data()
        ),
      []
    ),
    pistas: useAsyncState(
      async () =>
        (await getDocs(collection(db, 'pistas'))).docs.map((pista) =>
          pista.data()
        ),
      []
    ),
    pontuacoes: useAsyncState(
      async () =>
        (await getDocs(collection(db, 'pontuações'))).docs.map((pts) =>
          pts.data()
        ),
      []
    ),
  }),
});
