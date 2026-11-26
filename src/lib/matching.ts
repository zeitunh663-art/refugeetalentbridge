export function matchScore(skills: string[], required: string[]) {
 if (!required.length || !skills.length) return 0;
 const normalized = new Set(skills.map(s => s.trim().toLowerCase()));
 return Math.round(required.filter(s => normalized.has(s.trim().toLowerCase())).length / required.length * 100);
}
export function canApply(role: string, status: string, deadline: string, today: string) { return role === 'seeker' && status === 'published' && deadline >= today; }
export function publicRole(role: string) { return ['seeker','mentor','employer'].includes(role) ? role : 'seeker'; }
