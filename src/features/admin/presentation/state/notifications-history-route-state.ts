import type { NotificationsHistoryState, NotificationReadStatus } from "@/features/admin/domain/entities/notifications-history";

export type NotificationsHistoryRouteParams = {
  state?: NotificationsHistoryState | null;
  q?: string | null;
  filter?: boolean | null;
  statusFilter?: NotificationReadStatus | null;
  from?: string | null;
  to?: string | null;
  selected?: string | null;
  delete?: number | null;
  deleteAll?: boolean | null;
  success?: string | null;
};

export function buildNotificationsHistoryHref(params: NotificationsHistoryRouteParams) {
  const search = new URLSearchParams();
  if (params.state && params.state !== "populated") search.set("state", params.state);
  if (params.q) search.set("q", params.q);
  if (params.filter) search.set("filter", "1");
  if (params.statusFilter) search.set("statusFilter", params.statusFilter);
  if (params.from) search.set("from", params.from);
  if (params.to) search.set("to", params.to);
  if (params.selected) search.set("selected", params.selected);
  if (params.delete) search.set("delete", String(params.delete));
  if (params.deleteAll) search.set("deleteAll", "1");
  if (params.success) search.set("success", params.success);
  const query = search.toString();
  return query ? `/notifications-history?${query}` : "/notifications-history";
}
