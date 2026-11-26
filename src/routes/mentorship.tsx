import {createFileRoute} from '@tanstack/react-router';
import {publicQuery} from '@/lib/bridge.functions';
import {pageHead} from '@/lib/metadata';
import {PeoplePage} from '@/components/people-page';
export const Route=createFileRoute('/mentorship')({head:()=>pageHead('Professional mentorship','Find experienced mentors to guide your career journey and build local professional connections.'),loader:({context})=>context.queryClient.ensureQueryData(publicQuery),component:Mentorship});
function Mentorship(){return <PeoplePage mentors/>}
