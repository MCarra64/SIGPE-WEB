document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const res = await fetch('http://localhost:4000/api/reportes/dashboard', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Error al cargar datos');
        const data = await res.json();

        // --- 1. ACTUALIZAR TARJETAS ---
        document.getElementById('card-recaudado').textContent = `$${Number(data.caja_hoy).toFixed(2)}`;

        document.getElementById('card-abonados').textContent = data.total_abonados;
        document.getElementById('card-abonados-texto').textContent = `${data.total_abonados} residentes activos`;

        document.getElementById('card-morosos').textContent = `$${Number(data.morosos.deuda_total).toFixed(2)}`;
        document.getElementById('card-morosos-texto').textContent = `${data.morosos.cantidad_morosos} residentes atrasados`;

        // Calcular gastos del mes actual para la tarjeta 4
        const fechaActual = new Date().toISOString().slice(0, 7); // Formato "YYYY-MM"
        const gastoMesActual = data.gastos_meses.find(g => g.mes_anio === fechaActual)?.total || 0;
        if (document.getElementById('card-gastos')) {
            document.getElementById('card-gastos').textContent = `$${Number(gastoMesActual).toFixed(2)}`;
        }

        // --- 2. RENDERIZAR GRÁFICA (INGRESOS VS EGRESOS) ---
        const ctx = document.getElementById('graficoIngresos').getContext('2d');

        // Juntamos todos los meses únicos que existan en ingresos o gastos y los ordenamos
        const mesesUnicos = [...new Set([
            ...data.ingresos_meses.map(i => i.mes_anio),
            ...data.gastos_meses.map(g => g.mes_anio)
        ])].sort();

        const mesesNombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

        // Formatear etiquetas (Ej: "2026-10" -> "Oct 26")
        const labels = mesesUnicos.map(item => {
            const [year, month] = item.split('-');
            return `${mesesNombres[parseInt(month) - 1]} ${year.slice(2)}`;
        });

        // Mapear los datos de ingresos y gastos a esos meses
        const datosIngresos = mesesUnicos.map(mes => {
            const encontrado = data.ingresos_meses.find(i => i.mes_anio === mes);
            return encontrado ? encontrado.total : 0;
        });

        const datosGastos = mesesUnicos.map(mes => {
            const encontrado = data.gastos_meses.find(g => g.mes_anio === mes);
            return encontrado ? encontrado.total : 0;
        });

        // Si no hay datos, mostramos al menos el mes actual vacío
        if (labels.length === 0) {
            labels.push('Sin datos');
            datosIngresos.push(0);
            datosGastos.push(0);
        }

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Ingresos',
                        data: datosIngresos,
                        backgroundColor: '#005e9a', // primary color
                        borderRadius: 4,
                        barThickness: 20
                    },
                    {
                        label: 'Egresos',
                        data: datosGastos,
                        backgroundColor: '#007e98', // tertiary-container color
                        borderRadius: 4,
                        barThickness: 20
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                        position: 'top',
                        labels: { usePointStyle: true, boxWidth: 8 }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: '#eff4ff' }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });

        // --- 3. RENDERIZAR ACTIVIDADES RECIENTES ---
        const listaActividades = document.getElementById('lista-actividades');
        listaActividades.innerHTML = '';

        if (data.actividades.length === 0) {
            listaActividades.innerHTML = '<p class="text-sm text-on-surface-variant text-center py-4">No hay pagos recientes.</p>';
        } else {
            data.actividades.forEach(act => {
                const fecha = new Date(act.fecha_pago).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
                const itemHTML = `
                    <div class="flex gap-4 items-start pb-4 border-b border-outline-variant/30 last:border-0">
                        <div class="w-10 h-10 rounded-full bg-secondary-container/30 text-secondary flex items-center justify-center shrink-0">
                            <span class="material-symbols-outlined text-[20px]">payments</span>
                        </div>
                        <div class="min-w-0 flex-1">
                            <p class="font-body-md text-on-surface font-medium truncate">Pago recibido - ${act.numero_cuenta}</p>
                            <p class="font-body-sm text-on-surface-variant truncate">${act.nombre_abonado} (Recibo: ${act.numero_recibo})</p>
                            <p class="text-xs text-outline mt-1">${fecha}</p>
                        </div>
                        <div class="ml-2 font-medium text-secondary whitespace-nowrap text-sm md:text-base">
                            +$${Number(act.monto_pagado).toFixed(2)}
                        </div>
                    </div>
                `;
                listaActividades.insertAdjacentHTML('beforeend', itemHTML);
            });
        }

    } catch (error) {
        console.error("Error cargando dashboard:", error);
    }
});

