import { defineStore, acceptHMRUpdate } from 'pinia';

export const useUserAccountStore = defineStore('user-account', {
  state: () => ({
    client: {
      id: '',
      secret: '',
      //malls: [] as string[],
      malls: [] as { name: string; description: string }[],
    },
    user: {
      name: '',
      email: '',
    },
    options: {
      searchKeyList: [] as string[],
    },
    // clientId: '',    // clientSecret: '',    // clientMalls: [] as string[], // i.e. ['mall1', 'mall2']
  }),
  getters: {
    id: (state) => state.client.id,
    secret: (state) => state.client.secret,
    malls: (state) => state.client.malls,
    searchKeyList: (state) => state.options.searchKeyList,

    name: (state) => state.user.name,
    email: (state) => state.user.email,
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

    setUserName(name: string) {
      this.user.name = name;
      this.save();
    },
    setUserEmail(email: string) {
      this.user.email = email;
      this.save();
    },

    addMallName(name: string, description: string) {
      console.log('addMallName', name, description);
      this.client.malls.push({
        name: name,
        description: description,
      });
      this.save();
    },

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
    setSearchKeyList(searchKeyList: string[]) {
      this.options.searchKeyList = searchKeyList;
      this.save();
    },
    save() {
      try {
        localStorage.setItem('client', JSON.stringify(this.client));
        localStorage.setItem('options', JSON.stringify(this.options));
        localStorage.setItem('user', JSON.stringify(this.user));
      } catch (error) {
        console.error(error);
      }
    },

    load() {
      const client = localStorage.getItem('client');
      if (client) this.client = JSON.parse(client);

      const user = localStorage.getItem('user');
      if (user) this.user = JSON.parse(user);

      const options = localStorage.getItem('options');
      if (options) this.options = JSON.parse(options);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserAccountStore, import.meta.hot));
}
