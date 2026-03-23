const ui = {
    async render() {
        const productos = await dbEngine.getAll();
        const lista = document.getElementById("listaProductos");
        lista.innerHTML = productos.map(p => `
            <div class="card mb-2 p-3 shadow-sm">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${p.nombre}</strong><br>
                        <small class="text-muted">${p.codigo}</small>
                    </div>
                    <div class="text-end">
                        <span class="badge bg-primary d-block mb-1">${p.stock} unid.</span>
                        <button class="btn btn-sm btn-outline-danger" onclick="ui.borrar('${p.codigo}')">Eliminar</button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    async registrar() {
        const producto = {
            codigo: document.getElementById("txtCodigo").value,
            nombre: document.getElementById("txtNombre").value,
            stock: parseInt(document.getElementById("txtStock").value) || 0
        };

        if(!producto.codigo || !producto.nombre) return alert("Datos incompletos");

        await dbEngine.save(producto);
        this.render();
        // Limpiar campos
        document.getElementById("txtCodigo").value = "";
        document.getElementById("txtNombre").value = "";
    },

    async borrar(codigo) {
        if(confirm("¿Seguro que quieres borrar este producto?")) {
            await dbEngine.delete(codigo);
            this.render();
        }
    }
};

// Iniciar app
dbEngine.init().then(() => ui.render());
