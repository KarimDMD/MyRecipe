import { ref } from "vue";

const eventBus = ref(null);

export function createEventBus() {
    if (!eventBus.value) {
        eventBus.value = {
            emit(event, ...args) {
                this[event]?.forEach((callback) => callback(...args));
            },
            on(event, callback) {
                if (!this[event]) {
                    this[event] = [];
                }
                this[event].push(callback);
            },
            off(event, callback) {
                if (this[event]) {
                    const index = this[event].indexOf(callback);
                    if (index !== -1) {
                        this[event].splice(index, 1);
                    }
                }
            },
        };
    }
    return eventBus.value;
}