// LÓGICA DE MODALES Y ENVÍO DE DATOS
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    // --- Utilidades de UI ---
    const toggleModal = (modalId, show) => {
        const modal = document.getElementById(modalId);
        if (show) { modal.classList.remove('hidden'); modal.classList.add('flex'); }
        else { modal.classList.add('hidden'); modal.classList.remove('flex'); }
    };

    // --- 1. MODAL: REGISTRAR PAGO ---
    const btnPago = document.getElementById('btn-open-pago');
    const formPago = document.getElementById('pago-form');
    const inputCuenta = document.getElementById('pago-cuenta-input');
    const inputPeriodo = document.getElementById('pago-periodo-input');
    const inputMonto = document.getElementById('pago-monto');
    const listaCuentas = document.getElementById('lista-cuentas');
    const listaPeriodos = document.getElementById('lista-periodos');

    // Abrir modal y cargar cuentas
    btnPago.addEventListener('click', async () => {
        toggleModal('pago-modal', true);
        formPago.reset();
        inputPeriodo.disabled = true;
        listaPeriodos.innerHTML = '';
        listaCuentas.innerHTML = '<option value="">Cargando...</option>';

        try {
            const resCuentas = await fetch('http://localhost:4000/api/cuentas', { headers: { 'Authorization': `Bearer ${token}` } });
            const cuentas = await resCuentas.json();

            // Llenamos el datalist con Nombre (Numero de cuenta). Guardamos el ID en data-id
            listaCuentas.innerHTML = cuentas.map(c =>
                `<option value="${c.nombre_abonado} (${c.numero_cuenta})" data-id="${c.id_cuenta}"></option>`
            ).join('');

            document.getElementById('pago-recibo').value = 'REC-' + Math.floor(Math.random() * 10000);
        } catch (error) {
            console.error("Error cargando cuentas", error);
        }
    });

    // Detectar cuando se selecciona una cuenta de la lista
    inputCuenta.addEventListener('change', async () => {
        const selectedOption = document.querySelector(`#lista-cuentas option[value="${inputCuenta.value}"]`);
        if (!selectedOption) return; // Si escribió algo que no existe, no hacemos nada

        const idCuenta = selectedOption.getAttribute('data-id');

        // Limpiar periodos anteriores
        inputPeriodo.value = '';
        inputMonto.value = '';
        inputPeriodo.disabled = true;
        listaPeriodos.innerHTML = '<option value="">Cargando...</option>';

        try {
            // Buscar periodos pendientes de ESTA cuenta
            const resPendientes = await fetch(`http://localhost:4000/api/cuentas/${idCuenta}/pendientes`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const pendientes = await resPendientes.json();

            if (pendientes.length === 0) {
                listaPeriodos.innerHTML = '<option value="">Sin periodos pendientes</option>';
                return;
            }

            const mesesNombres = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

            // Llenamos el datalist de periodos
            listaPeriodos.innerHTML = pendientes.map(p => {
                const nombreMes = mesesNombres[p.mes - 1];
                return `<option value="${nombreMes} ${p.anio} - ${p.descripcion}" data-id="${p.id_periodo}" data-monto="${p.monto}"></option>`;
            }).join('');

            inputPeriodo.disabled = false; // Habilitar el input
            inputPeriodo.placeholder = "Escriba o seleccione el periodo...";

        } catch (error) {
            console.error("Error cargando pendientes", error);
        }
    });

    // Detectar cuando se selecciona un periodo para autocompletar el monto
    inputPeriodo.addEventListener('change', () => {
        const selectedOption = document.querySelector(`#lista-periodos option[value="${inputPeriodo.value}"]`);
        if (selectedOption) {
            inputMonto.value = selectedOption.getAttribute('data-monto');
        } else {
            inputMonto.value = ''; // Si borra el texto, se limpia el monto
        }
    });

    document.getElementById('close-pago-modal').addEventListener('click', () => toggleModal('pago-modal', false));
    document.getElementById('cancel-pago-btn').addEventListener('click', () => toggleModal('pago-modal', false));

    // Enviar Pago
    formPago.addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorDiv = document.getElementById('pago-error');
        errorDiv.classList.add('hidden');

        // Extraer los IDs reales de los datalists
        const cuentaOption = document.querySelector(`#lista-cuentas option[value="${inputCuenta.value}"]`);
        const periodoOption = document.querySelector(`#lista-periodos option[value="${inputPeriodo.value}"]`);

        if (!cuentaOption || !periodoOption) {
            errorDiv.textContent = 'Debe seleccionar una cuenta y un periodo válidos de la lista.';
            errorDiv.classList.remove('hidden');
            return;
        }

        const idCuentaReal = cuentaOption.getAttribute('data-id');
        const idPeriodoReal = periodoOption.getAttribute('data-id');

        const bodyData = {
            id_cuenta: idCuentaReal,
            id_periodo: idPeriodoReal,
            monto_pagado: inputMonto.value,
            numero_recibo: document.getElementById('pago-recibo').value,
            observacion: null // Enviamos null explícito para evitar errores
        };

        try {
            const response = await fetch('http://localhost:4000/api/pagos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(bodyData)
            });
            const data = await response.json();

            if (response.ok) {
                alert('Pago registrado con éxito');
                toggleModal('pago-modal', false);
                window.location.reload();
            } else {
                throw new Error(data.error || 'Error al registrar pago');
            }
        } catch (error) {
            errorDiv.textContent = error.message;
            errorDiv.classList.remove('hidden');
        }
    });

    document.getElementById('close-pago-modal').addEventListener('click', () => toggleModal('pago-modal', false));
    document.getElementById('cancel-pago-btn').addEventListener('click', () => toggleModal('pago-modal', false));

    formPago.addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorDiv = document.getElementById('pago-error');
        errorDiv.classList.add('hidden');

        const bodyData = {
            id_cuenta: selectCuenta.value,
            id_periodo: selectPeriodo.value,
            monto_pagado: document.getElementById('pago-monto').value,
            numero_recibo: document.getElementById('pago-recibo').value
        };

        try {
            const response = await fetch('http://localhost:4000/api/pagos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(bodyData)
            });
            const data = await response.json();

            if (response.ok) {
                alert('Pago registrado con éxito');
                toggleModal('pago-modal', false);
                window.location.reload(); // Recargar para actualizar los datos del dashboard
            } else {
                throw new Error(data.error || 'Error al registrar pago');
            }
        } catch (error) {
            errorDiv.textContent = error.message;
            errorDiv.classList.remove('hidden');
        }
    });

    // --- 2. MODAL: NUEVO RESIDENTE ---
    const btnResidente = document.getElementById('btn-open-residente');

    btnResidente.addEventListener('click', () => toggleModal('residente-modal', true));
    document.getElementById('close-residente-modal').addEventListener('click', () => toggleModal('residente-modal', false));
    document.getElementById('cancel-residente-btn').addEventListener('click', () => toggleModal('residente-modal', false));

    document.getElementById('residente-form').addEventListener('submit', async (e) => {
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

            if (response.ok) {
                alert('Residente registrado con éxito');
                toggleModal('residente-modal', false);
                window.location.reload();
            } else {
                throw new Error(data.error || 'Error al registrar residente');
            }
        } catch (error) {
            errorDiv.textContent = error.message;
            errorDiv.classList.remove('hidden');
        }
    });
});