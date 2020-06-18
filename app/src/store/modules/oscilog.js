export default {
    state: {
        IDS: [],
        OSC_DIALOG: false,

        STAT_ID: 0,
        STAT_DIALOG: false,

        ANALYZE_IDS: [],
        ANALYZE_DIALOG: false
    },
    getters: {
        IDS: state => { return state.IDS },
        OSC_DIALOG: state => { return state.OSC_DIALOG },

        STAT_ID: state => { return state.STAT_ID },
        STAT_DIALOG: state => { return state.STAT_DIALOG },

        ANALYZE_IDS: state => { return state.ANALYZE_IDS },
        ANALYZE_DIALOG: state => { return state.ANALYZE_DIALOG }
    },
    mutations: {
        REFRESH_OSC: (state) => {
            state.IDS = [];
            state.OSC_DIALOG = false;
        },
        REFRESH_IDS: (state, payload) => {
            state.IDS.push(payload);
        },
        REFRESH_OSC_DIALOG: (state, payload) => {
            state.OSC_DIALOG = payload
        },
        REMOVE_ITEM: (state, payload) => {
            state.IDS.splice(state.IDS.findIndex(x => x === payload), 1);
            if (state.IDS.length === 0) {
                state.OSC_DIALOG = false;
            }
        },

        REFRESH_STAT_ID: (state, payload) => {
            state.STAT_ID = payload;
        },
        REFRESH_STAT_DIALOG: (state, payload) => {
            state.STAT_DIALOG = payload
        },

        REFRESH_ANALYZE: (state) => {
            state.ANALYZE_IDS = [];
            state.ANALYZE_DIALOG = false;
        },
        REFRESH_ANALYZE_IDS: (state, payload) => {
            state.ANALYZE_IDS.push(payload);
        },
        REFRESH_ANALYZE_DIALOG: (state, payload) => {
            state.ANALYZE_DIALOG = payload;
        },
        REMOVE_ANALYZE_ID: (state, payload) => {
            state.ANALYZE_IDS.splice(state.ANALYZE_IDS.findIndex(x => x === payload), 1);
            if (state.ANALYZE_IDS.length === 0) {
                state.ANALYZE_DIALOG = false;
            }
        }
    },
    actions: {
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
