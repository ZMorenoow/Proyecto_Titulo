import { GoogleGenerativeAI } from '@google/generative-ai';

// Clave API de Gemini explícita (NO recomendable para producción)
const geminiApiKey = "AIzaSyAcwByCtFvvEUoLmBfRSrujK4CaVwuu_Ws";  // Sustituye "tu_clave_aqui" por la clave real

const genAI = new GoogleGenerativeAI(geminiApiKey);

// Mostrar la clave en la consola (solo en desarrollo, ¡nunca en producción!)
console.log("Clave de la API de Gemini:", geminiApiKey);

const geminiApiCall = async (cotizacionData) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Crear una entrada que combine los datos del formulario para pasarlos a Gemini
    const inputText = `
Estás generando un precio aproximado para un servicio de limpieza basado en los siguientes parámetros:

1. **Cantidad**: ${cotizacionData.cantidad}.
2. **Medidas**: ${cotizacionData.medidas} (separadas por comas, por ejemplo: "50x30 cm, 100x50 cm").
3. **Materiales**: ${cotizacionData.material} (ejemplo: "lana, sintético").
4. **Estado del producto**: ${cotizacionData.estado_producto} (bueno, regular, malo).
5. **Antigüedad del producto**: ${cotizacionData.antiguedad} años.
6. **Especificaciones adicionales**: ${cotizacionData.especificaciones_adicionales || "Ninguna"}.

### Reglas para el cálculo:
- **Precio base**: 25,000 CLP.
- **Rangos permitidos**: Entre 25,000 CLP y 500,000 CLP.
- **Si el cálculo es menor a 25,000 CLP, ajusta a 25,000 CLP. Si es mayor a 500,000 CLP, ajusta a 500,000 CLP.

### Reglas específicas según tipo de limpieza:
1. **Limpieza de pisos:**
   - Materiales:
     - Madera, cerámica, porcelanato: +20%.
     - Mármol o granito: +35%.
     - Vinílicos: +10%.
   - Medidas:
     - Por cada m² adicional: +5,000 CLP.
     - Si el área >10 m²: -10% descuento.
   - Estado:
     - "Malo": +15%.
     - "Regular": +5%.

2. **Limpieza de alfombras:**
   - Materiales:
     - Lana o seda: +30%.
     - Sintéticos: +15%.
   - Medidas:
     - Por cada m² adicional: +7,000 CLP.
     - Si el área >5 m²: +10,000 CLP adicionales.
   - Estado:
     - "Malo": +20%.
     - "Regular": +10%.

3. **Reglas comunes** (aplican a cualquier tipo de limpieza):
   - **Antigüedad del producto**:
     - <1 año: sin cambios.
     - 1-3 años: +5%.
     - >3 años: +10%.
   - **Cantidad**:
     - Multiplica el precio por la cantidad proporcionalmente.
4. **Especificaciones adicionales:Cada especificación opcional agregada incrementa el precio en 5% del total calculado.

---

### Instrucciones finales:
- Calcula el precio en **pesos chilenos (CLP)**
- Devuelve únicamente un **número entero**, sin texto adicional ni símbolos.
- Si el cálculo da un precio menor a 25,000 CLP, **ajústalo automáticamente a 25,000 CLP**.
- Si el cálculo da un precio mayor a 500,000 CLP, **ajústalo automáticamente a 500,000 CLP**.
`;

    const result = await model.generateContent([inputText]);

    // Usar el resultado de Gemini, por ejemplo, el texto con el valor calculado
    return result.response.text();  // Este texto contendrá el valor calculado
  } catch (error) {
    console.error("Error al llamar a Gemini:", error);
    throw new Error('Error al obtener el valor de Gemini');
  }
};

export { geminiApiCall };