import { useEffect, useRef } from "react";
import { BiX } from "react-icons/bi";

export default function Modal({ children, isOpen, onClose }: { isOpen: boolean; onClose: () => void; children: React.ReactElement }) {



    return (
        <>
            <div
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    const target = e.target as HTMLElement;
                    if (target.classList.contains('modal-container')) {
                        onClose && (onClose())
                    }
                }}
                className={`modal-container w-full h-screen fixed bg-black/40 flex items-center justify-center !z-50 backdrop-blur-sm transition-all ease-linear invisible opacity-0 
                ${isOpen && ('!visible !opacity-100')}`}>
                {children}
            </div>
        </>
    )
}