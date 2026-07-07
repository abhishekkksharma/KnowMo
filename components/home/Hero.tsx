"use client";

import ThemeCards from "../ui/NoteCards"
import CustomText from "../ui/CustomText"
import { motion, Variants } from "framer-motion"

function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  const glowVariants: Variants = {
    initial: { scale: 0.8, opacity: 0.3 },
    animate: {
      scale: [0.8, 1.1, 0.8],
      opacity: [0.3, 0.6, 0.3],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="pt-30 bg-transparent overflow-hidden flex items-center justify-center transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
        
        {/* Responsive Grid: Stacks on mobile, side-by-side on large screens */}
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between lg:gap-24">
          
          {/* Left Column: Text & Call to Actions */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 z-10"
          >
            <div className="space-y-6">
              {/* Added responsive sizing, tighter tracking, and proper dark mode text colors */}
              <motion.div variants={itemVariants}>
                <CustomText 
                  text="Welcome to KnowMo" 
                  size="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white" 
                  className="font-semibold tracking-wide font-mono"
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-xl leading-relaxed">
                  Start your learning journey now. Master new concepts, track your progress, and build your future.
                </p>
              </motion.div>
            </div>
            
            {/* Action Buttons */}
            {/* <div className="flex flex-col sm:flex-row gap-4 w-full justify-center lg:justify-start">
              <button className="px-8 py-3.5 text-sm font-semibold text-white bg-gray-900 dark:bg-white dark:text-black rounded-full hover:scale-105 transition-transform duration-300 shadow-lg">
                Get Started
              </button>
              <button className="px-8 py-3.5 text-sm font-semibold text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors duration-300">
                Learn More
              </button>
            </div> */}
          </motion.div>

          {/* Right Column: Theme Cards */}
          <div className="flex-1 w-full flex justify-center lg:justify-end relative">
            {/* Decorative ambient glow behind the cards to make them pop */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 z-0 pointer-events-none">
              <motion.div 
                variants={glowVariants}
                initial="initial"
                animate="animate"
                className="w-full h-full bg-pink-400/20 dark:bg-gray-400/10 rounded-full blur-[60px]"
              />
            </div>
            
            <div className="relative z-10">
              <ThemeCards />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Hero