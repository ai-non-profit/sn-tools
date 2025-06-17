export interface YTResponse {
  responseContext: ResponseContext
  playabilityStatus: PlayabilityStatus
  streamingData: StreamingData
  playbackTracking: PlaybackTracking
  captions: Captions
  videoDetails: VideoDetails
  playerConfig: PlayerConfig
  storyboards: Storyboards
  trackingParams: string
  attestation: Attestation
  adBreakHeartbeatParams: string
}

export interface ResponseContext {
  visitorData: string
  serviceTrackingParams: ServiceTrackingParam[]
  maxAgeSeconds: number
}

export interface ServiceTrackingParam {
  service: string
  params: Param[]
}

export interface Param {
  key: string
  value: string
}

export interface PlayabilityStatus {
  status: string
  playableInEmbed: boolean
  offlineability: Offlineability
  miniplayer: Miniplayer
  contextParams: string
}

export interface Offlineability {
  offlineabilityRenderer: OfflineabilityRenderer
}

export interface OfflineabilityRenderer {
  offlineable: boolean
  formats: Format[]
  clickTrackingParams: string
  offlineabilityRendererSupportedConfigs: OfflineabilityRendererSupportedConfigs
}

export interface Format {
  name: Name
  formatType: string
}

export interface Name {
  runs: Run[]
}

export interface Run {
  text: string
}

export interface OfflineabilityRendererSupportedConfigs {
  offlineStreamSelectionConfig: OfflineStreamSelectionConfig
}

export interface OfflineStreamSelectionConfig {
  enablePrefetchPlayerResponse: boolean
}

export interface Miniplayer {
  miniplayerRenderer: MiniplayerRenderer
}

export interface MiniplayerRenderer {
  playbackMode: string
}

export interface StreamingData {
  expiresInSeconds: string
  formats: Format2[]
  adaptiveFormats: AdaptiveFormat[]
  serverAbrStreamingUrl: string
}

export interface Format2 {
  itag: number
  url: string
  mimeType: string
  bitrate: number
  width: number
  height: number
  lastModified: string
  contentLength: string
  quality: string
  fps: number
  qualityLabel: string
  projectionType: string
  averageBitrate: number
  audioQuality: string
  approxDurationMs: string
  audioSampleRate: string
  audioChannels: number
  qualityOrdinal: string
}

export interface AdaptiveFormat {
  itag: number
  url: string
  mimeType: string
  bitrate: number
  width?: number
  height?: number
  initRange: InitRange
  indexRange: IndexRange
  lastModified: string
  contentLength: string
  quality: string
  fps?: number
  qualityLabel?: string
  projectionType: string
  averageBitrate: number
  approxDurationMs: string
  qualityOrdinal: string
  colorInfo?: ColorInfo
  highReplication?: boolean
  audioQuality?: string
  audioSampleRate?: string
  audioChannels?: number
  loudnessDb?: number
}

export interface InitRange {
  start: string
  end: string
}

export interface IndexRange {
  start: string
  end: string
}

export interface ColorInfo {
  primaries: string
  transferCharacteristics: string
  matrixCoefficients: string
}

export interface PlaybackTracking {
  videostatsPlaybackUrl: VideostatsPlaybackUrl
  videostatsDelayplayUrl: VideostatsDelayplayUrl
  videostatsWatchtimeUrl: VideostatsWatchtimeUrl
  ptrackingUrl: PtrackingUrl
  qoeUrl: QoeUrl
  atrUrl: AtrUrl
  videostatsScheduledFlushWalltimeSeconds: number[]
  videostatsDefaultFlushIntervalSeconds: number
}

export interface VideostatsPlaybackUrl {
  baseUrl: string
  headers: Header[]
}

export interface Header {
  headerType: string
}

export interface VideostatsDelayplayUrl {
  baseUrl: string
  headers: Header2[]
}

export interface Header2 {
  headerType: string
}

export interface VideostatsWatchtimeUrl {
  baseUrl: string
  headers: Header3[]
}

export interface Header3 {
  headerType: string
}

export interface PtrackingUrl {
  baseUrl: string
  headers: Header4[]
}

export interface Header4 {
  headerType: string
}

export interface QoeUrl {
  baseUrl: string
  headers: Header5[]
}

export interface Header5 {
  headerType: string
}

export interface AtrUrl {
  baseUrl: string
  elapsedMediaTimeSeconds: number
  headers: Header6[]
}

export interface Header6 {
  headerType: string
}

export interface Captions {
  playerCaptionsTracklistRenderer: PlayerCaptionsTracklistRenderer
}

export interface PlayerCaptionsTracklistRenderer {
  captionTracks: CaptionTrack[]
  audioTracks: AudioTrack[]
  defaultAudioTrackIndex: number
}

