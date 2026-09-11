import type { DemoView } from '../demo-types';

interface PresentationToolbarProps {
  view: DemoView;
  onNavigate: (view: DemoView) => void;
  onReset: () => void;
}

export function PresentationToolbar({ view, onNavigate, onReset }: PresentationToolbarProps) {
  return (
    <header className="presentation-toolbar">
      <button className="demo-brand" type="button" onClick={() => onNavigate('home')} aria-label="Kenny Mentor home">
        <span className="demo-brand__mark">KM</span>
        <span>Kenny Mentor <small>Interactive MVP</small></span>
      </button>
      <nav aria-label="Presentation controls">
        {(['home', 'mentee', 'mentor'] as const).map((item) => (
          <button key={item} type="button" className={view === item ? 'toolbar-link active' : 'toolbar-link'} onClick={() => onNavigate(item)} aria-current={view === item ? 'page' : undefined}>
            {item === 'home' ? 'Home' : `${item[0].toUpperCase()}${item.slice(1)} View`}
          </button>
        ))}
        <button className="toolbar-reset" type="button" onClick={onReset}>Reset Demo</button>
      </nav>
    </header>
  );
}
