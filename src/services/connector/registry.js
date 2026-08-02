/**
 * Resource registry — the single source of truth that lets one connector call
 * serve either backend. Each resource maps to:
 *   - collection: the Firestore collection name (mirrors the Django db_table so a
 *                 future Django reconnect is 1:1).
 *   - idField:    the natural key used as the Firestore document id, or null to
 *                 use an auto-generated id.
 *   - django:     path builders for the existing Django REST endpoints. Paths are
 *                 written exactly as the frontend calls them today (leading slash,
 *                 prepended with REACT_APP_API_BASE_URL). `null` means the Django
 *                 backend has no such operation. `extra` holds irregular endpoints.
 *
 * Derived from Django_Backend/backend_api/urls.py and transaction_api/urls.py.
 */

export const RESOURCES = {
  todos: {
    collection: 'todos',
    idField: null,
    django: {
      list: () => '/api',
      create: () => '/api',
      detail: id => `/api/${id}/`,
      update: id => `/api/${id}/`,
      remove: id => `/api/${id}/`,
    },
  },

  persons: {
    collection: 'persons',
    idField: null,
    django: {
      list: null,
      create: () => '/person/create/',
      detail: id => `/person/${id}/`,
      update: null,
      remove: null,
    },
  },

  partTimers: {
    collection: 'PartTimer',
    idField: null,
    django: {
      list: null,
      create: () => '/part-timer/',
      detail: userId => `/get-part-timer/${userId}/`,
      update: null,
      remove: null,
    },
  },

  roles: {
    collection: 'role',
    idField: null,
    django: {
      list: () => '/roles/all/',
      create: () => '/roles/add/',
      detail: id => `/roles/${id}/`,
      update: id => `/roles/update/${id}/`,
      remove: id => `/roles/delete/${id}/`,
    },
  },

  colleges: {
    collection: 'collegelist',
    idField: null,
    django: {
      list: () => '/colleges/all/',
      create: () => '/colleges/create/',
      detail: id => `/colleges/${id}/`,
      update: id => `/colleges/${id}/update/`,
      remove: id => `/colleges/${id}/delete/`,
    },
  },

  collegeDetails: {
    collection: 'social_links',
    idField: null,
    django: {
      list: () => '/college_details/',
      create: () => '/college_details/create/',
      detail: null,
      update: id => `/college_details/${id}/update/`,
      remove: id => `/college_details/${id}/delete/`,
    },
  },

  accessRoles: {
    collection: 'access_roles',
    idField: null,
    django: {
      list: () => '/api/user_and_role_overview/',
      create: () => '/assignrole/',
      detail: null,
      update: null,
      remove: id => `/deleteRole/${id}/`,
    },
  },

  employers: {
    collection: 'employer_details',
    idField: null,
    django: {
      list: () => '/employers/',
      create: () => '/employers/',
      detail: id => `/employers/${id}/`,
      update: id => `/employers/${id}/`,
      remove: id => `/employers/${id}/`,
    },
  },

  recruiters: {
    collection: 'recrutier_details',
    idField: null,
    django: {
      list: () => '/recruiters/',
      create: () => '/recruiters/',
      detail: id => `/recruiters/${id}/`,
      update: id => `/recruiters/${id}/`,
      remove: id => `/recruiters/${id}/`,
    },
  },

  consultants: {
    collection: 'consultant_details',
    idField: null,
    django: {
      list: () => '/api/consultants/',
      create: () => '/api/consultant/',
      detail: id => `/api/consultants/${id}/`,
      update: id => `/api/consultants/${id}/`,
      remove: id => `/consultants/delete/${id}/`,
    },
  },

  statusConsultant: {
    collection: 'status_consultant',
    idField: null,
    django: {
      list: () => '/status-consultants/',
      create: () => '/status-consultants/',
      detail: id => `/status-consultants/${id}/`,
      update: id => `/status-consultants/${id}/`,
      remove: id => `/status-consultants/${id}/`,
    },
  },

  users: {
    collection: 'User',
    idField: 'user_id',
    django: {
      list: () => '/api/user_and_role_overview/',
      create: () => '/user/log-first-time/',
      detail: null,
      update: null,
      remove: null,
    },
  },

  packages: {
    collection: 'Packages',
    idField: null,
    django: {
      list: () => '/packages/',
      create: () => '/packages/',
      detail: id => `/packages/${id}/`,
      update: id => `/packages/${id}/`,
      remove: id => `/packages/${id}/`,
    },
  },

  acsParttimerStatus: {
    collection: 'PartTimer_status',
    idField: null,
    django: {
      list: () => '/acs_parttimer_status_all',
      create: () => '/acs_parttimer_status_create',
      detail: parttimerId => `/acs_parttimer_status/${parttimerId}`,
      update: () => '/acs_parttimer_status_update',
      remove: () => '/acs_parttimer_status_delete',
      extra: {
        byIdAndDate: (id, date) => `/acs_parttimer_status/${id}/${date}`,
      },
    },
  },

  statusUpdates: {
    collection: 'Status_updates',
    idField: null,
    django: {
      list: () => '/get_status_update',
      create: () => '/create_status_update',
      detail: userId => `/get_status_by_id/${userId}`,
      update: () => '/update_status_by_id',
      remove: () => '/delete_status_by_id',
      extra: {
        ids: () => '/get_status_ids',
      },
    },
  },

  products: {
    collection: 'ShopingProduct',
    idField: null,
    django: {
      list: () => '/products/',
      create: () => '/products/add/',
      detail: id => `/products/${id}/`,
      update: id => `/products/update/${id}/`,
      remove: id => `/products/delete/${id}/`,
    },
  },

  teamMembers: {
    collection: 'team_member',
    idField: null,
    django: {
      list: () => '/team_members/',
      create: () => '/team_members/add/',
      detail: id => `/team_members/${id}/`,
      update: id => `/team_members/update/${id}/`,
      remove: id => `/team_members/delete/${id}/`,
    },
  },

  devices: {
    collection: 'device_allocation',
    idField: null,
    django: {
      list: () => '/devices/',
      create: () => '/devices/add/',
      detail: id => `/devices/${id}/`,
      update: id => `/devices/update/${id}/`,
      remove: id => `/devices/delete/${id}/`,
    },
  },

  happinessIndex: {
    collection: 'happiness_index',
    idField: null,
    django: {
      list: () => '/happiness-index/',
      // Alternate list endpoint (HappinessIndexListView) used by some pages.
      listAliases: ['/happiness/'],
      create: userId => `/happiness-index/add/${userId}/`,
      detail: userId => `/happiness-index/${userId}/`,
      update: null,
      remove: null,
      extra: {
        listView: () => '/happiness/',
      },
    },
  },

  subsidiaries: {
    collection: 'subsidiary',
    idField: null,
    django: {
      list: () => '/subsidiaries/',
      create: () => '/subsidiaries/add/',
      detail: id => `/subsidiaries/${id}/`,
      update: id => `/subsidiaries/update/${id}/`,
      remove: id => `/subsidiaries/delete/${id}/`,
    },
  },

  transactions: {
    collection: 'transactions',
    idField: null,
    django: {
      list: () => '/transactions/',
      create: () => '/transactions/create/',
      detail: id => `/transaction/${id}/`,
      update: id => `/transactions/${id}/update/`,
      remove: id => `/transactions/${id}/delete/`,
      extra: {
        filter: () => '/transactions/filter/',
        aps: () => '/transactions/aps/',
      },
    },
  },
};

