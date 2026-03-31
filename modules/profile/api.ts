import apiClient from '@/lib/api-client';

export interface UserProfile {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  role: string;
  company_id: number | null;
}

export interface CompanyProfile {
  id: number;
  name: string;
  abn: string | null;
  acn: string | null;
  bas: string | null;
  stn: string | null;
  tax_enabled: boolean;
  invoice_template: string;
  accent_color: string;
}

export interface TeamMember {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
}

export interface Plan {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  perks: { id: number; feature: string; limit_value: number | null; is_boolean: boolean }[];
}

// Unwrap axios errors so handleApiError receives the API response body,
// matching the same pattern used in modules/auth/api.ts
function unwrapError(error: any): never {
  if (error?.response?.data) throw error.response.data;
  throw error;
}

export const getMyProfile = async (): Promise<UserProfile> => {
  try {
    const res = await apiClient.get('/profile/me');
    return res.data.data;
  } catch (error) { unwrapError(error); }
};

export const updateMyProfile = async (
  data: Partial<Pick<UserProfile, 'first_name' | 'last_name' | 'phone_number'>>
): Promise<UserProfile> => {
  try {
    const res = await apiClient.patch('/profile/me', data);
    return res.data.data;
  } catch (error) { unwrapError(error); }
};

export const createCompany = async (name: string): Promise<CompanyProfile> => {
  try {
    const res = await apiClient.post('/profile/company', { name });
    return res.data.data;
  } catch (error) { unwrapError(error); }
};

export const getCompany = async (): Promise<CompanyProfile> => {
  try {
    const res = await apiClient.get('/profile/company');
    return res.data.data;
  } catch (error) { unwrapError(error); }
};

export const updateCompany = async (
  data: Partial<Omit<CompanyProfile, 'id'>>
): Promise<CompanyProfile> => {
  try {
    const res = await apiClient.patch('/profile/company', data);
    return res.data.data;
  } catch (error) { unwrapError(error); }
};

export const getTeam = async (): Promise<TeamMember[]> => {
  try {
    const res = await apiClient.get('/profile/team');
    return res.data.data;
  } catch (error) { unwrapError(error); }
};

export const inviteTeamMember = async (
  data: { email: string; first_name: string; last_name?: string }
): Promise<TeamMember> => {
  try {
    const res = await apiClient.post('/profile/team/invite', data);
    return res.data.data;
  } catch (error) { unwrapError(error); }
};

export const removeTeamMember = async (userId: number): Promise<void> => {
  try {
    await apiClient.delete(`/profile/team/${userId}`);
  } catch (error) { unwrapError(error); }
};

export const getPlans = async (): Promise<Plan[]> => {
  try {
    const res = await apiClient.get('/profile/plans');
    return res.data.data;
  } catch (error) { unwrapError(error); }
};

export const switchPlan = async (planSlug: string): Promise<void> => {
  try {
    await apiClient.post('/auth/subscription', { plan_slug: planSlug });
  } catch (error) { unwrapError(error); }
};
