import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const UltraLoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showParticles, setShowParticles] = useState(false);

  const loadingSteps = [
    'Initializing Risk Monitor Pro...',
    'Connecting to market data feeds...',
    'Synchronizing portfolio data...',
    'Loading trading algorithms...',
    'Establishing secure connections...',
    'Calibrating risk metrics...',
    'Finalizing dashboard setup...'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => onComplete?.(), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 80);

    const stepTimer = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % loadingSteps.length);
    }, 1200);

    setTimeout(() => setShowParticles(true), 500);

    return () => {
      clearInterval(timer);
      clearInterval(stepTimer);
    };
  }, [onComplete]);

  // Generate floating particles
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 3 + 2
  }));

  // Generate matrix-style code rain
  const codeRain = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2
  }));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          overflow: 'hidden'
        }}
      >
        {/* Animated Background Grid */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }} />

        {/* Floating Particles */}
        {showParticles && particles.map(particle => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: `${particle.x}vw`, 
              y: `${particle.y}vh`,
              opacity: 0,
              scale: 0
            }}
            animate={{ 
              y: [`${particle.y}vh`, `${particle.y - 20}vh`, `${particle.y}vh`],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: 'linear-gradient(45deg, #00ff88, #0099ff)',
              borderRadius: '50%',
              boxShadow: `0 0 ${particle.size * 2}px rgba(0, 255, 136, 0.5)`
            }}
          />
        ))}

        {/* Matrix Code Rain Effect */}
        {codeRain.map(rain => (
          <motion.div
            key={rain.id}
            initial={{ y: '-100vh', opacity: 0 }}
            animate={{ y: '100vh', opacity: [0, 1, 0] }}
            transition={{
              duration: rain.duration,
              delay: rain.delay,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              color: '#00ff88',
              fontSize: '12px',
              fontFamily: 'monospace',
              whiteSpace: 'nowrap'
            }}
          >
            {Array.from({ length: 10 }, () => 
              Math.random().toString(36).substring(2, 8)
            ).join(' ')}
          </motion.div>
        ))}

        {/* Central Loading Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
          style={{
            position: 'relative',
            zIndex: 10
          }}
        >
          {/* Outer Rotating Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{
              width: '200px',
              height: '200px',
              border: '2px solid transparent',
              borderTop: '2px solid #00ff88',
              borderRight: '2px solid #0099ff',
              borderRadius: '50%',
              position: 'relative'
            }}
          >
            {/* Inner Pulsing Core */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                boxShadow: [
                  '0 0 20px rgba(0, 255, 136, 0.5)',
                  '0 0 40px rgba(0, 255, 136, 0.8)',
                  '0 0 20px rgba(0, 255, 136, 0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80px',
                height: '80px',
                background: 'linear-gradient(45deg, #00ff88, #0099ff)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/* Lightning Bolt Icon */}
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                style={{
                  fontSize: '32px',
                  color: '#000',
                  fontWeight: 'bold'
                }}
              >
                ⚡
              </motion.div>
            </motion.div>

            {/* Orbiting Dots */}
            {[0, 120, 240].map((angle, index) => (
              <motion.div
                key={index}
                animate={{ rotate: -360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '100%',
                  height: '100%',
                  transform: `translate(-50%, -50%) rotate(${angle}deg)`
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '-6px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '12px',
                  height: '12px',
                  background: index === 0 ? '#00ff88' : index === 1 ? '#0099ff' : '#ff4757',
                  borderRadius: '50%',
                  boxShadow: `0 0 10px ${index === 0 ? '#00ff88' : index === 1 ? '#0099ff' : '#ff4757'}`
                }} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '300px', opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{
            marginTop: '60px',
            width: '300px',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '2px',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #00ff88, #0099ff)',
              borderRadius: '2px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Shimmer effect */}
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
              }}
            />
          </motion.div>
        </motion.div>

        {/* Progress Percentage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{
            marginTop: '20px',
            fontSize: '24px',
            fontWeight: '700',
            color: '#00ff88',
            fontFamily: 'monospace',
            textShadow: '0 0 10px rgba(0, 255, 136, 0.5)'
          }}
        >
          {progress}%
        </motion.div>

        {/* Loading Steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          style={{
            marginTop: '30px',
            textAlign: 'center',
            height: '60px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              style={{
                fontSize: '16px',
                color: '#8b949e',
                fontWeight: '500',
                letterSpacing: '0.5px'
              }}
            >
              {loadingSteps[currentStep]}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Brand Name */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          style={{
            position: 'absolute',
            bottom: '60px',
            fontSize: '28px',
            fontWeight: '800',
            background: 'linear-gradient(45deg, #00ff88, #0099ff)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            textShadow: '0 0 30px rgba(0, 255, 136, 0.3)'
          }}
        >
          ⚡ Risk Monitor Pro
        </motion.div>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes gridMove {
            0% { transform: translate(0, 0); }
            100% { transform: translate(50px, 50px); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
};

export default UltraLoadingScreen;
