import { useEffect, useRef } from 'react';
import useScript from './useScript';
import classNames from 'classnames';

interface GradientProps {
    colors: string[];
}

const GradientCanvas: React.FC<GradientProps> = ({ colors }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const scriptLoaded = useScript('https://hight-colors.vercel.app/gradient.js');

    useEffect(() => {
        console.log("🚀 ~ useEffect ~ scriptLoaded:", scriptLoaded)
        if (scriptLoaded && (window as any).Gradient) {
            const canvas = canvasRef.current;
            if (canvas) {
                new (window as any).Gradient({
                    canvas: '#my-canvas-id',
                    colors: colors,
                });
            }
        }
    }, [scriptLoaded, colors]);

    return <div className={classNames(
        'relative h-[400px] w-[400px] transition-all duration-300 ease-in-out mx-auto',
        scriptLoaded ? "" : 'blur-lg opacity-0'
    )}>
        <canvas ref={canvasRef} id="my-canvas-id" className="w-full h-full absolute z-0"></canvas>
        <svg className=' z-30 absolute h-full w-full' width="400" height="400" viewBox="0 0 2500 2500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M1248 651L688 1210L855.5 1375.5L1129.5 1100.5L1129.68 1850H1372.5V1100.5L1648 1375.5L1812 1210L1253 651H1248Z"
                fill={"black"}
            />
        </svg>
    </div>;
};

export default GradientCanvas;
