
// src/components/landing/JobBotAnimation.tsx
import type { SVGProps } from 'react';

export function JobBotAnimation(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      // className="h-32 w-32 text-primary mx-auto mb-4" // Clases se pasan por props
      {...props}
    >
      <style>
        {`
          .job-bot-eye {
            animation: job-bot-blink 2.8s infinite ease-in-out;
          }
          @keyframes job-bot-blink {
            0%, 40%, 100% { opacity: 1; }
            45%, 50% { opacity: 0; }
          }
          .job-bot-antenna-light {
            animation: job-bot-pulse 1.5s infinite ease-in-out alternate;
          }
          @keyframes job-bot-pulse {
            from { fill-opacity: 0.4; r: 3px; }
            to { fill-opacity: 1; r: 3.5px; }
          }
          .job-bot-arm-right {
            animation: job-bot-wave 2.5s infinite ease-in-out; /* Animación de saludo */
            transform-origin: 99px 60px; /* Punto de rotación para el saludo */
          }
          @keyframes job-bot-wave { /* Animación de saludo */
            0%, 100% { transform: rotate(0deg); }
            20%, 60% { transform: rotate(-25deg); }
            40%, 80% { transform: rotate(10deg); }
          }
          .job-bot-body-light-panel { /* Panel de luces del cuerpo */
            animation: job-bot-body-glow 2s infinite ease-in-out alternate;
          }
          @keyframes job-bot-body-glow {
            from { opacity: 0.5; }
            to { opacity: 0.9; }
          }
          .job-bot-panel-light { /* Luces individuales del panel */
            animation-name: job-bot-panel-blink;
            animation-duration: 1.8s; /* Duración más larga para un parpadeo más espaciado */
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
          }
          .job-bot-panel-light.light-1 {
            animation-delay: 0s;
          }
          .job-bot-panel-light.light-2 {
            animation-delay: 0.6s;
          }
          .job-bot-panel-light.light-3 {
            animation-delay: 1.2s;
          }
          @keyframes job-bot-panel-blink { /* Parpadeo de luces del panel */
            0%, 40%, 100% { opacity: 0.3; }
            20% { opacity: 1; }
          }
        `}
      </style>
      {/* Antena */}
      <line x1="60" y1="10" x2="60" y2="0" stroke="hsl(var(--secondary-foreground))" strokeWidth="1.5" />
      <circle cx="60" cy="1" r="3" className="job-bot-antenna-light" fill="hsl(var(--accent))" stroke="hsl(var(--background))" strokeWidth="0.5" />

      {/* Cabeza */}
      <rect x="40" y="10" width="40" height="30" rx="6" ry="6" fill="currentColor" stroke="hsl(var(--border))" strokeWidth="0.5"/>
      {/* Ojos */}
      <rect x="46" y="20" width="28" height="10" rx="3" fill="hsl(var(--secondary))" />
      <circle cx="53" cy="25" r="3.5" fill="white" className="job-bot-eye" />
      <circle cx="67" cy="25" r="3.5" fill="white" className="job-bot-eye" style={{ animationDelay: '0.15s' }} />
      
      {/* Cuello */}
      <rect x="55" y="40" width="10" height="5" fill="hsl(var(--secondary))" />

      {/* Cuerpo */}
      <rect x="30" y="45" width="60" height="55" rx="10" ry="10" fill="currentColor" stroke="hsl(var(--border))" strokeWidth="0.5"/>

      {/* Brazos */}
      {/* Brazo Izquierdo (estático) */}
      <rect x="15" y="58" width="12" height="35" rx="5" ry="5" fill="currentColor" />
      <circle cx="21" cy="95" r="7" fill="hsl(var(--secondary))" /> {/* Mano */}

      {/* Brazo Derecho (animado saludando) */}
      <g className="job-bot-arm-right">
        <rect x="93" y="58" width="12" height="35" rx="5" ry="5" fill="currentColor" />
        <circle cx="99" cy="95" r="7" fill="hsl(var(--secondary))" /> {/* Mano */}
      </g>
      
      {/* Panel de control en el cuerpo */}
      <rect x="42" y="55" width="36" height="20" rx="3" fill="hsl(var(--background))" className="job-bot-body-light-panel" />
      <circle cx="50" cy="65" r="2.5" fill="hsl(var(--accent))" className="job-bot-panel-light light-1" />
      <circle cx="60" cy="65" r="2.5" fill="hsl(var(--accent))" className="job-bot-panel-light light-2" />
      <circle cx="70" cy="65" r="2.5" fill="hsl(var(--accent))" className="job-bot-panel-light light-3" />
      
      {/* Piernas/Base */}
      <rect x="42" y="100" width="16" height="20" rx="4" ry="4" fill="currentColor" />
      <rect x="62" y="100" width="16" height="20" rx="4" ry="4" fill="currentColor" />
    </svg>
  );
}
