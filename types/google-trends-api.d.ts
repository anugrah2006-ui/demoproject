declare module 'google-trends-api' {
  const googleTrends: { relatedQueries: (opts: Record<string, unknown>) => Promise<string> }; export default googleTrends; }
