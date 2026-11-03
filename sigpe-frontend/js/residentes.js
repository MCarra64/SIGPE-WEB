// js/residentes.js
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const tablaBody = document.getElementById('tabla-residentes-body');
    const searchInput = document.getElementById('search-input');
    
    // Botones de filtro
    const btnTodos = document.getElementById('filter-todos');
    const btnPagados = document.getElementById('filter-pagados');
    const btnMora = document.getElementById('filter-mora');
    
    // Controles de paginación
    const rowsPerPageSelect = document.getElementById('rows-per-page');
    const btnPrev = document.getElementById('btn-prev-page');
    const btnNext = document.getElementById('btn-next-page');
    const paginationText = document.getElementById('pagination-text');

    // Variables de estado
    let todosLosResidentes = []; 
    let datosFiltrados = [];
    let filtroActual = 'todos';
    let currentPage = 1;
    let rowsPerPage = 15; // Por defecto

    // --- LÓGICA DE FILTROS Y ESTILOS ---
    const actualizarEstilosFiltros = () => {
        // Reseteamos todos a su estado base (sin anillo de selección)
        [btnTodos, btnPagados, btnMora].forEach(btn => {
            btn.classList.remove('ring-2', 'ring-primary', 'ring-offset-2', 'font-bold');
        });
        
        // Aplicamos el anillo de selección al botón activo
        if (filtroActual === 'todos') btnTodos.classList.add('ring-2', 'ring-primary', 'ring-offset-2', 'font-bold');
        if (filtroActual === 'pagados') btnPagados.classList.add('ring-2', 'ring-primary', 'ring-offset-2', 'font-bold');
        if (filtroActual === 'mora') btnMora.classList.add('ring-2', 'ring-primary', 'ring-offset-2', 'font-bold');
    };

    btnTodos.addEventListener('click', () => { filtroActual = 'todos'; currentPage = 1; aplicarFiltros(); });
    btnPagados.addEventListener('click', () => { filtroActual = 'pagados'; currentPage = 1; aplicarFiltros(); });
    btnMora.addEventListener('click', () => { filtroActual = 'mora'; currentPage = 1; aplicarFiltros(); });

    // --- CARGAR DATOS DESDE EL BACKEND ---
    const cargarResidentes = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/abonados/tabla', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Error al cargar residentes');
            
            todosLosResidentes = await res.json();
            aplicarFiltros(); // Primera carga
        } catch (error) {
            console.error(error);
            tablaBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-error">Error al cargar datos</td></tr>`;
        }
    };

    // --- FILTRAR (Buscar en TODA la base y aplicar botones) ---
    const aplicarFiltros = () => {
        actualizarEstilosFiltros();
        const textoBusqueda = searchInput.value.toLowerCase().trim();

        datosFiltrados = todosLosResidentes.filter(res => {
            // 1. Evaluar botón de estado
            let cumpleFiltro = true;
            const deuda = Number(res.deuda_total);
            if (filtroActual === 'pagados') cumpleFiltro = deuda === 0;
            if (filtroActual === 'mora') cumpleFiltro = deuda > 0;

            // 2. Evaluar barra de búsqueda (Nombre o Cuenta)
            const cumpleBusqueda = 
                res.nombre_completo.toLowerCase().includes(textoBusqueda) || 
                res.numero_cuenta.toLowerCase().includes(textoBusqueda);

            return cumpleFiltro && cumpleBusqueda;
        });

        // Al filtrar, volvemos a la página 1
        currentPage = 1;
        paginarYRenderizar();
    };

    searchInput.addEventListener('input', aplicarFiltros);

    // --- PAGINACIÓN ---
    rowsPerPageSelect.addEventListener('change', (e) => {
        rowsPerPage = parseInt(e.target.value);
        currentPage = 1; // Volver a la primera página al cambiar el límite
        paginarYRenderizar();
    });

    btnPrev.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            paginarYRenderizar();
        }
    });

    btnNext.addEventListener('click', () => {
        const totalPages = rowsPerPage === -1 ? 1 : Math.ceil(datosFiltrados.length / rowsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            paginarYRenderizar();
        }
    });

    const paginarYRenderizar = () => {
        const totalRegistros = datosFiltrados.length;
        const totalPages = rowsPerPage === -1 ? 1 : Math.ceil(totalRegistros / rowsPerPage);

        // Calcular límites
        let start = (currentPage - 1) * rowsPerPage;
        let end = rowsPerPage === -1 ? totalRegistros : start + rowsPerPage;

        // Extraer solo los datos de esta página
        const datosPagina = rowsPerPage === -1 
            ? datosFiltrados 
            : datosFiltrados.slice(start, end);

        // Actualizar texto de paginación
        if (totalRegistros === 0) {
            paginationText.textContent = `Mostrando 0 de 0 residentes`;
        } else {
            const displayStart = start + 1;
            const displayEnd = Math.min(end, totalRegistros);
            paginationText.textContent = `Mostrando ${displayStart} a ${displayEnd} de ${totalRegistros} residentes`;
        }

        // Actualizar estado de los botones
        btnPrev.disabled = currentPage === 1;
        btnNext.disabled = currentPage === totalPages || totalPages === 0;

        // Renderizar la tabla
        renderizarTabla(datosPagina);
    };

    // --- RENDERIZAR TABLA ---
    const renderizarTabla = (datos) => {
        tablaBody.innerHTML = '';
        
        if (datos.length === 0) {
            tablaBody.innerHTML = `<tr><td colspan="5" class="text-center py-8 text-on-surface-variant">No se encontraron residentes.</td></tr>`;
            return;
        }

        datos.forEach(res => {
            const iniciales = (res.nombres.charAt(0) + res.apellidos.charAt(0)).toUpperCase();
            const deuda = Number(res.deuda_total);
            const esMoroso = deuda > 0;
            
            let ultimoPagoTexto = 'Ninguno';
            if (res.ultimo_pago) {
                const fecha = new Date(res.ultimo_pago);
                ultimoPagoTexto = fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
            }

            // Restaurando los colores exactos de Stitch
            const badgeClass = esMoroso 
                ? 'bg-[#fde8e8] text-[#9b1c1c]' // Rojo para mora
                : 'bg-[#def7ec] text-[#03543f]'; // Verde para pagado
            
            const badgeTexto = esMoroso ? 'Mora' : 'Pagado';

            const fila = `
                <tr class="table-row-hover transition-colors">
                    <td class="py-4 px-4 sm:px-6">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary font-label-md shrink-0">${iniciales}</div>
                            <span class="font-medium whitespace-nowrap">${res.nombre_completo}</span>
                        </div>
                    </td>
                    <td class="py-4 px-4 sm:px-6 tabular-nums text-on-surface-variant whitespace-nowrap">${res.numero_cuenta}</td>
                    <td class="py-4 px-4 sm:px-6 whitespace-nowrap">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}">
                            ${badgeTexto}
                        </span>
                    </td>
                    <td class="py-4 px-4 sm:px-6 tabular-nums text-on-surface-variant whitespace-nowrap">${ultimoPagoTexto}</td>
                    <td class="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                        <div class="inline-flex items-center justify-end gap-1">
                            <button onclick="abrirHistorial(${res.id_cuenta}, '${res.nombre_completo}')" class="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-lg transition-colors" title="Ver Historial">
                                <span class="material-symbols-outlined text-[20px]">history</span>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            tablaBody.insertAdjacentHTML('beforeend', fila);
        });
    };

    // --- MODAL: HISTORIAL (Mismo código de antes) ---
    const historialModal = document.getElementById('historial-modal');
    window.abrirHistorial = async (idCuenta, nombre) => {
        document.getElementById('historial-titulo').textContent = `Estado de Cuenta: ${nombre}`;
        const tbody = document.getElementById('historial-tbody');
        tbody.innerHTML = '<tr><td colspan="3" class="text-center py-4">Cargando...</td></tr>';
        
        historialModal.classList.remove('hidden');
        historialModal.classList.add('flex');

        try {
            const res = await fetch(`http://localhost:4000/api/reportes/estado-cuenta/${idCuenta}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            document.getElementById('historial-deuda').textContent = `$${data.resumen.total_pendiente}`;
            const estadoTxt = document.getElementById('historial-estado');
            estadoTxt.textContent = data.resumen.estado;
            estadoTxt.className = data.resumen.estado === 'Al día' ? 'text-xl font-bold text-secondary' : 'text-xl font-bold text-error';

            tbody.innerHTML = '';
            if (data.historial.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" class="text-center py-4 text-on-surface-variant">No hay periodos registrados.</td></tr>';
            } else {
                data.historial.forEach(h => {
                    const pagado = h.id_pago !== null;
                    const badge = pagado ? '<span class="text-secondary font-medium">Pagado</span>' : '<span class="text-error font-medium">Pendiente</span>';
                    tbody.insertAdjacentHTML('beforeend', `
                        <tr class="border-b border-outline-variant/30">
                            <td class="py-2 px-3">${h.mes}/${h.anio}</td>
                            <td class="py-2 px-3">$${Number(h.monto_esperado).toFixed(2)}</td>
                            <td class="py-2 px-3">${badge}</td>
                        </tr>
                    `);
                });
            }
        } catch (error) {
            tbody.innerHTML = '<tr><td colspan="3" class="text-center py-4 text-error">Error al cargar historial</td></tr>';
        }
    };

    document.getElementById('close-historial-modal').addEventListener('click', () => {
        historialModal.classList.add('hidden');
        historialModal.classList.remove('flex');
    });

    // --- MODAL: NUEVO RESIDENTE (Mismo código de antes) ---
    const residenteModal = document.getElementById('residente-modal');
    const formResidente = document.getElementById('residente-form');

    document.getElementById('btn-open-residente').addEventListener('click', () => {
        residenteModal.classList.remove('hidden');
        residenteModal.classList.add('flex');
        formResidente.reset();
        document.getElementById('residente-error').classList.add('hidden');
    });

    document.getElementById('close-residente-modal').addEventListener('click', () => {
        residenteModal.classList.add('hidden');
        residenteModal.classList.remove('flex');
    });
    document.getElementById('cancel-residente-btn').addEventListener('click', () => {
        residenteModal.classList.add('hidden');
        residenteModal.classList.remove('flex');
    });

    formResidente.addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorDiv = document.getElementById('residente-error');
        errorDiv.classList.add('hidden');

        const bodyData = {
            nombres: document.getElementById('res-nombres').value,
            apellidos: document.getElementById('res-apellidos').value,
            telefono: document.getElementById('res-telefono').value,
            direccion: document.getElementById('res-direccion').value
        };

        try {
            const response = await fetch('http://localhost:4000/api/abonados', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(bodyData)
            });
            const data = await response.json();
            
            if(response.ok) {
                alert('Residente registrado con éxito');
                residenteModal.classList.add('hidden');
                residenteModal.classList.remove('flex');
                cargarResidentes(); // Recargar la tabla completa
            } else {
                throw new Error(data.error || 'Error al registrar residente');
            }
        } catch (error) {
            errorDiv.textContent = error.message;
            errorDiv.classList.remove('hidden');
        }
    });

    // --- INICIALIZACIÓN ---
    const urlParams = new URLSearchParams(window.location.search);
    const filtroUrl = urlParams.get('filtro');
    if (filtroUrl === 'morosos') {
        filtroActual = 'mora';
    }
    cargarResidentes();
});