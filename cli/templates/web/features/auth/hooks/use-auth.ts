export function useAuth() {
  return {
    isAuthenticated: false,
    user: null,
    login: async () => {
      throw new Error('Auth not configured. Run: vllnt add auth')
    },
    logout: async () => {
      throw new Error('Auth not configured. Run: vllnt add auth')
    },
  }
}
