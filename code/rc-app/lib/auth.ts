// Authentication helper functions

export interface User {
  gebruikerId: number;
  gebruikerNaam: string;
  naam: string;
  gebruikerTypeId: number;
  gebruikerType: {
    gebruikerTypeId: number;
    typeNaam: string;
  };
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

export function isAuthenticated(): boolean {
  return !!getUser();
}

export async function logout() {
  try {
    const { logoutAction } = await import('@/lib/actions/auth');
    await logoutAction();
  } catch (error) {
    console.error('Logout error:', error);
  }

  localStorage.removeItem('user');
  
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

export function getUserType(): string | null {
  const user = getUser();
  return user?.gebruikerType.typeNaam || null;
}

export function isAdmin(): boolean {
  return getUserType() === 'Admin';
}

export function isBalie(): boolean {
  return getUserType() === 'Balie';
}

export function isStudent(): boolean {
  return getUserType() === 'Student';
}

export function getAuthHeaders(): HeadersInit {
  return {};
}
