import { defineStore, acceptHMRUpdate } from 'pinia';

export const useUserSettingStore = defineStore('user-setting', {
  state: () => ({
    client: {
      id: '',
      secret: '',
      stores: [] as { name: string; description: string }[],
    },
    user: {
      name: '',
      email: '',
    },
    options: {
      searchKeyList: [] as string[],
    },
  }),
  getters: {
    id: (state) => state.client.id,
    secret: (state) => state.client.secret,
    stores: (state) => state.client.stores,
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

    addStore(name: string, description: string) {
      console.log(name, description);
      this.client.stores.push({
        name: name,
        description: description,
      });
      this.save();
    },

    updateStoreOrder(from: number, to: number) {
      const stores = this.client.stores;

      const element = stores.splice(from, 1)[0];
      if (element) stores.splice(to, 0, element);
      this.save();
    },

    deleteStore(name: string) {
      this.client.stores = this.client.stores.filter((store) => store.name !== name);
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
      console.log('load this.client=', this.client);

      const user = localStorage.getItem('user');
      if (user) this.user = JSON.parse(user);

      const options = localStorage.getItem('options');
      if (options) this.options = JSON.parse(options);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserSettingStore, import.meta.hot));
}