export interface CaptionTrack {
  baseUrl: string
  name: Name2
  vssId: string
  languageCode: string
  kind: string
  isTranslatable: boolean
  trackName: string
}

export interface Name2 {
  runs: Run2[]
}

export interface Run2 {
  text: string
}

export interface AudioTrack {
  captionTrackIndices: number[]
}

export interface VideoDetails {
  videoId: string
  title: string
  lengthSeconds: string
  channelId: string
  isOwnerViewing: boolean
  shortDescription: string
  isCrawlable: boolean
  thumbnail: Thumbnail
  allowRatings: boolean
  viewCount: string
  author: string
  isPrivate: boolean
  isUnpluggedCorpus: boolean
  isLiveContent: boolean
}

export interface Thumbnail {
  thumbnails: Thumbnail2[]
}

export interface Thumbnail2 {
  url: string
  width: number
  height: number
}

export interface PlayerConfig {
  audioConfig: AudioConfig
  exoPlayerConfig: ExoPlayerConfig
  networkProtocolConfig: NetworkProtocolConfig
  androidNetworkStackConfig: AndroidNetworkStackConfig
  androidMedialibConfig: AndroidMedialibConfig
  variableSpeedConfig: VariableSpeedConfig
  decodeQualityConfig: DecodeQualityConfig
  vrConfig: VrConfig
  androidPlayerStatsConfig: AndroidPlayerStatsConfig
  retryConfig: RetryConfig
  cmsPathProbeConfig: CmsPathProbeConfig
  mediaCommonConfig: MediaCommonConfig
  taskCoordinatorConfig: TaskCoordinatorConfig
}

export interface AudioConfig {
  loudnessDb: number
  perceptualLoudnessDb: number
  enablePerFormatLoudness: boolean
}

