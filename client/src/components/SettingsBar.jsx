import React from 'react';
import toolState from 'store/toolState';
import '../styles/settingsbar.scss';

const SettingsBar = () => {
  return (
    <div className='settings-bar'>
      <label htmlFor='line-width'>Тольщина линии</label>
      <input
        id='line-width'
        defaultValue={1}
        type='number'
        min={1}
        max={20}
        onChange={(e) => toolState.setLineWidth(e.target.value)}
      />
      <label htmlFor='stroke-color'>Цвет обводки</label>
      <input
        id='stroke-color'
        type='color'
        onChange={(e) => toolState.setStrokeColor(e.target.value)}
      />
    </div>
  );
};

export default SettingsBar;
