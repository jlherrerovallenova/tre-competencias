
# Cuestionario de Competencias (200 Preguntas)

Este repositorio contiene una aplicación web **autoalojada** que permite responder un cuestionario de 200 preguntas distribuidas proporcionalmente entre **9 competencias**.

## 🚀 Funcionalidades

- **200 preguntas** tipo test (Likert de 4 opciones) distribuidas en las 9 competencias:
  1. Responsabilidad y autonomía  
  2. Calidad y mejora continua  
  3. Colaboración y cooperación  
  4. Orientación a resultados  
  5. Solución de problemas  
  6. Capacidad de aprendizaje  
  7. Pensamiento analítico  
  8. Competencia digital  
  9. Gestión de emociones  

- **Guarda automáticamente el progreso** en el navegador (localStorage).  
- **Permite exportar/importar** el progreso para continuar en otro dispositivo.  
- **Resumen final** con medias por competencia (corrigiendo ítems inversos).  
- Muestra y **resalta la competencia actual** en cada pregunta.

## 🖼️ Capturas de pantalla

### Pantalla de inicio
![Inicio](https://i.imgur.com/CAPTURA1.png)

### Pregunta con competencia resaltada
![Pregunta](https://i.imgur.com/CAPTURA2.png)

### Resumen final
![Resumen](https://i.imgur.com/CAPTURA3.png)

## 🛠️ Cómo usarlo

1. Abre el cuestionario online en **GitHub Pages**:  
   👉 [https://TU_USUARIO.github.io/tre-competencias/](https://TU_USUARIO.github.io/tre-competencias/)

2. Pulsa **Comenzar** y responde.  
3. Puedes salir y volver más tarde: el progreso se guarda solo.  
4. Si quieres cambiar de dispositivo, usa **Exportar** y luego **Importar**.

## 📥 Uso local (opcional)

Si necesitas abrirlo sin conexión:  

- **Firefox**: solo abre `index.html` directamente.  
- **Chrome/Edge**: levanta un servidor local en la carpeta:  
  ```bash
  python -m http.server 8000
  ```
  y abre [http://localhost:8000](http://localhost:8000).

## 🔄 Actualizaciones

- Última versión: **Competencia resaltada y preguntas completas** (200 preguntas).  
