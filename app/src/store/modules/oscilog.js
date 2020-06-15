export default {
    state: {
        OSC_CHANNELS: [],
        IDS: [],
        OSC_DIALOG: false,
        STAT_ID: 0,
        STAT_DIALOG: false
    },
    getters: {
        OSC_CHANNELS: state => { return state.OSC_CHANNELS },
        IDS: state => { return state.IDS },
        OSC_DIALOG: state => { return state.OSC_DIALOG },
        STAT_ID: state => { return state.STAT_ID },
        STAT_DIALOG: state => { return state.STAT_DIALOG }
    },
    mutations: {
        REFRESH_OSC: (state) => {
            state.OSC_CHANNELS = [];
            state.IDS = [];
        },
        REFRESH_OSC_CHANNELS: (state, payload) => {
            state.OSC_CHANNELS.push(payload);
        },
        REFRESH_IDS: (state, payload) => {
            state.IDS.push(payload);
        },
        REFRESH_OSC_DIALOG: (state, payload) => {
            state.OSC_DIALOG = payload
        },
        REMOVE_ITEM: (state, payload) => {
            state.OSC_CHANNELS.splice(payload, 1);
            state.IDS.splice(payload, 1);
        },
        REFRESH_STAT_ID: (state, payload) => {
            state.STAT_ID = payload;
        },
        REFRESH_STAT_DIALOG: (state, payload) => {
            state.STAT_DIALOG = payload
        }
    },
    actions: {
        UPDATE_OSC_CHANNELS(context, data) {
            return new Promise(resolve => {
                context.commit('REFRESH_OSC_CHANNELS', data);
                resolve(data);
            });
        },
        UPDATE_IDS(context, data) {
            return new Promise(resolve => {
                context.commit('REFRESH_IDS', data);
                resolve(data);
            });
        },
        UPDATE_OSC_DIALOG(context, data) {
            return new Promise(resolve => {
                context.commit('REFRESH_OSC_DIALOG', data);
                resolve(data);
            });
        },
        CLEAR_OSC(context) {
            return new Promise(resolve => {
                context.commit('REFRESH_OSC');
                resolve([]);
            });
        },
        DELETE_ITEM_FROM_OSC(context, data) {
            return new Promise(resolve => {
                context.commit('REMOVE_ITEM', data);
                resolve(data);
            });
        },
        UPDATE_STAT_ID(context, data) {
            return new Promise(resolve => {
                context.commit('REFRESH_STAT_ID', data);
                resolve(data);
            });
        },
        UPDATE_STAT_DIALOG(context, data) {
            return new Promise(resolve => {
                context.commit('REFRESH_STAT_DIALOG', data);
                resolve(data);
            });
        }
    }
}