export interface ExoPlayerConfig {
  useExoPlayer: boolean
  useAdaptiveBitrate: boolean
  maxInitialByteRate: number
  minDurationForQualityIncreaseMs: number
  maxDurationForQualityDecreaseMs: number
  minDurationToRetainAfterDiscardMs: number
  lowWatermarkMs: number
  highWatermarkMs: number
  lowPoolLoad: number
  highPoolLoad: number
  sufficientBandwidthOverhead: number
  bufferChunkSizeKb: number
  httpConnectTimeoutMs: number
  httpReadTimeoutMs: number
  numAudioSegmentsPerFetch: number
  numVideoSegmentsPerFetch: number
  minDurationForPlaybackStartMs: number
  enableExoplayerReuse: boolean
  useRadioTypeForInitialQualitySelection: boolean
  blacklistFormatOnError: boolean
  enableBandaidHttpDataSource: boolean
  httpLoadTimeoutMs: number
  canPlayHdDrm: boolean
  videoBufferSegmentCount: number
  audioBufferSegmentCount: number
  useAbruptSplicing: boolean
  minRetryCount: number
  minChunksNeededToPreferOffline: number
  secondsToMaxAggressiveness: number
  enableSurfaceviewResizeWorkaround: boolean
  enableVp9IfThresholdsPass: boolean
  matchQualityToViewportOnUnfullscreen: boolean
  lowAudioQualityConnTypes: string[]
  useDashForLiveStreams: boolean
  enableLibvpxVideoTrackRenderer: boolean
  lowAudioQualityBandwidthThresholdBps: number
  enableVariableSpeedPlayback: boolean
  preferOnesieBufferedFormat: boolean
  minimumBandwidthSampleBytes: number
  useDashForOtfAndCompletedLiveStreams: boolean
  disableCacheAwareVideoFormatEvaluation: boolean
  useLiveDvrForDashLiveStreams: boolean
  cronetResetTimeoutOnRedirects: boolean
  emitVideoDecoderChangeEvents: boolean
  onesieVideoBufferLoadTimeoutMs: string
  onesieVideoBufferReadTimeoutMs: string
  libvpxEnableGl: boolean
  enableVp9EncryptedIfThresholdsPass: boolean
  enableOpus: boolean
  usePredictedBuffer: boolean
  maxReadAheadMediaTimeMs: number
  useMediaTimeCappedLoadControl: boolean
  allowCacheOverrideToLowerQualitiesWithinRange: number
  allowDroppingUndecodedFrames: boolean
  minDurationForPlaybackRestartMs: number
  serverProvidedBandwidthHeader: string
  liveOnlyPegStrategy: string
  enableRedirectorHostFallback: boolean
  enableHighlyAvailableFormatFallbackOnPcr: boolean
  recordTrackRendererTimingEvents: boolean
  minErrorsForRedirectorHostFallback: number
  nonHardwareMediaCodecNames: string[]
  enableVp9IfInHardware: boolean
  enableVp9EncryptedIfInHardware: boolean
  useOpusMedAsLowQualityAudio: boolean
  minErrorsForPcrFallback: number
  useStickyRedirectHttpDataSource: boolean
  onlyVideoBandwidth: boolean
  useRedirectorOnNetworkChange: boolean
  enableMaxReadaheadAbrThreshold: boolean
  cacheCheckDirectoryWritabilityOnce: boolean
  predictorType: string
  slidingPercentile: number
  slidingWindowSize: number
  maxFrameDropIntervalMs: number
  ignoreLoadTimeoutForFallback: boolean
  serverBweMultiplier: number
  drmMaxKeyfetchDelayMs: number
  maxResolutionForWhiteNoise: number
  whiteNoiseRenderEffectMode: string
  enableLibvpxHdr: boolean
  enableCacheAwareStreamSelection: boolean
  useExoCronetDataSource: boolean
  whiteNoiseScale: number
  whiteNoiseOffset: number
  preventVideoFrameLaggingWithLibvpx: boolean
  enableMediaCodecHdr: boolean
  enableMediaCodecSwHdr: boolean
  liveOnlyWindowChunks: number
  bearerMinDurationToRetainAfterDiscardMs: number[]
  forceWidevineL3: boolean
  useAverageBitrate: boolean
  useMedialibAudioTrackRendererForLive: boolean
  useExoPlayerV2: boolean
  logMediaRequestEventsToCsi: boolean
  onesieFixNonZeroStartTimeFormatSelection: boolean
  liveOnlyReadaheadStepSizeChunks: number
  liveOnlyBufferHealthHalfLifeSeconds: number
  liveOnlyMinBufferHealthRatio: number
  liveOnlyMinLatencyToSeekRatio: number
  manifestlessPartialChunkStrategy: string
  ignoreViewportSizeWhenSticky: boolean
  enableLibvpxFallback: boolean
  disableLibvpxLoopFilter: boolean
  enableVpxMediaView: boolean
  hdrMinScreenBrightness: number
  hdrMaxScreenBrightnessThreshold: number
  onesieDataSourceAboveCacheDataSource: boolean
  httpNonplayerLoadTimeoutMs: number
  numVideoSegmentsPerFetchStrategy: string
  maxVideoDurationPerFetchMs: number
  maxVideoEstimatedLoadDurationMs: number
  estimatedServerClockHalfLife: number
  estimatedServerClockStrictOffset: boolean
  minReadAheadMediaTimeMs: number
  readAheadGrowthRate: number
  useDynamicReadAhead: boolean
  useYtVodMediaSourceForV2: boolean
  enableV2Gapless: boolean
  useLiveHeadTimeMillis: boolean
  allowTrackSelectionWithUpdatedVideoItagsForExoV2: boolean
  maxAllowableTimeBeforeMediaTimeUpdateSec: number
  enableDynamicHdr: boolean
  v2PerformEarlyStreamSelection: boolean
  v2UsePlaybackStreamSelectionResult: boolean
  v2MinTimeBetweenAbrReevaluationMs: number
  avoidReusePlaybackAcrossLoadvideos: boolean
  enableInfiniteNetworkLoadingRetries: boolean
  reportExoPlayerStateOnTransition: boolean
  manifestlessSequenceMethod: string
  useLiveHeadWindow: boolean
  enableDynamicHdrInHardware: boolean
  ultralowAudioQualityBandwidthThresholdBps: number
  retryLiveNetNocontentWithDelay: boolean
  ignoreUnneededSeeksToLiveHead: boolean
  drmMetricsQoeLoggingFraction: number
  liveNetNocontentMaximumErrors: number
  slidingPercentileScalar: number
  minAdaptiveVideoQuality: number
  retryLiveEmptyChunkWithDelay: boolean
  platypusBackBufferDurationMs: number
}

export interface NetworkProtocolConfig {
  useQuic: boolean
}

export interface AndroidNetworkStackConfig {
  networkStack: string
  androidMetadataNetworkConfig: AndroidMetadataNetworkConfig
}

export interface AndroidMetadataNetworkConfig {
  coalesceRequests: boolean
}

export interface AndroidMedialibConfig {
  isItag18MainProfile: boolean
  surfaceUnavailableIsFatal: boolean
  surfaceCreateTimeoutMs: number
  viewportSizeFraction: number
}

export interface VariableSpeedConfig {
  availablePlaybackSpeeds: AvailablePlaybackSpeed[]
  androidVariableSpeedTimeoutSecs: number
  enableVariableSpeedOnOtf: boolean
}

export interface AvailablePlaybackSpeed {
  label: Label
  value: number
}

