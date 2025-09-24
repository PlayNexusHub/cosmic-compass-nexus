import { motion } from 'framer-motion';
import satelliteIcon from '../assets/satellite-icon.png';

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-space flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 1 
          }}
          className="mb-8"
        >
          <img 
            src={satelliteIcon} 
            alt="SatellitePro" 
            className="w-24 h-24 mx-auto animate-float glow-intense"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="space-y-4"
        >
          <h1 className="text-4xl font-bold text-glow text-primary">
            SatellitePro
          </h1>
          <p className="text-xl text-foreground/80">
            Powered by <span className="text-primary font-semibold">PlayNexus</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Advanced Satellite Analytics Platform
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-12"
        >
          <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="animate-spin w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full"></div>
            <span>Initializing satellite analytics platform...</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="mt-8 flex justify-center space-x-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-2 h-2 bg-primary rounded-full"
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};