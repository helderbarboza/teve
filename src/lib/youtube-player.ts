/**
 * YouTube Player Embed Parameters
 * Reference: https://developers.google.com/youtube/player_parameters
 */
export interface YouTubePlayerParameters {
  /** Autoplay on load: 0 (default) or 1 */
  autoplay?: 0 | 1

  /** Default caption language (ISO 639-1 code, e.g. "en", "fr") */
  cc_lang_pref?: string

  /** Show captions by default: 1 to show */
  cc_load_policy?: 1

  /** Progress bar color: "red" (default) or "white" */
  color?: 'red' | 'white'

  /** Show player controls: 0 or 1 (default) */
  controls?: 0 | 1

  /** Disable keyboard controls: 1 to disable */
  disablekb?: 0 | 1

  /** Enable JS API interface: 1 to enable */
  enablejsapi?: 0 | 1

  /** Stop time in seconds (positive integer) */
  end?: number

  /** Show fullscreen button: 0 to hide, 1 (default) to show */
  fs?: 0 | 1

  /** Player interface language (ISO 639-1 or locale code) */
  hl?: string

  /** Show video annotations: 1 (default) or 3 (hide by default) */
  iv_load_policy?: 1 | 3

  /**
   * Identifies the content to load.
   * Depending on `listType`, this can be:
   * - Channel ID (for `user_uploads`)
   * - Playlist ID (for `playlist`, must start with "PL")
   * - Search query (deprecated for `search`)
   */
  list?: string

  /** Type of list: "playlist" or "user_uploads" */
  listType?: 'playlist' | 'user_uploads'

  /** Loop video or playlist: 0 (default) or 1 */
  loop?: 0 | 1

  /**
   * Deprecated: Has no effect
   * @deprecated
   */
  modestbranding?: any

  /** The origin domain (required if enablejsapi=1) */
  origin?: string

  /** Comma-separated list of video IDs to play after the initial one */
  playlist?: string

  /**
   * Inline playback on iOS:
   * - 0 = fullscreen (default)
   * - 1 = inline
   */
  playsinline?: 0 | 1

  /**
   * Show related videos:
   * - 1 = show (default)
   * - 0 = show from same channel (after Sep 25, 2018)
   */
  rel?: 0 | 1

  /** Start time in seconds (positive integer) */
  start?: number

  /** Referrer URL for analytics in widget scenarios */
  widget_referrer?: string
}

/**
 * Converts a YouTubePlayerParameters object into a URLSearchParams string.
 * Skips undefined/null values.
 */
export function toYouTubeSearchParams(params: YouTubePlayerParameters): string {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value))
    }
  }

  return searchParams.toString()
}
