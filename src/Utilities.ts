/**
 * Formats a time value in seconds into a string in "mm:ss" format with leading zeros.
 *
 * @param time - The time in seconds to format.
 * @returns A string representing the formatted time in "mm:ss" format.
 *
 * @remarks
 * - Both minutes and seconds are zero-padded to two digits (e.g., "02:05" for 125 seconds).
 */
export function formatTime(time: number) {
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  const minsStr = mins.toString().padStart(2, "0");
  const secsStr = secs.toString().padStart(2, "0");
  return `${minsStr}:${secsStr}`;
}
