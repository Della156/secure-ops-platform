'use client';

import { ResourceAccessLog } from '@/components/Common/ResourceAccessLog';

export function EndpointAccessLog() {
  return <ResourceAccessLog resourceType="endpoint" />;
}