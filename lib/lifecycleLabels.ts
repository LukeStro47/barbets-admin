import type { GroupLifecycleState } from '@/lib/actions/groups';
import type { UserEngagementSegment } from '@/lib/actions/users';

/** Semantic color per state, separate from the honey accent hue — a scannable
 *  good/warning/critical read at a glance, not a decorative palette choice. */
export const GROUP_STATE_LABEL: Record<GroupLifecycleState, string> = {
  new: 'New',
  active: 'Active',
  cooling: 'Cooling',
  stale: 'Stale',
  winding_down: 'Winding down',
  intermission: 'Intermission',
  scheduled_for_deletion: 'Scheduled for deletion',
  dormant: 'Dormant',
};

export const GROUP_STATE_BADGE: Record<GroupLifecycleState, string> = {
  new: 'bg-honey-100 text-honey-800',
  active: 'bg-success-100 text-success-700',
  cooling: 'bg-honey-100 text-honey-800',
  stale: 'bg-danger-100 text-danger-700',
  winding_down: 'bg-espresso-100 text-espresso-600',
  intermission: 'bg-espresso-100 text-espresso-600',
  scheduled_for_deletion: 'bg-danger-100 text-danger-700',
  dormant: 'bg-espresso-50 text-espresso-400',
};

export const USER_SEGMENT_LABEL: Record<UserEngagementSegment, string> = {
  new: 'New',
  power: 'Power',
  casual: 'Casual',
  at_risk: 'At risk',
  dormant: 'Dormant',
  churned: 'Churned',
};

export const USER_SEGMENT_BADGE: Record<UserEngagementSegment, string> = {
  new: 'bg-honey-100 text-honey-800',
  power: 'bg-success-100 text-success-700',
  casual: 'bg-espresso-100 text-espresso-600',
  at_risk: 'bg-honey-100 text-honey-800',
  dormant: 'bg-espresso-50 text-espresso-400',
  churned: 'bg-danger-100 text-danger-700',
};
