const DB_NAME = "FraganciaDB";
const STORE_NAME = "inventario";

const dbEngine = {
    db: null,

    // Abre la conexión y crea la tabla si no existe
    init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, 1);
            request.onupgradeneeded = e => {
                e.target.result.createObjectStore(STORE_NAME, { keyPath: "codigo" });
            };
            request.onsuccess = e => {
                this.db = e.target.result;
                resolve();
            };
            request.onerror = e => reject(e);
        });
    },

    async getAll() {
        return new Promise(resolve => {
            const tx = this.db.transaction(STORE_NAME, "readonly");
            const store = tx.objectStore(STORE_NAME);
            store.getAll().onsuccess = e => resolve(e.target.result);
        });
    },

    async save(producto) {
        return new Promise(resolve => {
            const tx = this.db.transaction(STORE_NAME, "readwrite");
            tx.objectStore(STORE_NAME).put(producto);
            tx.oncomplete = () => resolve();
        });
    },

    async delete(codigo) {
        return new Promise(resolve => {
            const tx = this.db.transaction(STORE_NAME, "readwrite");
            tx.objectStore(STORE_NAME).delete(codigo);
            tx.oncomplete = () => resolve();
        });
    }
};
