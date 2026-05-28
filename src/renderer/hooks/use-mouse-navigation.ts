import isElectron from 'is-electron';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const INPUT_SELECTOR = 'input, textarea, select, option';

const isEditable = (target: HTMLElement | null) =>
    target?.closest(INPUT_SELECTOR) || (target instanceof HTMLElement && target.isContentEditable);

export const useMouseNavigation = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!isElectron()) return;

        const handleMouseUp = (e: MouseEvent) => {
            if (isEditable(e.target as HTMLElement)) return;

            if (e.button === 3) {
                e.preventDefault();
                e.stopPropagation();
                navigate(-1);
            } else if (e.button === 4) {
                e.preventDefault();
                e.stopPropagation();
                navigate(1);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (isEditable(e.target as HTMLElement)) return;

            const isCmd = e.metaKey || e.ctrlKey;

            if (isCmd && e.key === '[') {
                e.preventDefault();
                navigate(-1);
            } else if (isCmd && e.key === ']') {
                e.preventDefault();
                navigate(1);
            }
        };

        document.addEventListener('mouseup', handleMouseUp, false);
        document.addEventListener('keydown', handleKeyDown, false);

        return () => {
            document.removeEventListener('mouseup', handleMouseUp, false);
            document.removeEventListener('keydown', handleKeyDown, false);
        };
    }, [navigate]);
};
