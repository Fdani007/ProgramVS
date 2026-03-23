const ui = {
    async renderCatalogos() {
        const marcas = await dbEngine.obtenerTodo("marcas");
        const categorias = await dbEngine.obtenerTodo("categorias");
        
        document.getElementById("selMarca").innerHTML = marcas.map(m => `<option>${m.nombre}</option>`).join('') + '<option value="nueva">+ Nueva Marca</option>';
        document.getElementById("selCategoria").innerHTML = categorias.map(c => `<option>${c.nombre}</option>`).join('') + '<option value="nueva">+ Nuevo Tipo</option>';
    },

    async verificarExistencia(codigo) {
        if (!codigo) return;
        const existente = await dbEngine.buscarPorCodigo(codigo);
        if (existente) {
            if (confirm(`¡Ya existe! ${existente.nombre} (${existente.stock} en stock). ¿Quieres sumar al stock actual?`)) {
                const cant = prompt("¿Cuántas unidades nuevas llegaron?", "1");
                if (cant) {
                    existente.stock += parseInt(cant);
                    await dbEngine.agregar("productos", existente);
                    this.renderProductos();
                }
            }
        }
    },

    async guardarProducto() {
        const file = document.getElementById("imgProducto").files[0];
        let fotoBase64 = "";

        if (file) {
            fotoBase64 = await this.fileToBase64(file);
        }

        const nuevo = {
            codigo: document.getElementById("txtCodigo").value,
            nombre: document.getElementById("txtNombre").value,
            marca: document.getElementById("selMarca").value,
            categoria: document.getElementById("selCategoria").value,
            stock: parseInt(document.getElementById("txtStock").value),
            foto: fotoBase64
        };

        await dbEngine.agregar("productos", nuevo);
        alert("Guardado correctamente");
        this.renderProductos();
    },

    fileToBase64(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
        });
    },

    async renderProductos() {
        const prods = await dbEngine.obtenerTodo("productos");
        document.getElementById("listaProductos").innerHTML = prods.map(p => `
            <div class="card mb-2 p-2 shadow-sm">
                <div class="d-flex gap-3 align-items-center">
                    ${p.foto ? `<img src="${p.foto}" style="width:60px; height:60px; object-fit:cover; border-radius:8px;">` : '<div style="width:60px; height:60px; background:#eee; border-radius:8px;"></div>'}
                    <div class="flex-grow-1">
                        <h6 class="mb-0">${p.nombre}</h6>
                        <small class="text-muted">${p.marca} | ${p.categoria}</small><br>
                        <span class="badge bg-success">Stock: ${p.stock}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
};

// Listeners para nuevas marcas/tipos
document.getElementById("selMarca").onchange = async (e) => {
    if(e.target.value === "nueva") {
        const n = prompt("Nombre de la nueva marca:");
        if(n) await dbEngine.agregar("marcas", {nombre: n});
        ui.renderCatalogos();
    }
};

document.getElementById("selCategoria").onchange = async (e) => {
    if(e.target.value === "nueva") {
        const n = prompt("Nombre del nuevo tipo (ej: Termo, Splash):");
        if(n) await dbEngine.agregar("categorias", {nombre: n});
        ui.renderCatalogos();
    }
};

dbEngine.init().then(() => { ui.renderCatalogos(); ui.renderProductos(); });