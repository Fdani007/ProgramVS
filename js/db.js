const dbEngine = {
    db: null,
    async init() {
        return new Promise((resolve) => {
            const request = indexedDB.open("InventarioProDB", 2); // Versión 2
            request.onupgradeneeded = e => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains("productos")) 
                    db.createObjectStore("productos", { keyPath: "codigo" });
                if (!db.objectStoreNames.contains("marcas")) 
                    db.createObjectStore("marcas", { keyPath: "id", autoIncrement: true });
                if (!db.objectStoreNames.contains("categorias")) 
                    db.createObjectStore("categorias", { keyPath: "id", autoIncrement: true });
            };
            request.onsuccess = e => { this.db = e.target.result; resolve(); };
        });
    },

    // Funciones genéricas para CRUD
    async agregar(storeName, objeto) {
        const tx = this.db.transaction(storeName, "readwrite");
        return new Promise(r => {
            tx.objectStore(storeName).put(objeto).onsuccess = () => r();
        });
    },

    async obtenerTodo(storeName) {
        const tx = this.db.transaction(storeName, "readonly");
        return new Promise(r => {
            tx.objectStore(storeName).getAll().onsuccess = e => r(e.target.result);
        });
    },

    async buscarPorCodigo(codigo) {
        const tx = this.db.transaction("productos", "readonly");
        return new Promise(r => {
            tx.objectStore("productos").get(codigo).onsuccess = e => r(e.target.result);
        });
    }
};