// Mock extendido de Supabase para tests
const _mockDb = {
  agent_activities: [],
  campaigns: [],
  leads: [],
  tenants: [],
  users: [],
};

function resetTable(table) {
  if (_mockDb[table]) _mockDb[table] = [];
}

export const supabase = {
  from: (table) => ({
    select: () => ({
      eq: (field, value) => ({
        order: () => ({
          limit: () => {
            const data = (_mockDb[table] || []).filter(row =>
              value === undefined || row[field] === value
            );
            return { data, error: null };
          },
        }),
      }),
    }),
    insert: (data) => {
      if (!_mockDb[table]) _mockDb[table] = [];
      const arr = Array.isArray(data) ? data : [data];
      _mockDb[table].push(...arr);
      return { select: () => ({ single: () => ({ data: arr[0], error: null }) }) };
    },
    update: (data) => ({
      eq: () => ({
        select: () => ({ single: () => ({ data: { ...data }, error: null }) })
      })
    }),
    delete: () => ({ eq: () => ({}) }),
  }),
  clearHistory: () => {
    Object.keys(_mockDb).forEach(resetTable);
  },
  clearMockData: () => {
    Object.keys(_mockDb).forEach(resetTable);
  },
  addMockData: (table, data) => {
    if (!_mockDb[table]) _mockDb[table] = [];
    _mockDb[table].push(data);
  },
  getHistory: () => {
    return {
      inserts: Object.entries(_mockDb).flatMap(([table, rows]) =>
        (rows || []).map(row => ({ table, data: row }))
      ),
      updates: [],
      deletes: [],
    };
  },
  reset: () => {
    Object.keys(_mockDb).forEach(resetTable);
  },
  rollback: () => {
    Object.keys(_mockDb).forEach(resetTable);
  },
  query: (table, { filters }) => {
    const data = (_mockDb[table] || []).filter(row =>
      Object.entries(filters).every(([k, v]) => row[k] === v)
    );
    return { success: true, data };
  },
};
export const mockSupabaseService = supabase;
export default supabase; 