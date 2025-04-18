import { ButtonGroup, ToggleButton } from 'react-bootstrap';
import { EditorMode } from '../../types';

interface EditorModeSelectorProps {
  mode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
  disabled?: boolean;
}

const EditorModeSelector: React.FC<EditorModeSelectorProps> = ({ 
  mode, 
  onModeChange, 
  disabled = false 
}) => {
  const modes: { name: string; value: EditorMode }[] = [
    { name: 'Simple Mode', value: 'simple' },
    { name: 'Advanced Mode', value: 'advanced' },
  ];

  return (
    <div className="mode-selector mb-4">
      <p className="mb-2">Select editing mode:</p>
      <ButtonGroup>
        {modes.map((modeOption) => (
          <ToggleButton
            key={modeOption.value}
            id={`mode-${modeOption.value}`}
            type="radio"
            variant={modeOption.value === mode ? 'primary' : 'outline-primary'}
            name="mode"
            value={modeOption.value}
            checked={mode === modeOption.value}
            onChange={() => onModeChange(modeOption.value)}
            disabled={disabled}
          >
            {modeOption.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
      <div className="mt-2 text-muted small">
        {mode === 'simple' ? (
          'Simple mode allows editing only custom fields while maintaining the required structure.'
        ) : (
          'Advanced mode gives you full control over all fields in the YAML file.'
        )}
      </div>
    </div>
  );
};

export default EditorModeSelector;
