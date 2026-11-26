import {createFileRoute} from '@tanstack/react-router';
import {publicQuery} from '@/lib/bridge.functions';
import {pageHead} from '@/lib/metadata';
import {PeoplePage} from '@/components/people-page';
export const Route=createFileRoute('/network')({head:()=>pageHead('Our community','Discover professionals and build a supportive network that values your talent.'),loader:({context})=>context.queryClient.ensureQueryData(publicQuery),component:PeoplePage});
