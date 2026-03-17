import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Cursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleMouseDown = () => setIsActive(true);
    const handleMouseUp = () => setIsActive(false);

    // Track hoverable elements
    const handleMouseOver = (e) => {
      const target = e.target;
      const isClickable = 
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.card') ||
        target.closest('.nav-item') ||
        target.closest('.mood-option') ||
        target.closest('.tag') ||
        window.getComputedStyle(target).cursor === 'pointer';
        
      if (isClickable) {
        setIsHovering(true);
        document.body.classList.add('cursor-hover');
      } else {
        setIsHovering(false);
        document.body.classList.remove('cursor-hover');
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.body.classList.remove('cursor-hover');
      document.body.classList.remove('cursor-active');
    };
  }, [isVisible]);

  useEffect(() => {
    if (isActive) {
      document.body.classList.add('cursor-active');
    } else {
      document.body.classList.remove('cursor-active');
    }
  }, [isActive]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="cursor-dot"
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
        scale: isActive ? 0.6 : isHovering ? 1.4 : 1
      }}
      transition={{ type: "spring", stiffness: 800, damping: 35 }}
    />
  );
}
