// src/components/landing/JobBotAnimation.tsx
import type { SVGProps } from 'react';

// Hacemos explícito que className es para el div contenedor.
// Las otras props SVG son para el <svg> del JobBot.
interface JobBotAnimationProps extends Omit<SVGProps<SVGSVGElement>, 'className'> {
    containerClassName?: string; // Clases para el div contenedor (ej. mx-auto mb-4)
    botClassName?: string;       // Clases para el SVG del JobBot (ej. h-32 w-32 text-primary)
}

export function JobBotAnimation({ containerClassName, botClassName, ...svgSpecificProps }: JobBotAnimationProps) {
    return (
        <div
            className={containerClassName}
            style={{
                position: 'relative',
                width: '160px',
                height: '160px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <style>
                {`
                  :root {
                    --animation-cycle-duration: 7s;
                  }
                  /* ... resto de tu CSS ... */
                  .job-bot-eye { animation: job-bot-blink 2.8s infinite ease-in-out; }
                  @keyframes job-bot-blink { 0%, 40%, 100% { opacity: 1; } 45%, 50% { opacity: 0; } }
                  .job-bot-antenna-light { animation: job-bot-pulse 1.5s infinite ease-in-out alternate; }
                  @keyframes job-bot-pulse { from { fill-opacity: 0.4; r: 3px; } to { fill-opacity: 1; r: 3.5px; } }
                  .job-bot-body-light-panel { animation: job-bot-body-glow 2s infinite ease-in-out alternate; }
                  @keyframes job-bot-body-glow { from { opacity: 0.5; } to { opacity: 0.9; } }
                  .job-bot-panel-light { opacity: 0.3; }
                  .job-bot-panel-light.light-1 { animation: job-bot-panel-blink-opacity 1.8s 0s infinite ease-in-out; }
                  .job-bot-panel-light.light-2 { animation: job-bot-panel-blink-opacity 1.8s 0.6s infinite ease-in-out; }
                  .job-bot-panel-light.light-3 { animation: job-bot-panel-blink-opacity 1.8s 1.2s infinite ease-in-out; }
                  @keyframes job-bot-panel-blink-opacity { 0%, 40%, 100% { opacity: 0.3; } 20% { opacity: 1; } }
                  .cv-document-group { animation: cv-processing-flow var(--animation-cycle-duration) infinite ease-in-out; transform-origin: center right; }
                  @keyframes cv-processing-flow { 0% { opacity: 0; transform: translate(-50px, 10px) scale(0.8); } 10% { opacity: 1; transform: translate(-20px, 10px) scale(1); } 20% { opacity: 1; transform: translate(25px, -5px) scale(0.6); } 25% { opacity: 0; transform: translate(25px, -5px) scale(0.4); } 25.01%, 100% { opacity: 0; } }
                  .job-bot-arm-left-working { animation: arm-working-subtle var(--animation-cycle-duration) infinite ease-in-out; transform-origin: 21px 60px; }
                  @keyframes arm-working-subtle { 0%, 9%, 28%, 100% { transform: rotate(0deg) translateX(0px) translateY(0px); } 10% { transform: rotate(-20deg) translateX(-5px) translateY(-3px); } 15% { transform: rotate(5deg) translateX(2px); } 20% { transform: rotate(-10deg) translateX(-3px) translateY(-1px); } 25% { transform: rotate(0deg) translateX(0px) translateY(0px); } }
                  .job-bot-arm-right-presenting { animation: arm-presenting var(--animation-cycle-duration) infinite ease-in-out; transform-origin: 99px 60px; }
                  @keyframes arm-presenting { 0%, 44%, 76%, 100% { transform: rotate(0deg) translateX(0px) translateY(0px); } 45% { transform: rotate(-15deg) translateX(1px) translateY(-1px); } 55% { transform: rotate(-35deg) translateX(2px) translateY(0px); } 65% { transform: rotate(-30deg) translateX(1px) translateY(1px); } 70% { transform: rotate(-10deg) translateX(0px) translateY(0px); } 75% { transform: rotate(0deg) translateX(0px) translateY(0px); } }
                  .is-processing .job-bot-panel-light { animation: job-bot-panel-blink-active 0.5s infinite ease-in-out, panel-accent-processing-anim var(--animation-cycle-duration) infinite ease-in-out; }
                  .is-processing .job-bot-panel-light.light-1 { animation-delay: 0s, calc(var(--animation-cycle-duration) * 0.25); } 
                  .is-processing .job-bot-panel-light.light-2 { animation-delay: 0.15s, calc(var(--animation-cycle-duration) * 0.25); }
                  .is-processing .job-bot-panel-light.light-3 { animation-delay: 0.3s, calc(var(--animation-cycle-duration) * 0.25); }
                  @keyframes job-bot-panel-blink-active { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } }
                  @keyframes panel-accent-processing-anim { 0%, 24% { fill: hsl(var(--accent)); } 25%, 69% { fill: hsl(var(--primary)); } 70%, 100% { fill: hsl(var(--accent)); } }
                  .profile-element { opacity: 0; animation-fill-mode: forwards; animation-timing-function: ease-out; animation-duration: 0.7s; }
                  #profile-placeholder-rect { animation-name: build-profile; animation-delay: calc(var(--animation-cycle-duration) * 0.3); } 
                  #profile-line-1 { animation-name: build-profile; animation-delay: calc(var(--animation-cycle-duration) * 0.35); } 
                  #profile-line-2 { animation-name: build-profile; animation-delay: calc(var(--animation-cycle-duration) * 0.40); }  
                  #profile-line-3 { animation-name: build-profile; animation-delay: calc(var(--animation-cycle-duration) * 0.45); } 
                  @keyframes build-profile { 0% { opacity: 0; transform: scale(0.5) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0px); } }
                  .profile-group { animation: profile-lifecycle var(--animation-cycle-duration) infinite ease-in-out; transform-origin: left center; }
                  @keyframes profile-lifecycle { 0% { opacity: 0; transform: translateX(-100px) translateY(10px) scaleX(0.2) scaleY(0.3); } 29% { opacity: 0; transform: translateX(-90px) translateY(5px) scaleX(0.25) scaleY(0.35); } 30% { opacity: 0.3; transform: translateX(-70px) translateY(0px) scaleX(0.4) scaleY(0.5); } 45% { opacity: 1; transform: translateX(0px) translateY(0px) scaleX(1) scaleY(1); } 45.1%, 60% { opacity: 1; transform: translateX(0px) translateY(0px) scaleX(1) scaleY(1); } 60.1%, 68% { opacity: 1; filter: drop-shadow(0 0 10px hsl(var(--accent)) ); transform: translateX(0px) translateY(0px) scale(1.05); } 68.1% { opacity: 1; filter: none; transform: translateX(0px) translateY(0px) scaleX(1) scaleY(1); } 85% { opacity: 0.3; transform: translateX(-70px) translateY(5px) scaleX(0.4) scaleY(0.5); } 100% { opacity: 0; transform: translateX(-100px) translateY(10px) scaleX(0.2) scaleY(0.3); } }
                `}
            </style>
            <svg
                viewBox="0 0 45 60"
                className="cv-document-group"
                style={{ position: 'absolute', width: '50px', height: 'auto', top: '60px', left: '-45px', zIndex: 10 }}
            >
                <defs><filter id="cv-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="1.5" dy="1.5" stdDeviation="1.5" floodColor="rgba(0,0,0,0.25)"/></filter></defs>
                <g filter="url(#cv-shadow)">
                    <rect x="0" y="0" width="45" height="60" rx="4" ry="4" fill="hsl(var(--muted))"/>
                    <line x1="7" y1="10" x2="38" y2="10" stroke="hsl(var(--secondary))" strokeWidth="3"/>
                    <line x1="7" y1="18" x2="38" y2="18" stroke="hsl(var(--secondary))" strokeWidth="3"/>
                    <line x1="7" y1="26" x2="30" y2="26" stroke="hsl(var(--secondary))" strokeWidth="3"/>
                    <line x1="7" y1="34" x2="38" y2="34" stroke="hsl(var(--secondary))" strokeWidth="3"/>
                    <line x1="7" y1="42" x2="25" y2="42" stroke="hsl(var(--secondary))" strokeWidth="3"/>
                    <line x1="7" y1="50" x2="38" y2="50" stroke="hsl(var(--secondary))" strokeWidth="3"/>
                </g>
            </svg>

            <svg
                viewBox="0 0 70 90"
                className="profile-group"
                style={{ position: 'absolute', width: '50px', height: 'auto', top: '60px', right: '-45px', zIndex: 10 }}
            >
                <defs><filter id="profile-elements-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.2)"/></filter></defs>
                <g filter="url(#profile-elements-shadow)">
                    <rect id="profile-placeholder-rect" className="profile-element" x="5" y="5" width="60" height="40" rx="4" fill="hsl(var(--secondary))"/>
                    <rect id="profile-line-1" className="profile-element" x="5" y="50" width="60" height="7" rx="2.5" fill="hsl(var(--secondary))"/>
                    <rect id="profile-line-2" className="profile-element" x="5" y="62" width="55" height="7" rx="2.5" fill="hsl(var(--secondary))"/>
                    <rect id="profile-line-3" className="profile-element" x="5" y="74" width="50" height="7" rx="2.5" fill="hsl(var(--secondary))"/>
                </g>
            </svg>

            {/* SVG del JobBot */}
            {/* 2. Aplicar botClassName (h-32 w-32 text-primary) y svgSpecificProps aquí */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 120 120" // viewBox intrínseco del JobBot
                {...svgSpecificProps} // Resto de las props SVG (podrían incluir un viewBox diferente si se desea)
                className={`${botClassName || ''} is-processing`} // Clases para tamaño y color del bot
                // Las clases h-32 w-32 de Tailwind establecerán el width y height CSS del SVG.
                // El SVG se centrará por el flexbox del div padre.
            >
                {/* Contenido del SVG del JobBot (sin cambios) */}
                <line x1="60" y1="10" x2="60" y2="0" stroke="hsl(var(--secondary-foreground))" strokeWidth="1.5" />
                <circle cx="60" cy="1" r="3" className="job-bot-antenna-light" fill="hsl(var(--accent))" stroke="hsl(var(--background))" strokeWidth="0.5" />
                <rect x="40" y="10" width="40" height="30" rx="6" ry="6" fill="currentColor" stroke="hsl(var(--border))" strokeWidth="0.5"/>
                <rect x="46" y="20" width="28" height="10" rx="3" fill="hsl(var(--secondary))" />
                <circle cx="53" cy="25" r="3.5" fill="white" className="job-bot-eye" />
                <circle cx="67" cy="25" r="3.5" fill="white" className="job-bot-eye" style={{ animationDelay: '0.15s' }} />
                <rect x="55" y="40" width="10" height="5" fill="hsl(var(--secondary))" />
                <rect x="30" y="45" width="60" height="55" rx="10" ry="10" fill="currentColor" stroke="hsl(var(--border))" strokeWidth="0.5"/>
                <g className="job-bot-arm-left-working"><rect x="15" y="58" width="12" height="35" rx="5" ry="5" fill="currentColor" /><circle cx="21" cy="95" r="7" fill="hsl(var(--secondary))" /></g>
                <g className="job-bot-arm-right-presenting"><rect x="93" y="58" width="12" height="35" rx="5" ry="5" fill="currentColor" /><circle cx="99" cy="95" r="7" fill="hsl(var(--secondary))" /></g>
                <rect x="42" y="55" width="36" height="20" rx="3" fill="hsl(var(--background))" className="job-bot-body-light-panel" />
                <circle cx="50" cy="65" r="2.5" fill="hsl(var(--accent))" className="job-bot-panel-light light-1" />
                <circle cx="60" cy="65" r="2.5" fill="hsl(var(--accent))" className="job-bot-panel-light light-2" />
                <circle cx="70" cy="65" r="2.5" fill="hsl(var(--accent))" className="job-bot-panel-light light-3" />
                <rect x="42" y="100" width="16" height="20" rx="4" ry="4" fill="currentColor" />
                <rect x="62" y="100" width="16" height="20" rx="4" ry="4" fill="currentColor" />
            </svg>
        </div>
    );
}