/**
 * Compute endpoints — NOT storage. Implemented as Firebase Callable Functions
 * (see functions/index.js) and called via services/connector/functions.js, which
 * is independent of the Firebase|Django data toggle. `django` is the legacy path
 * (null where the logic previously ran client-side).
 */
export const FUNCTIONS = {
  parseResume: { django: () => '/api/parse-resume/', fn: 'parseResume' },
  defaultWords: { django: () => '/api/default-words/', fn: 'getDefaultWords' },
  aiSuggestions: { django: null, fn: 'aiSuggestions' },
};

export const getResource = name => {
  const r = RESOURCES[name];
  if (!r) throw new Error(`[connector] unknown resource "${name}"`);
  return r;
};

const ID = '§ID§'; // sentinel unlikely to appear in a real path

function pathToRegex(pattern) {
  const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp('^' + escaped.split(ID).join('([^/]+)') + '$');
}

/**
 * Reverse-map a Django REST URL (as used by the legacy useApis layer) to a
 * connector resource + operation, so the generic data hooks can serve either
 * backend. Returns { resource, op, id } or null when no standard resource
 * matches — callers then fall back to the raw Django path (unchanged behavior).
 * Only the regular list/create/detail/update/remove endpoints are mapped;
 * irregular ones (e.g. /get_status_by_id/:id) intentionally return null.
 */
export function resolveDjangoUrl(method, rawUrl) {
  const url = (rawUrl || '').split('?')[0];
  const m = (method || 'GET').toUpperCase();

  const matchId = builder => {
    if (!builder) return null;
    const match = url.match(pathToRegex(builder(ID)));
    return match ? match[1] : null;
  };
  const matchStatic = builder => (builder && builder() === url ? true : false);

  for (const [resource, def] of Object.entries(RESOURCES)) {
    const d = def.django;
    if (m === 'GET') {
      if (matchStatic(d.list)) return { resource, op: 'list' };
      if ((d.listAliases || []).includes(url)) return { resource, op: 'list' };
      const id = matchId(d.detail);
      if (id != null) return { resource, op: 'get', id };
    } else if (m === 'POST') {
      if (matchStatic(d.create)) return { resource, op: 'create' };
    } else if (m === 'PUT' || m === 'PATCH') {
      const id = matchId(d.update);
      if (id != null) return { resource, op: 'update', id };
    } else if (m === 'DELETE') {
      const id = matchId(d.remove);
      if (id != null) return { resource, op: 'remove', id };
    }
  }
  return null;
}
