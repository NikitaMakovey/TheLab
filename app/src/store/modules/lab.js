export default {
    state: {
        CHANNELS: [],
        NAMES: [],
    },
    getters: {
        CHANNELS: state => { return state.CHANNELS },
        NAMES: state => { return state.NAMES },
    },
    mutations: {
        REFRESH_CHANNELS: (state, payload) => {
            state.CHANNELS = payload;
        },
        REFRESH_CHANNEL_NAMES: (state, payload) => {
            state.NAMES = payload;
        }
    },
    actions: {
        UPDATE_CHANNELS(context, data) {
            return new Promise(resolve => {
                context.commit('REFRESH_CHANNELS', data);
                resolve(data);
            });
        },
        UPDATE_CHANNEL_NAMES(context, data) {
            return new Promise(resolve => {
                context.commit('REFRESH_CHANNEL_NAMES', data);
                resolve(data);
            });
        }
    }
}
