import { classes } from 'core/js/reactHelpers';
import React from 'react';

export default function GraphicLottie(props) {
  const {
    _src,
    alt,
    isAnimation,
    isPaused,
    _showPauseControl,
    showControls
  } = props;
  return (
    <div
      aria-hidden={alt ? true : null}
      className={classes([
        'graphiclottie__player',
        isPaused ? 'is-paused' : 'is-playing',
        (!showControls) && 'is-hidecontrols'
      ])}
    >
      {isAnimation && <>
        <div
          className="graphiclottie__animation-container"
          role="img"
          aria-label={alt || null}>
        </div>
        {_showPauseControl &&
        <div className="graphiclottie__controls">
          <button
            className="graphiclottie__playpause icon"
            type="button"
            aria-label="Pause">
            <span aria-hidden="true" className="icon"></span>
          </button>
        </div>
        }
      </>}
      {!isAnimation &&
        <img
          src={_src}
          aria-label={alt || null}
        />
      }
    </div>
  );
}
