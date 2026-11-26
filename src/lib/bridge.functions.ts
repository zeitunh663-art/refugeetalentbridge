import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import type { Database } from '@/integrations/supabase/types';
import { queryOptions } from '@tanstack/react-query';
export const getPublicData = createServerFn({method:'GET'}).handler(async () => {
 const key=process.env['SUPABASE_PUBLISHABLE_KEY']; const url=process.env['SUPABASE_URL'];
 if(!key || !url) throw new Error('Connection unavailable');
 const client=createClient<Database>(url,key,{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:(input,init)=>{const headers=new Headers(init?.headers); if(key.startsWith('sb_') && headers.get('Authorization')===`Bearer ${key}`) headers.delete('Authorization'); headers.set('apikey',key); return fetch(input,{...init,headers});}}});
 const [opportunities,people]=await Promise.all([client.from('opportunities').select('*').eq('status','published').order('created_at',{ascending:false}),client.from('directory').select('*').order('display_name')]);
 if(opportunities.error || people.error) throw new Error('Unable to load opportunities. Please try again.');
 return {opportunities:opportunities.data??[],people:people.data??[]};
});
export const publicQuery=queryOptions({queryKey:['public-data'],queryFn:()=>getPublicData(),staleTime:60000});
export const getDashboard = createServerFn({method:'GET'}).middleware([requireSupabaseAuth]).handler(async({context})=>{
 const client=context.supabase; const userId=context.userId;
 const [profile,role,applications,requests,documents,opportunities,connections]=await Promise.all([
 client.from('profiles').select('*').eq('id',userId).single(),client.from('user_roles').select('role').eq('user_id',userId).single(),
 client.from('applications').select('*, opportunities(title, organization), profiles(display_name, headline, skills), documents(name,path)').order('created_at',{ascending:false}),
 client.from('mentorship_requests').select('*, directory(display_name,user_id), profiles(display_name)').order('created_at',{ascending:false}),
 client.from('documents').select('*').eq('user_id',userId),client.from('opportunities').select('*').eq('owner_id',userId).order('created_at',{ascending:false}),client.from('connections').select('*,directory(display_name,headline)')]);
 const results=[profile,role,applications,requests,documents,opportunities,connections];
 if(results.some(r=>r.error)) throw new Error('Unable to load your dashboard. Please try again.');
 const isAdmin=role.data?.role==='admin';
 const admin=isAdmin? await Promise.all([client.from('profiles').select('*'),client.from('opportunities').select('*').order('created_at',{ascending:false}),client.from('user_roles').select('*')]):null;
 return {userId,profile:profile.data,role:role.data?.role??'seeker',applications:applications.data??[],requests:requests.data??[],documents:documents.data??[],opportunities:opportunities.data??[],connections:connections.data??[],admin:admin?{profiles:admin[0]?.data??[],opportunities:admin[1]?.data??[],roles:admin[2]?.data??[]}:null};
});
export const dashboardQuery=queryOptions({queryKey:['dashboard'],queryFn:()=>getDashboard(),staleTime:15000});
