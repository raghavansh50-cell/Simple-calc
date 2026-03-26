import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Delete, Divide, Equal, Minus, Plus, X, RotateCcw } from 'lucide-react';

export default function App() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isResult, setIsResult] = useState(false);

  const handleNumber = (num: string) => {
    if (isResult) {
      setDisplay(num);
      setIsResult(false);
    } else {
      setDisplay(prev => (prev === '0' ? num : prev + num));
    }
  };

  const handleOperator = (op: string) => {
    setIsResult(false);
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setIsResult(false);
  };

  const handleCalculate = () => {
    if (!equation) return;
    
    const fullEquation = equation + display;
    try {
      // Using Function constructor for a simple calculator is acceptable for this demo
      // but in a real app we'd use a proper math parser
      const result = new Function(`return ${fullEquation.replace('×', '*').replace('÷', '/')}`)();
      setDisplay(String(Number(result.toFixed(8))));
      setEquation('');
      setIsResult(true);
    } catch (error) {
      setDisplay('Error');
      setEquation('');
      setIsResult(true);
    }
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(prev => prev + '.');
    }
  };

  const handleBackspace = () => {
    if (isResult) {
      handleClear();
    } else {
      setDisplay(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'));
    }
  };

  const Button = ({ 
    children, 
    onClick, 
    className = "", 
    variant = "default" 
  }: { 
    children: React.ReactNode, 
    onClick: () => void, 
    className?: string,
    variant?: 'default' | 'operator' | 'action'
  }) => {
    const variants = {
      default: "bg-white/10 hover:bg-white/20 text-white",
      operator: "bg-orange-500 hover:bg-orange-600 text-white",
      action: "bg-gray-700 hover:bg-gray-600 text-white"
    };

    return (
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        onClick={onClick}
        className={`h-16 rounded-2xl text-xl font-medium transition-colors flex items-center justify-center ${variants[variant]} ${className}`}
      >
        {children}
      </motion.button>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xs bg-[#1a1a1a] rounded-[2.5rem] p-6 shadow-2xl border border-white/5"
      >
        {/* Display Section */}
        <div className="mb-8 px-2 text-right overflow-hidden">
          <div className="h-6 text-gray-500 text-sm font-mono mb-1 truncate">
            {equation}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={display}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-5xl font-light text-white truncate tracking-tighter"
            >
              {display}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-3">
          <Button variant="action" onClick={handleClear}><RotateCcw size={20} /></Button>
          <Button variant="action" onClick={handleBackspace}><Delete size={20} /></Button>
          <Button variant="action" onClick={() => handleOperator('%')}>%</Button>
          <Button variant="operator" onClick={() => handleOperator('/')}><Divide size={20} /></Button>

          <Button onClick={() => handleNumber('7')}>7</Button>
          <Button onClick={() => handleNumber('8')}>8</Button>
          <Button onClick={() => handleNumber('9')}>9</Button>
          <Button variant="operator" onClick={() => handleOperator('*')}><X size={20} /></Button>

          <Button onClick={() => handleNumber('4')}>4</Button>
          <Button onClick={() => handleNumber('5')}>5</Button>
          <Button onClick={() => handleNumber('6')}>6</Button>
          <Button variant="operator" onClick={() => handleOperator('-')}><Minus size={20} /></Button>

          <Button onClick={() => handleNumber('1')}>1</Button>
          <Button onClick={() => handleNumber('2')}>2</Button>
          <Button onClick={() => handleNumber('3')}>3</Button>
          <Button variant="operator" onClick={() => handleOperator('+')}><Plus size={20} /></Button>

          <Button onClick={() => handleNumber('0')} className="col-span-2">0</Button>
          <Button onClick={handleDecimal}>.</Button>
          <Button variant="operator" onClick={handleCalculate} className="bg-orange-500"><Equal size={24} /></Button>
        </div>
      </motion.div>
    </div>
  );
}
