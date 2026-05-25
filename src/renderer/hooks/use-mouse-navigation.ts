import isElectron from 'is-electron';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const TAGS_TO_IGNORE = ['input', 'textarea', 'select', 'option'];

export const useMouseNavigation = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!isElectron()) return;

        const handleMouseUp = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            if (
                target?.closest(TAGS_TO_IGNORE.join(',')) ||
                (target instanceof HTMLElement && target.isContentEditable)
            ) {
                return;
            }

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

        document.addEventListener('mouseup', handleMouseUp, false);

        return () => {
            document.removeEventListener('mouseup', handleMouseUp, false);
        };
    }, [navigate]);
};
