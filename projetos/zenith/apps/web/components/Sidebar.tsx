export function Sidebar() {
  const menuItems = ['Dashboard', 'Metas', 'Relatório'];

  return (
    <aside className="fixed right-0 top-16 bottom-12 w-16 bg-surface-1 border-l border-[var(--color-surface-2)] flex flex-col items-center py-8 z-40">
      {menuItems.map((item) => (
        <div
          key={item}
          className="flex-1 flex items-center justify-center"
        >
          <span
            className="font-mono text-xs text-dim hover:text-primary cursor-pointer transition-colors"
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              transform: 'rotate(180deg)',
            }}
          >
            {item.toUpperCase()}
          </span>
        </div>
      ))}
    </aside>
  );
}
