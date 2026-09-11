import { useEffect, useRef, type ReactNode } from 'react';

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  actions?: ReactNode;
}

export function Modal({ title, children, onClose, actions }: ModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab') {
        const controls = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button, input, textarea, select, a[href], [tabindex]:not([tabindex="-1"])') ?? []);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div className="demo-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={dialogRef} className="demo-modal" role="dialog" aria-modal="true" aria-labelledby="demo-modal-title">
        <div className="demo-modal__header">
          <h2 id="demo-modal-title">{title}</h2>
          <button ref={closeButtonRef} className="icon-button" type="button" onClick={onClose} aria-label="Close dialog">×</button>
        </div>
        <div>{children}</div>
        {actions && <div className="demo-modal__actions">{actions}</div>}
      </section>
    </div>
  );
}
