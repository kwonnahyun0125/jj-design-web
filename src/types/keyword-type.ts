export type GetKeywordsQuery = {
  page: number; // 1+
  pageSize: number; // 1~100
  q?: string; // 이름 검색
  sort?: 'name' | 'createdAt';
  order?: 'asc' | 'desc';
};

export type KeywordList = {
  id: number;
  name: string;
  createdAt: string;
};
