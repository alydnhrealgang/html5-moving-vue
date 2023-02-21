import { createStore, createLogger } from "vuex";
import getters from "./getters";
import mutations from "./mutations";
import state from "./state";
import actions from "./actions";
import localServer from "./localServer";
import removeServer from './remoteServer';
import remoteServer from "./remoteServer";

const useLocalStore = import.meta.env.VITE_SERVER === 'local'
if (useLocalStore) {
    localServer.createProxy().install(actions)
} else {
    remoteServer.install(actions)
}

const debug = process.env.NODE_ENV !== 'production'
export default createStore({
    getters,
    mutations,
    state,
    actions,
    strict: debug,
    plugins: debug ? [createLogger()] : []
})