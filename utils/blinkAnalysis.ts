import { CONFIG } from '../constants';
import { BlinkStats, BlinkEvent } from '../types';

/**
 * Port of the Python `analyze_blinks` function.
 * 
 * @param data - Normalized eyelid area data array (0.0 to 1.0)
 */
export const analyzeBlinks = (data: number[]): BlinkStats => {
  const { DROP_WINDOW, DROP_THRESHOLD, BLINK_END_THRESHOLD, COMPLETE_BLINK_THRESHOLD } = CONFIG;

  let complete_blinks = 0;
  let incomplete_blinks = 0;
  let is_in_blink = false;
  let min_value_in_blink = 1.0;
  let min_index_in_blink = -1;
  const blink_events: BlinkEvent[] = [];

  if (data.length < DROP_WINDOW) {
    return { complete_blinks: 0, incomplete_blinks: 0, blink_events: [] };
  }

  for (let i = DROP_WINDOW; i < data.length; i++) {
    const current_value = data[i];
    const previous_value = data[i - DROP_WINDOW];
    const drop_amount = previous_value - current_value;

    if (!is_in_blink && drop_amount > DROP_THRESHOLD && previous_value > BLINK_END_THRESHOLD) {
      is_in_blink = true;
      min_value_in_blink = current_value;
      min_index_in_blink = i;
    } else if (is_in_blink) {
      if (current_value < min_value_in_blink) {
        min_value_in_blink = current_value;
        min_index_in_blink = i;
      }

      if (current_value > BLINK_END_THRESHOLD) {
        is_in_blink = false;
        
        const isComplete = min_value_in_blink < COMPLETE_BLINK_THRESHOLD;
        
        blink_events.push({
          value: min_value_in_blink,
          index: min_index_in_blink,
          type: isComplete ? 'complete' : 'incomplete'
        });

        if (isComplete) {
          complete_blinks += 1;
        } else {
          incomplete_blinks += 1;
        }
        
        // Reset for next blink
        min_value_in_blink = 1.0;
      }
    }
  }

  return {
    complete_blinks,
    incomplete_blinks,
    blink_events
  };
};

/**
 * Helper to calculate basic stats similar to numpy logic in Python
 */
export const calculateStats = (data: number[], blinkEvents: BlinkEvent[]) => {
  const normalizedOverallAvg = data.reduce((a, b) => a + b, 0) / data.length;
  
  const blinkValues = blinkEvents.map(e => e.value);
  const normalizedBlinkMinAvg = blinkValues.length > 0 
    ? blinkValues.reduce((a, b) => a + b, 0) / blinkValues.length 
    : 0;

  return {
    normalizedOverallAvg,
    normalizedBlinkMinAvg
  };
};