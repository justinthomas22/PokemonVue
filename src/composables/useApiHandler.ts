export async function withApiHandler<T>(apiCall: () => Promise<T>): Promise<T> {
  try {
    return await apiCall()
  } catch (e: unknown) {
    const err = e as unknown
    const message = err?.message || 'Erreur inconnue'
    throw new Error(message)
  }
}
