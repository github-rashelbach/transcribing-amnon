export interface UserDomain {
  userId: string;
  usages: UsageDomain[];
}

export interface UsageDomain {
  createdAt: string;
  duration: number;
}
