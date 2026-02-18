import { Box } from '@mui/material';
import { motion } from 'framer-motion';

const Logo = ({ size = 40, animated = false }) => {
  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const Component = animated ? motion.svg : 'svg';

  return (
    <Component
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      variants={animated ? logoVariants : undefined}
      initial={animated ? "hidden" : undefined}
      animate={animated ? "visible" : undefined}
    >
      {/* Outer circle with gradient */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* House shape - modern minimal */}
      <g filter="url(#glow)">
        {/* Roof */}
        <path
          d="M 50 20 L 75 40 L 75 35 L 50 15 L 25 35 L 25 40 Z"
          fill="url(#logoGradient)"
        />
        
        {/* House body */}
        <rect
          x="30"
          y="40"
          width="40"
          height="35"
          rx="2"
          fill="url(#logoGradient)"
          opacity="0.9"
        />
        
        {/* Door */}
        <rect
          x="43"
          y="55"
          width="14"
          height="20"
          rx="1"
          fill="#FFFFFF"
          opacity="0.3"
        />

        {/* Window left */}
        <rect
          x="35"
          y="47"
          width="8"
          height="8"
          rx="1"
          fill="#FFFFFF"
          opacity="0.3"
        />

        {/* Window right */}
        <rect
          x="57"
          y="47"
          width="8"
          height="8"
          rx="1"
          fill="#FFFFFF"
          opacity="0.3"
        />

        {/* Accent dot - representing "Pro" */}
        <circle
          cx="75"
          cy="30"
          r="4"
          fill="#8B5CF6"
        />
      </g>
    </Component>
  );
};

export default Logo;