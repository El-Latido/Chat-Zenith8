graph TD
    subgraph Frontend [Frontend - React + Vite]
        UI[UI Glassmorphism] -->|Sockets| SocketClient[Socket.io Client]
        UI -->|HTTP| RESTClient[Axios/Fetch]
    end

    subgraph Backend [Backend - Express + TS]
        SocketServer[Socket.io Server] --> Router{Router / Event Loop}
        RESTClient --> Router
        Router -->|Moderación| Mod[Motor de Moderación]
        Router -->|Peticiones IA| AIService[Servicio de IA Resiliente]
    end

    subgraph Data & AI [Capa de Datos e IA]
        Router --> Firebase[(Firebase Realtime DB)]
        Router -.Fallback.-> JSON[(Local db.json)]
        
        AIService -->|Intento 1| Gemini[Google Gemini API]
        Gemini -->|Si falla/Timeout| Groq[Groq Llama 3 API]
    end

    SocketClient -.Comunicación Bidireccional.-> SocketServer
