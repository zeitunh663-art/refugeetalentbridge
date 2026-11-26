import { createContext,useContext,useEffect,useState,type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useRouter } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
const AuthContext=createContext<{user:User|null;ready:boolean}>({user:null,ready:false});
export function AuthProvider({children}:{children:ReactNode}) {
 const [user,setUser]=useState<User|null>(null); const [ready,setReady]=useState(false); const router=useRouter(); const queryClient=useQueryClient();
 useEffect(()=>{ let active=true; const {data:{subscription}}=supabase.auth.onAuthStateChange((event,session)=>{if(active){setUser(session?.user??null);setReady(true);} if(event==='SIGNED_IN'||event==='SIGNED_OUT'||event==='USER_UPDATED'){void router.invalidate();if(event!=='SIGNED_OUT')void queryClient.invalidateQueries();}}); void supabase.auth.getUser().then(({data})=>{if(active){setUser(data.user);setReady(true);}}); return()=>{active=false;subscription.unsubscribe();}; },[router,queryClient]);
 return <AuthContext.Provider value={{user,ready}}>{children}</AuthContext.Provider>;
}
export const useAuth=()=>useContext(AuthContext);