export interface Label {
  runs: Run3[]
}

export interface Run3 {
  text: string
}

export interface DecodeQualityConfig {
  maximumVideoDecodeVerticalResolution: number
}

export interface VrConfig {
  allowVr: boolean
  allowSubtitles: boolean
  showHqButton: boolean
  sphericalDirectionLoggingEnabled: boolean
  enableAndroidVr180MagicWindow: boolean
}

export interface AndroidPlayerStatsConfig {
  usePblForAttestationReporting: boolean
  usePblForHeartbeatReporting: boolean
  usePblForPlaybacktrackingReporting: boolean
  usePblForQoeReporting: boolean
  changeCpnOnFatalPlaybackError: boolean
}

export interface RetryConfig {
  retryEligibleErrors: string[]
  retryUnderSameConditionAttempts: number
  retryWithNewSurfaceAttempts: number
  progressiveFallbackOnNonNetworkErrors: boolean
  l3FallbackOnDrmErrors: boolean
  retryAfterCacheRemoval: boolean
  widevineL3EnforcedFallbackOnDrmErrors: boolean
  exoProxyableFormatFallback: boolean
  maxPlayerRetriesWhenNetworkUnavailable: number
  suppressFatalErrorAfterStop: boolean
  fallbackToSwDecoderOnFormatDecodeError: boolean
}

export interface CmsPathProbeConfig {
  cmsPathProbeDelayMs: number
}

export interface MediaCommonConfig {
  dynamicReadaheadConfig: DynamicReadaheadConfig
  mediaUstreamerRequestConfig: MediaUstreamerRequestConfig
  predictedReadaheadConfig: PredictedReadaheadConfig
  mediaFetchRetryConfig: MediaFetchRetryConfig
  mediaFetchMaximumServerErrors: number
  mediaFetchMaximumNetworkErrors: number
  mediaFetchMaximumErrors: number
  serverReadaheadConfig: ServerReadaheadConfig
  useServerDrivenAbr: boolean
  sabrClientConfig: SabrClientConfig
  serverPlaybackStartConfig: ServerPlaybackStartConfig
  usePlatypus: boolean
  bandwidthEstimationConfig: BandwidthEstimationConfig
  fixLivePlaybackModelDefaultPosition: boolean
}

export interface DynamicReadaheadConfig {
  maxReadAheadMediaTimeMs: number
  minReadAheadMediaTimeMs: number
  readAheadGrowthRateMs: number
  readAheadWatermarkMarginRatio: number
  minReadAheadWatermarkMarginMs: number
  maxReadAheadWatermarkMarginMs: number
  shouldIncorporateNetworkActiveState: boolean
}

export interface MediaUstreamerRequestConfig {
  enableVideoPlaybackRequest: boolean
  videoPlaybackUstreamerConfig: string
  videoPlaybackPostEmptyBody: boolean
  isVideoPlaybackRequestIdempotent: boolean
}

export interface PredictedReadaheadConfig {
  minReadaheadMs: number
  maxReadaheadMs: number
}

export interface MediaFetchRetryConfig {
  initialDelayMs: number
  backoffFactor: number
  maximumDelayMs: number
  jitterFactor: number
}

export interface ServerReadaheadConfig {
  nextRequestPolicy: NextRequestPolicy
}

export interface NextRequestPolicy {
  targetAudioReadaheadMs: number
  targetVideoReadaheadMs: number
}

export interface SabrClientConfig {
  defaultBackOffTimeMs: number
  enableHostFallback: boolean
  primaryProbingDelayMs: number
  maxFailureAttemptsBeforeFallback: number
  enableServerInitiatedHostFallback: boolean
}

export interface ServerPlaybackStartConfig {
  enable: boolean
  playbackStartPolicy: PlaybackStartPolicy
}

export interface PlaybackStartPolicy {
  startMinReadaheadPolicy: StartMinReadaheadPolicy[]
}

export interface StartMinReadaheadPolicy {
  minReadaheadMs: number
}

export interface BandwidthEstimationConfig {
  nearestRankConfig: NearestRankConfig
}

export interface NearestRankConfig {
  slidingWindowSize: number
  percentile: number
  scalar: number
}

export interface TaskCoordinatorConfig {
  prefetchCoordinatorBufferedPositionMillisRelease: number
  prefetchCoordinatorBufferedPositionMillisPause: number
}

export interface Storyboards {
  playerStoryboardSpecRenderer: PlayerStoryboardSpecRenderer
}

export interface PlayerStoryboardSpecRenderer {
  spec: string
  recommendedLevel: number
}

export interface Attestation {
  playerAttestationRenderer: PlayerAttestationRenderer
}

export interface PlayerAttestationRenderer {
  challenge: string
}
