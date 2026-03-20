export async function withApiHandler<T>(apiCall: () => Promise<T>): Promise<T> {
  try {
    return await apiCall()
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Erreur inconnue'

    throw new Error(message)
  }
}
