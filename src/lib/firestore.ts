// Direct Firestore client using REST API
// This works without Firebase SDK initialization issues

const PROJECT_ID = process.env.NEXT_PUBLIC_GCLOUD_PROJECT || 'a2-invsjd-workspace';
const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

interface FirestoreValue {
  stringValue?: string;
  integerValue?: string;
  booleanValue?: boolean;
  timestampValue?: string;
  arrayValue?: { values: FirestoreValue[] };
  mapValue?: { fields: Record<string, FirestoreValue> };
}

interface FirestoreDocument {
  name: string;
  fields: Record<string, FirestoreValue>;
  createTime: string;
  updateTime: string;
}

// Convert JS value to Firestore value
function toFirestoreValue(value: unknown): FirestoreValue {
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'number') return { integerValue: String(value) };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(toFirestoreValue) } };
  if (typeof value === 'object' && value !== null) {
    const fields: Record<string, FirestoreValue> = {};
    for (const [k, v] of Object.entries(value)) {
      fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(value) };
}

// Convert Firestore value to JS value
function fromFirestoreValue(value: FirestoreValue): unknown {
  if (value.stringValue !== undefined) return value.stringValue;
  if (value.integerValue !== undefined) return parseInt(value.integerValue, 10);
  if (value.booleanValue !== undefined) return value.booleanValue;
  if (value.timestampValue !== undefined) return new Date(value.timestampValue);
  if (value.arrayValue) return value.arrayValue.values?.map(fromFirestoreValue) || [];
  if (value.mapValue) {
    const obj: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value.mapValue.fields || {})) {
      obj[k] = fromFirestoreValue(v);
    }
    return obj;
  }
  return null;
}

// Convert Firestore document to JS object
function fromFirestoreDoc(doc: FirestoreDocument): Record<string, unknown> & { id: string } {
  const id = doc.name.split('/').pop() || '';
  const data: Record<string, unknown> = { id };
  for (const [key, value] of Object.entries(doc.fields || {})) {
    data[key] = fromFirestoreValue(value);
  }
  return data as Record<string, unknown> & { id: string };
}

export async function getDocument(collection: string, docId: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(`${FIRESTORE_URL}/${collection}/${docId}`);
    if (!res.ok) return null;
    const doc = await res.json();
    return fromFirestoreDoc(doc);
  } catch {
    return null;
  }
}

export async function setDocument(collection: string, docId: string, data: Record<string, unknown>): Promise<boolean> {
  try {
    const fields: Record<string, FirestoreValue> = {};
    for (const [key, value] of Object.entries(data)) {
      if (key !== 'id') {
        fields[key] = toFirestoreValue(value);
      }
    }

    const res = await fetch(`${FIRESTORE_URL}/${collection}/${docId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function createDocument(collection: string, data: Record<string, unknown>): Promise<string | null> {
  try {
    const fields: Record<string, FirestoreValue> = {};
    for (const [key, value] of Object.entries(data)) {
      if (key !== 'id') {
        fields[key] = toFirestoreValue(value);
      }
    }

    const res = await fetch(`${FIRESTORE_URL}/${collection}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields }),
    });
    
    if (!res.ok) return null;
    const doc = await res.json();
    return doc.name.split('/').pop() || null;
  } catch {
    return null;
  }
}

export async function deleteDocument(collection: string, docId: string): Promise<boolean> {
  try {
    const res = await fetch(`${FIRESTORE_URL}/${collection}/${docId}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function queryCollection(collection: string): Promise<Array<Record<string, unknown> & { id: string }>> {
  try {
    const res = await fetch(`${FIRESTORE_URL}/${collection}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.documents || []).map(fromFirestoreDoc);
  } catch {
    return [];
  }
}

export async function queryByField(
  collection: string, 
  field: string, 
  value: string
): Promise<Array<Record<string, unknown> & { id: string }>> {
  try {
    const res = await fetch(`${FIRESTORE_URL}:runQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: collection }],
          where: {
            fieldFilter: {
              field: { fieldPath: field },
              op: 'EQUAL',
              value: { stringValue: value },
            },
          },
        },
      }),
    });

    if (!res.ok) return [];
    const results = await res.json();
    return results
      .filter((r: { document?: FirestoreDocument }) => r.document)
      .map((r: { document: FirestoreDocument }) => fromFirestoreDoc(r.document));
  } catch {
    return [];
  }
}
