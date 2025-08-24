import { defineStore, acceptHMRUpdate } from 'pinia';

export const useUserAccountStore = defineStore('user-account', {
  state: () => ({
    client: {
      id: '',
      secret: '',
      //malls: [] as string[],
      malls: [] as { name: string; description: string }[],
    },
    // clientId: '',
    // clientSecret: '',
    // clientMalls: [] as string[], // i.e. ['mall1', 'mall2']
  }),
  getters: {
    id: (state) => state.client.id,
    secret: (state) => state.client.secret,
    malls: (state) => state.client.malls,
  },
  actions: {
    setClientId(id: string) {
      this.client.id = id;
      this.save();
    },
    setClientSecret(secret: string) {
      this.client.secret = secret;
      this.save();
    },

    addUMallName(name: string, description: string) {
      this.client.malls.push({
        name: name,
        description: description,
      });
      this.save();
    },

    //updateMallNameOrders(malls: { name: string; description: string }[])
    updateMallNameOrders(from: number, to: number) {
      const malls = this.client.malls;

      const element = malls.splice(from, 1)[0];
      if (element) malls.splice(to, 0, element);
      this.save();
    },

    deleteMallName(name: string) {
      this.client.malls = this.client.malls.filter((mall) => mall.name !== name);
      this.save();
    },
    save() {
      try {
        localStorage.setItem('client', JSON.stringify(this.client));
      } catch (error) {
        console.error(error);
      }
    },

    load() {
      const client = localStorage.getItem('client');
      console.log('load client', client);
      if (client) {
        this.client = JSON.parse(client);
      } else {
        this.client = {
          id: '',
          secret: '',
          malls: [],
        };
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserAccountStore, import.meta.hot));
}
