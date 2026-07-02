import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "@/services/projectsService";
import { normalizeProjects } from "@/lib/crm/normalizeProjects";

export function useProjects(params: any) {
  return useQuery({
    queryKey: ["projects", params],
    queryFn: async () => {
      const res = await fetchProjects(params);
      return {
        ...res,
        data: normalizeProjects(res.data)
      };
    }
  });
}