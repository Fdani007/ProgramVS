const app = {
    db: null,

    init: function() {
        const request = indexedDB.open("FraganciaDB", 1);
        
        request.onupgradeneeded = (e) => {
            this.db = e.target.result;
            this.db.createObjectStore("inventario", { keyPath: "codigo" });
        };

        request.onsuccess = (e) => {
            this.db = e.target.result;
            this.listar();
        };
    },

    guardar: function() {
        const codigo = document.getElementById('txtCodigo').value;
        const nombre = document.getElementById('txtNombre').value;
        const stock = parseInt(document.getElementById('txtStock').value);

        if(!codigo || !nombre) return alert("Llena los campos");

        const tx = this.db.transaction("inventario", "readwrite");
        const store = tx.objectStore("inventario");
        
        store.put({ codigo, nombre, stock });

        tx.oncomplete = () => {
            this.listar();
            document.getElementById('txtCodigo').value = "";
            document.getElementById('txtNombre').value = "";
        };
    },

    listar: function() {
        const listado = document.getElementById('listaProductos');
        listado.innerHTML = "";
        
        const tx = this.db.transaction("inventario", "readonly");
        const store = tx.objectStore("inventario");
        
        store.openCursor().onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
                const p = cursor.value;
                listado.innerHTML += `
                    <div class="card card-producto p-3">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <strong>${p.nombre}</strong><br>
                                <small class="text-muted">${p.codigo}</small>
                            </div>
                            <div class="text-center">
                                <span class="badge bg-info text-dark">Stock: ${p.stock}</span>
                            </div>
                        </div>
                    </div>`;
                cursor.continue();
            }
        };
    }
};

app.init();