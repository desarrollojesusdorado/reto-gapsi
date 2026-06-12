import http from 'k6/http';
import { check, sleep } from 'k6';

// 1. Configuración del escenario de pruebas y criterios de aceptación (Thresholds)
export const options = {
    stages: [
        { duration: '1m', target: 50 },  // Ramp-up: de 0 a 50 usuarios concurrentes en 1 minuto
        { duration: '4m', target: 50 },  // Steady State: Mantener 50 usuarios durante 4 minutos adicionales (Total 5m)
        { duration: '30s', target: 0 },   // Ramp-down para salida limpia
    ],
    thresholds: {
        // Criterios de Aceptación:
        'http_req_failed': ['rate<0.01'],             // Tasa de error debe ser menor al 1% (SLA de errores)
        'http_req_duration': ['p(50)<200', 'p(95)<400', 'p(99)<800'], // Límites para p50, p95 y p99 en milisegundos
    },
};

// 2. Función principal que ejecutarán los usuarios virtuales de forma concurrente
export default function () {
    const url = 'https://orders-api-prod-gcp-placeholder/api/v1/orders/assign';
    
    // Payload de ejemplo basado en el negocio de LogiTrack (Asignación de orden a operador)
    const payload = JSON.stringify({
        orderId: "ORD-2026-99482",
        operatorId: "OP-4412",
        warehouseId: "WH-MEDELLIN-01",
        assignedAt: new Date().toISOString()
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer k6-performance-test-token-mock', // Token de prueba
        },
    };

    // Ejecución del Request HTTP POST
    const response = http.post(url, payload, params);

    // Verificación básica del estado HTTP en tiempo de ejecución
    check(response, {
        'status is 200 or 201': (r) => r.status === 200 || r.status === 201,
        'has transaction token': (r) => r.body.includes('assignmentId') || r.status === 201
    });

    // Tiempo de pensamiento simulado del operador/sistema (1 segundo entre peticiones)
    sleep(1);
}